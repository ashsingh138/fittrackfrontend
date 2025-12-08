import React, { useState } from 'react';
import { Plus, Trash2, Clock, Dumbbell, Activity } from 'lucide-react';

const WORKOUT_TYPES = [
  "Chest",
  "Back",
  "Shoulders",
  "Biceps",
  "Triceps",
  "Legs (Quads/Hams)",
  "Abs / Core",
  "Cardio",
  "Full Body",
  "Rest Day",
  "Other"
];

export default function Workouts({ data, onAdd }) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Workout Type State
  const [workoutType, setWorkoutType] = useState('Chest');
  const [customType, setCustomType] = useState(''); // For "Other" input
  
  const [duration, setDuration] = useState(45);
  
  const [exercises, setExercises] = useState([]);
  const [currEx, setCurrEx] = useState({ name: '', sets: '', reps: '', weight: '' });

  const addExercise = () => {
    if (!currEx.name) return;
    setExercises([...exercises, currEx]);
    setCurrEx({ name: '', sets: '', reps: '', weight: '' });
  };

  const removeExercise = (idx) => {
    setExercises(exercises.filter((_, i) => i !== idx));
  };

  const handleSubmit = () => {
    // Determine final type string
    const finalType = workoutType === 'Other' ? customType : workoutType;

    onAdd({
      date,
      type: finalType || 'Unknown Workout',
      duration,
      exercises,
      completed: true
    });
    setExercises([]);
    setCustomType('');
    setWorkoutType('Chest');
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm transition-colors">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Dumbbell className="text-blue-500" /> Log Workout
          </h2>
          
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div>
               <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Date</label>
               <input type="date" value={date} onChange={e => setDate(e.target.value)} 
                 className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg p-2.5 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"/>
            </div>
            
            <div>
               <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Main Focus</label>
               <div className="flex gap-2">
                 <select 
                   value={workoutType} 
                   onChange={e => setWorkoutType(e.target.value)}
                   className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg p-2.5 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                 >
                   {WORKOUT_TYPES.map(type => (
                     <option key={type} value={type}>{type}</option>
                   ))}
                 </select>
               </div>
               {/* Show extra input if "Other" is selected */}
               {workoutType === 'Other' && (
                 <input 
                   type="text" 
                   placeholder="Specify workout (e.g. Hiking)"
                   value={customType}
                   onChange={e => setCustomType(e.target.value)}
                   className="mt-2 w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg p-2.5 text-gray-900 dark:text-white"
                 />
               )}
            </div>

             <div>
               <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Duration (Mins)</label>
               <input type="number" value={duration} onChange={e => setDuration(e.target.value)} 
                 className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg p-2.5 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"/>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
             <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Add Exercises</h3>
             
             {/* Exercise Input Row */}
             <div className="grid grid-cols-12 gap-2 mb-4">
                <div className="col-span-4">
                    <input placeholder="Exercise Name" className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded p-2 text-sm text-gray-900 dark:text-white"
                   value={currEx.name} onChange={e => setCurrEx({...currEx, name: e.target.value})} />
                </div>
                <div className="col-span-2">
                    <input placeholder="Sets" type="number" className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded p-2 text-sm text-gray-900 dark:text-white"
                   value={currEx.sets} onChange={e => setCurrEx({...currEx, sets: e.target.value})} />
                </div>
                <div className="col-span-2">
                    <input placeholder="Reps" className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded p-2 text-sm text-gray-900 dark:text-white"
                   value={currEx.reps} onChange={e => setCurrEx({...currEx, reps: e.target.value})} />
                </div>
                <div className="col-span-2">
                    <input placeholder="Kg" type="number" className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded p-2 text-sm text-gray-900 dark:text-white"
                   value={currEx.weight} onChange={e => setCurrEx({...currEx, weight: e.target.value})} />
                </div>
                <button onClick={addExercise} className="col-span-2 bg-blue-600 text-white rounded hover:bg-blue-500 flex items-center justify-center transition-colors">
                   <Plus size={20}/>
                </button>
             </div>

             {/* List of added exercises */}
             <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
               {exercises.map((ex, idx) => (
                 <div key={idx} className="flex items-center justify-between bg-gray-100 dark:bg-gray-700/40 p-3 rounded-lg border border-gray-200 dark:border-gray-700/50">
                    <div>
                      <span className="font-bold text-gray-900 dark:text-white">{ex.name}</span>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        <span className="bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded mr-2">{ex.sets} Sets</span> 
                        <span className="bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded mr-2">{ex.reps} Reps</span>
                        {ex.weight && <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded">{ex.weight} kg</span>}
                      </div>
                    </div>
                    <button onClick={() => removeExercise(idx)} className="text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 p-2 rounded transition-colors"><Trash2 size={16}/></button>
                 </div>
               ))}
               {exercises.length === 0 && <div className="text-center text-gray-400 text-sm py-4 italic">No exercises added yet...</div>}
             </div>
          </div>

          <button onClick={handleSubmit} disabled={exercises.length === 0}
            className="w-full mt-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 dark:disabled:bg-gray-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-500/20 disabled:shadow-none">
             Finish & Save Workout
          </button>
        </div>
      </div>

      {/* History Side */}
      <div className="space-y-4">
         <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2"><Activity size={18}/> Recent History</h3>
         {data.slice(0, 5).map(w => (
            <div key={w.id} className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:border-blue-500/50 transition-colors">
               <div className="flex justify-between items-start mb-3">
                 <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">{w.type}</h4>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{w.date}</span>
                 </div>
                 <div className="flex items-center gap-1 text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded font-medium">
                    <Clock size={12}/> {w.duration}m
                 </div>
               </div>
               <div className="space-y-1.5">
                 {w.exercises.slice(0, 3).map((ex, i) => (
                   <div key={i} className="text-sm text-gray-700 dark:text-gray-300 flex justify-between border-b border-gray-100 dark:border-gray-700/50 last:border-0 pb-1 last:pb-0">
                     <span>{ex.name}</span>
                     <span className="text-gray-400 text-xs font-mono">{ex.sets}x{ex.reps}</span>
                   </div>
                 ))}
                 {w.exercises.length > 3 && <div className="text-xs text-blue-500 mt-1 font-medium">+{w.exercises.length - 3} more exercises</div>}
               </div>
            </div>
         ))}
      </div>
    </div>
  );
}