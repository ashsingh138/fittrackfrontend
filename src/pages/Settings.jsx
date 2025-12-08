// src/pages/Settings.jsx
import React, { useState } from 'react';
import { Save, Download, Calendar, Edit3, X, Plus } from 'lucide-react';
import { exportToCSV } from '../utils/fitnessHelpers';

// Helper to order days correctly
const DAYS_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function Settings({ settings, onUpdate, fullData, onUpdateSchedule }) {
  const [form, setForm] = useState(settings);
  const [schedule, setSchedule] = useState(fullData.workoutSchedule);
  
  // State for the "Edit Day" modal/section
  const [editingDay, setEditingDay] = useState(null); // 'Monday', 'Tuesday', etc.
  const [editFocus, setEditFocus] = useState('');
  const [editExercises, setEditExercises] = useState(''); // Textarea string

  const handleSettingsSubmit = (e) => {
    e.preventDefault();
    onUpdate(form);
    alert("Goals Saved!");
  };

  const openDayEdit = (day) => {
    setEditingDay(day);
    setEditFocus(schedule[day]?.focus || '');
    setEditExercises(schedule[day]?.exercises?.join('\n') || '');
  };

  const saveDaySchedule = () => {
    // Convert textarea back to array, filtering empty lines
    const exercisesArray = editExercises.split('\n').filter(line => line.trim() !== '');
    
    const newPlan = {
      focus: editFocus,
      exercises: exercisesArray
    };

    // Update local state
    const newSchedule = { ...schedule, [editingDay]: newPlan };
    setSchedule(newSchedule);
    
    // Save to global storage
    onUpdateSchedule(editingDay, newPlan);
    setEditingDay(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      {/* 1. GENERAL SETTINGS */}
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Goals & Configuration</h2>
        <form onSubmit={handleSettingsSubmit} className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Target Date</label>
              <input type="date" required 
                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg p-3 text-gray-900 dark:text-white"
                value={form.targetDate} onChange={e => setForm({...form, targetDate: e.target.value})} />
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Target Weight (kg)</label>
              <input type="number" required 
                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg p-3 text-gray-900 dark:text-white"
                value={form.targetWeight} onChange={e => setForm({...form, targetWeight: e.target.value})} />
             </div>
             <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Target Waist (cm)</label>
              <input type="number" required 
                className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg p-3 text-gray-900 dark:text-white"
                value={form.targetWaist} onChange={e => setForm({...form, targetWaist: e.target.value})} />
             </div>
          </div>
          <button type="submit" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-xl transition-all">
            <Save size={18} /> Save Goals
          </button>
        </form>
      </div>

      {/* 2. WORKOUT SCHEDULE EDITOR */}
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Weekly Workout Target</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">Define your routine. This will appear on your Dashboard daily.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {DAYS_ORDER.map(day => (
            <div key={day} className="relative p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors group">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-gray-900 dark:text-white">{day}</h3>
                <button 
                  onClick={() => openDayEdit(day)}
                  className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  <Edit3 size={16} />
                </button>
              </div>
              <p className="text-blue-600 dark:text-blue-400 font-semibold text-sm mb-2">{schedule[day]?.focus || 'Rest Day'}</p>
              <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                {schedule[day]?.exercises?.slice(0, 3).map((ex, i) => (
                  <li key={i}>• {ex}</li>
                ))}
                {(schedule[day]?.exercises?.length || 0) > 3 && <li className="italic text-gray-400">+ more...</li>}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* 3. CSV EXPORT */}
      <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
        <button 
          onClick={() => exportToCSV(fullData)}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium transition-colors"
        >
          <Download size={20} /> Export Data as CSV
        </button>
      </div>

      {/* EDIT MODAL OVERLAY */}
      {editingDay && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-lg shadow-2xl border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Edit {editingDay}</h3>
              <button onClick={() => setEditingDay(null)} className="text-gray-500 hover:text-red-500"><X size={24}/></button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Focus Title</label>
                <input 
                  type="text" 
                  value={editFocus} 
                  onChange={e => setEditFocus(e.target.value)}
                  placeholder="e.g. Chest & Triceps"
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg p-3 text-gray-900 dark:text-white font-bold"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Target Exercises</label>
                <p className="text-xs text-gray-500 mb-2">Write each exercise on a new line.</p>
                <textarea 
                  value={editExercises}
                  onChange={e => setEditExercises(e.target.value)}
                  rows={6}
                  placeholder="Pushups 20x3&#10;Plank 1 min"
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg p-3 text-gray-900 dark:text-white font-mono text-sm leading-relaxed"
                />
              </div>
              <button 
                onClick={saveDaySchedule}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all"
              >
                Save Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}