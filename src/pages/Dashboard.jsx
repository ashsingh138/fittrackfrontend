import React, { useState } from 'react';
import { differenceInDays, format } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { TrendingDown, Activity, Calendar, Trophy, Droplets, Dumbbell } from 'lucide-react';
import { calculateBMI, calculateWaistHipRatio, getWeeklyStats, getBadges } from '../utils/fitnessHelpers';

export default function Dashboard({ data }) {
  const [filterDays, setFilterDays] = useState(30);

  // 1. Basic Data Prep
  const todayStr = new Date().toISOString().split('T')[0];
  const dayName = format(new Date(), 'EEEE'); // e.g., "Monday"
  const targetDate = new Date(data.settings.targetDate);
  const daysLeft = differenceInDays(targetDate, new Date());
  
  // NEW: Get schedule from user data (Dynamic!)
  const todaySchedule = data.workoutSchedule?.[dayName] || { focus: "Rest Day", exercises: [] };

  const lastMeasurement = data.measurements[0] || {};
  const todayDiet = data.diet.find(d => d.date === todayStr) || { water: 0, score: 0 };
  const todayWorkout = data.workouts.find(w => w.date === todayStr);

  const stats = getWeeklyStats(data.measurements, data.workouts, data.diet);
  const badges = getBadges(data.workouts, data.diet, data.measurements, data.settings);

  // Progress Calcs
  const startWeight = data.settings.startWeight || lastMeasurement.weight || 0;
  const currentWeight = lastMeasurement.weight || 0;
  const targetWeight = data.settings.targetWeight || 0;
  const weightLost = (startWeight - currentWeight).toFixed(1);
  const weightTotalGoal = (startWeight - targetWeight).toFixed(1);
  const weightProgress = Math.min(100, Math.max(0, (weightLost / weightTotalGoal) * 100));
  
  // Restored: Metrics Calculation
  const bmi = calculateBMI(currentWeight, data.settings.height);
  const whRatio = calculateWaistHipRatio(lastMeasurement.waistLower, lastMeasurement.hip);

  const graphData = [...data.measurements]
    .filter(m => differenceInDays(new Date(), new Date(m.date)) <= filterDays)
    .reverse();

  return (
    <div className="space-y-6 pb-10">
      {/* HEADER & BADGES */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Transformation Dashboard</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Target: Feb 15 ({daysLeft} days left)</p>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {badges.map((b, i) => (
            <div key={i} className={`flex items-center gap-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-3 py-1 rounded-full text-xs font-bold shadow-sm ${b.color}`}>
              <span>{b.icon}</span> {b.text}
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        
        {/* COLUMN 1: DAILY ACTIONS & WORKOUT */}
        <div className="space-y-6">
          
          {/* TODAY'S FOCUS CARD (Dynamic) */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl text-white shadow-lg overflow-hidden flex flex-col">
             <div className="p-6 pb-4">
               <div className="flex items-center gap-2 mb-2 opacity-80 text-sm font-medium uppercase tracking-wider">
                 <Calendar size={14} /> Today's Focus: {dayName}
               </div>
               <h3 className="text-3xl font-bold mb-1">{todaySchedule.focus}</h3>
             </div>
             
             {/* Exercise Checklist */}
             <div className="bg-white/10 backdrop-blur-sm flex-1 p-4">
               {todaySchedule.exercises && todaySchedule.exercises.length > 0 ? (
                 <ul className="space-y-2">
                   {todaySchedule.exercises.map((ex, idx) => (
                     <li key={idx} className="flex items-start gap-3 text-sm font-medium text-blue-50">
                       <span className="mt-1 block min-w-[6px] h-[6px] rounded-full bg-blue-300"></span>
                       <span>{ex}</span>
                     </li>
                   ))}
                 </ul>
               ) : (
                 <p className="text-blue-200 text-sm italic">No specific exercises assigned.</p>
               )}
             </div>
          </div>

          {/* Daily Status Card */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
             <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Daily Status</h3>
             <div className="space-y-4">
               <div className="flex justify-between items-center">
                 <div className="flex items-center gap-3">
                   <div className={`p-2 rounded-lg ${todayWorkout?.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                     <Dumbbell size={20} />
                   </div>
                   <span className="text-gray-700 dark:text-gray-300 font-medium">Workout</span>
                 </div>
                 {todayWorkout?.completed ? <span className="text-green-500 font-bold">✔ Done</span> : <span className="text-gray-400 text-sm">Not yet</span>}
               </div>

               <div className="flex justify-between items-center">
                 <div className="flex items-center gap-3">
                   <div className={`p-2 rounded-lg ${todayDiet.score >= 8 ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                     <Activity size={20} />
                   </div>
                   <span className="text-gray-700 dark:text-gray-300 font-medium">Diet Clean</span>
                 </div>
                 {todayDiet.score >= 8 ? <span className="text-green-500 font-bold">✔ Yes</span> : <span className="text-gray-400 text-sm">--</span>}
               </div>

               <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-100 text-blue-600"><Droplets size={20} /></div>
                    <span className="text-gray-700 dark:text-gray-300 font-medium">Water</span>
                  </div>
                  <span className="font-bold text-blue-600">{todayDiet.water || 0} / 3 L</span>
               </div>
             </div>
          </div>
        </div>

        {/* COLUMN 2 & 3: METRICS & GRAPHS */}
        <div className="space-y-6 md:col-span-2">
           {/* Weekly Snapshot + Body Metrics (RESTORED) */}
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
             <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
               <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">This Week</h3>
               <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl">
                     <div className="text-gray-500 dark:text-gray-400 text-xs uppercase">Workouts</div>
                     <div className="text-xl font-bold text-gray-900 dark:text-white">{stats.workoutCount} / 6</div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl">
                     <div className="text-gray-500 dark:text-gray-400 text-xs uppercase">Diet Avg</div>
                     <div className="text-xl font-bold text-gray-900 dark:text-white">{stats.dietAvg}</div>
                  </div>
               </div>
             </div>

             {/* RESTORED: Body Metrics Card */}
             <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Body Metrics</h3>
                <div className="flex justify-between divide-x divide-gray-200 dark:divide-gray-700">
                  <div className="px-2 flex-1 text-center">
                     <div className="text-xl font-bold text-gray-900 dark:text-white">{bmi}</div>
                     <div className="text-xs text-gray-500">BMI</div>
                  </div>
                  <div className="px-2 flex-1 text-center">
                     <div className="text-xl font-bold text-gray-900 dark:text-white">{whRatio}</div>
                     <div className="text-xs text-gray-500">Waist/Hip</div>
                  </div>
                  <div className="px-2 flex-1 text-center">
                     <div className="text-xl font-bold text-gray-900 dark:text-white">{currentWeight}</div>
                     <div className="text-xs text-gray-500">Kg</div>
                  </div>
                </div>
             </div>
           </div>

           {/* Progress Bar */}
           <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
             <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500 dark:text-gray-400">Weight Goal ({targetWeight}kg)</span>
                  <span className="font-bold text-blue-600">{Math.round(weightProgress)}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div className="bg-blue-600 h-3 rounded-full transition-all" style={{ width: `${weightProgress}%` }}></div>
                </div>
                <p className="text-xs text-gray-400 mt-1">{weightLost}kg lost total</p>
             </div>
           </div>

           {/* MAIN CHART */}
           <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <TrendingDown size={20} className="text-blue-500" /> Stats History
                </h3>
                <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                   {[30, 999].map(d => (
                     <button key={d} onClick={() => setFilterDays(d)} className={`px-3 py-1 text-xs rounded-md ${filterDays === d ? 'bg-white dark:bg-gray-600 shadow font-bold text-gray-900 dark:text-white' : 'text-gray-500'}`}>
                       {d === 999 ? 'All' : '30 Days'}
                     </button>
                   ))}
                </div>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={graphData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                    <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} tickFormatter={(str) => str.slice(5)} />
                    <YAxis yAxisId="left" stroke="#3B82F6" fontSize={12} domain={['auto', 'auto']} />
                    <YAxis yAxisId="right" orientation="right" stroke="#EC4899" fontSize={12} domain={['auto', 'auto']} />
                    <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', color: '#fff' }} />
                    <Line yAxisId="left" type="monotone" dataKey="weight" stroke="#3B82F6" strokeWidth={2} dot={{ r: 4 }} name="Weight" />
                    <Line yAxisId="right" type="monotone" dataKey="waistLower" stroke="#EC4899" strokeWidth={2} dot={{ r: 4 }} name="Waist" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}