import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Clock, Dumbbell, Calendar, X, Save, Activity } from 'lucide-react';

const WORKOUT_TYPES = [
  "Chest", "Back", "Shoulders", "Biceps", "Triceps", 
  "Legs (Quads/Hams)", "Abs / Core", "Cardio", "Full Body", "Rest Day", "Other"
];

export default function Workouts({ data, onAdd }) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Form State
  const [workoutType, setWorkoutType] = useState('Chest');
  const [customType, setCustomType] = useState('');
  const [duration, setDuration] = useState(45);
  const [exercises, setExercises] = useState([]);

  // Input State for new exercise
  const [currEx, setCurrEx] = useState({ name: '', sets: '', reps: '', weight: '' });

  // History Modal State
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);

  // Load existing data if date changes
  useEffect(() => {
    const existingLog = data.find(w => w.date === date);
    if (existingLog) {
      setWorkoutType(WORKOUT_TYPES.includes(existingLog.type) ? existingLog.type : 'Other');
      if (!WORKOUT_TYPES.includes(existingLog.type)) setCustomType(existingLog.type);
      setDuration(existingLog.duration || 45);
      setExercises(existingLog.exercises || []);
    } else {
      // Reset defaults
      setWorkoutType('Chest');
      setCustomType('');
      setDuration(45);
      setExercises([]);
    }
  }, [date, data]);

  const addExercise = () => {
    if (!currEx.name) return;
    setExercises([...exercises, currEx]);
    setCurrEx({ name: '', sets: '', reps: '', weight: '' });
  };

  const removeExercise = (idx) => {
    setExercises(exercises.filter((_, i) => i !== idx));
  };

  const handleSave = () => {
    const finalType = workoutType === 'Other' ? customType : workoutType;
    onAdd({
      date,
      type: finalType || 'Unknown Workout',
      duration,
      exercises,
      completed: true
    });
    alert("Workout Saved!");
  };

  return (
    <div className="relative">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg text-blue-600 dark:text-blue-400">
             <Dumbbell size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Daily Workout Log</h2>
            <p className="text-xs text-gray-500">Track your lifts & progress</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <input type="date" value={date} onChange={e => setDate(e.target.value)} 
            className="flex-1 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"/>
          
          <button 
            onClick={() => setIsHistoryOpen(true)}
            className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-white px-4 py-2 rounded-lg transition-colors font-medium text-sm"
          >
            <Calendar size={18}/> History
          </button>
        </div>
      </div>

      {/* MAIN INPUT SECTION */}
      <div className="grid lg:grid-cols-3 gap-6 mb-20">
        
        {/* Left Col: Setup & Exercises */}
        <div className="lg:col-span-2 space-y-6">
           {/* 1. Details Card */}
           <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                   <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Focus Area</label>
                   <select 
                     value={workoutType} 
                     onChange={e => setWorkoutType(e.target.value)}
                     className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg p-2.5 text-gray-900 dark:text-white outline-none focus:border-blue-500"
                   >
                     {WORKOUT_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                   </select>
                   {workoutType === 'Other' && (
                     <input 
                       type="text" placeholder="Specify..."
                       className="mt-2 w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg p-2 text-sm text-gray-900 dark:text-white"
                       value={customType} onChange={e => setCustomType(e.target.value)}
                     />
                   )}
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Duration (min)</label>
                   <input 
                     type="number" value={duration} onChange={e => setDuration(e.target.value)}
                     className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg p-2.5 text-gray-900 dark:text-white outline-none focus:border-blue-500"
                   />
                </div>
              </div>
           </div>

           {/* 2. Exercise Manager */}
           <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><Activity size={18}/> Exercises</h3>
              
              {/* Exercise List */}
              <div className="space-y-2 mb-6">
                {exercises.length === 0 && <p className="text-gray-400 text-sm italic text-center py-4">No exercises added yet.</p>}
                {exercises.map((ex, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-gray-50 dark:bg-gray-700/30 p-3 rounded-lg border border-gray-100 dark:border-gray-700/50 group">
                    <div>
                      <span className="font-bold text-gray-800 dark:text-white block">{ex.name}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {ex.sets} sets × {ex.reps} reps {ex.weight ? `@ ${ex.weight}kg` : ''}
                      </span>
                    </div>
                    <button onClick={() => removeExercise(idx)} className="text-gray-400 hover:text-red-500 p-2 rounded transition-colors">
                      <Trash2 size={18}/>
                    </button>
                  </div>
                ))}
              </div>

              {/* Input Row */}
              <div className="grid grid-cols-12 gap-2">
                 <div className="col-span-4 md:col-span-5">
                    <input placeholder="Name (e.g. Bench)" className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg p-2 text-sm text-gray-900 dark:text-white outline-none focus:border-blue-500"
                      value={currEx.name} onChange={e => setCurrEx({...currEx, name: e.target.value})} />
                 </div>
                 <div className="col-span-2">
                    <input placeholder="Sets" type="number" className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg p-2 text-sm text-gray-900 dark:text-white outline-none focus:border-blue-500"
                      value={currEx.sets} onChange={e => setCurrEx({...currEx, sets: e.target.value})} />
                 </div>
                 <div className="col-span-2">
                    <input placeholder="Reps" className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg p-2 text-sm text-gray-900 dark:text-white outline-none focus:border-blue-500"
                      value={currEx.reps} onChange={e => setCurrEx({...currEx, reps: e.target.value})} />
                 </div>
                 <div className="col-span-2">
                    <input placeholder="Kg" type="number" className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg p-2 text-sm text-gray-900 dark:text-white outline-none focus:border-blue-500"
                      value={currEx.weight} onChange={e => setCurrEx({...currEx, weight: e.target.value})} />
                 </div>
                 <button onClick={addExercise} className="col-span-2 md:col-span-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center transition-colors">
                    <Plus size={20}/>
                 </button>
              </div>
           </div>
        </div>

        {/* Right Col: Save & Stats */}
        <div className="space-y-4">
           <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl border border-blue-100 dark:border-blue-800 text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">{exercises.length}</div>
              <div className="text-sm text-blue-800 dark:text-blue-300">Exercises Completed</div>
           </div>
           
           <button 
             onClick={handleSave} 
             disabled={exercises.length === 0}
             className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-4 rounded-xl shadow-lg shadow-green-600/20 transition-all flex items-center justify-center gap-2"
           >
              <Save size={20} /> Save Workout
           </button>
        </div>
      </div>

      {/* --- HISTORY MODAL --- */}
      {isHistoryOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 w-full max-w-lg max-h-[80vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 dark:border-gray-700">
            
            <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                <Calendar size={20} className="text-blue-500"/> Past Workouts
              </h3>
              <button onClick={() => setIsHistoryOpen(false)} className="text-gray-500 hover:text-red-500 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {data.length === 0 ? (
                <div className="text-center text-gray-500 py-10">No logs found.</div>
              ) : (
                [...data].sort((a,b) => new Date(b.date) - new Date(a.date)).map(log => (
                  <div key={log.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:border-blue-500 cursor-pointer transition-all bg-white dark:bg-gray-800 shadow-sm"
                       onClick={() => setSelectedLog(selectedLog === log.id ? null : log.id)}>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-bold text-gray-800 dark:text-gray-200">{log.date}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{log.type}</div>
                      </div>
                      <div className="flex gap-2 text-xs">
                        <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-md font-medium">{log.duration} mins</span>
                      </div>
                    </div>

                    {/* Expand Details */}
                    {selectedLog === log.id && (
                      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 text-sm space-y-2 animation-fade-in">
                        {log.exercises.map((ex, i) => (
                          <div key={i} className="flex justify-between text-gray-700 dark:text-gray-300">
                            <span>{ex.name}</span>
                            <span className="text-gray-500">{ex.sets}x{ex.reps}</span>
                          </div>
                        ))}
                        <button 
                          className="w-full mt-3 text-blue-600 hover:text-blue-800 text-xs font-bold py-2 bg-blue-50 dark:bg-blue-900/20 rounded"
                          onClick={(e) => {
                             e.stopPropagation();
                             setDate(log.date); // Load into editor
                             setIsHistoryOpen(false); // Close modal
                          }}
                        >
                          Edit This Workout
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}