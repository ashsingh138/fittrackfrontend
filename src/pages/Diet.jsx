import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Droplets, Utensils, Save, Calendar, X, Edit2 } from 'lucide-react';

// --- MEAL SECTION COMPONENT (No Changes Needed) ---
const MealSection = ({ title, items, onAdd, onDelete }) => {
  const [name, setName] = useState('');
  const [qty, setQty] = useState('');
  const [unit, setUnit] = useState('gm');

  const handleAdd = () => {
    if (!name) return;
    onAdd({ name, qty: qty || '1', unit });
    setName('');
    setQty('');
    setUnit('gm');
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col h-full">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">{title}</h3>
      </div>
      <div className="flex-1 space-y-2 mb-4 overflow-y-auto max-h-40">
        {items.length === 0 && <p className="text-xs text-gray-400 italic">Nothing added yet</p>}
        {items.map((item, idx) => (
          <div key={idx} className="flex justify-between items-center text-sm bg-gray-50 dark:bg-gray-700/40 p-2 rounded-lg border border-gray-100 dark:border-gray-700/50 group">
            <span className="text-gray-800 dark:text-gray-200 font-medium">{item.name}</span>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 px-1.5 py-0.5 rounded">
                {item.qty} {item.unit}
              </span>
              <button onClick={() => onDelete(idx)} className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                <Trash2 size={14}/>
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-auto">
        <div className="flex flex-wrap gap-2 items-end">
          <div className="flex-1 min-w-[120px]">
            <input placeholder="Item name..." className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-2 py-2 text-sm text-gray-900 dark:text-white outline-none focus:border-blue-500"
              value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className="w-16">
            <input placeholder="Qty" type="number" className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-2 py-2 text-sm text-gray-900 dark:text-white outline-none focus:border-blue-500"
              value={qty} onChange={e => setQty(e.target.value)} />
          </div>
          <div className="w-20">
             <select className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-1 py-2 text-sm text-gray-900 dark:text-white outline-none focus:border-blue-500"
               value={unit} onChange={e => setUnit(e.target.value)}>
               {['gm', 'ml', 'pcs', 'cup', 'bowl', 'slice'].map(u => <option key={u} value={u}>{u}</option>)}
             </select>
          </div>
          <button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors shadow-sm">
            <Plus size={18}/>
          </button>
        </div>
      </div>
    </div>
  );
};

// --- MAIN DIET COMPONENT ---
export default function Diet({ data, onAdd, onDeleteLog }) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [meals, setMeals] = useState({ breakfast: [], lunch: [], snacks: [], dinner: [], junk: [] });
  const [eggs, setEggs] = useState(0);
  const [water, setWater] = useState(0);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);

  // Sync state when Date changes OR when Data updates
  useEffect(() => {
    loadDataForDate(date);
  }, [date, data]);

  // Helper to load data into the form
  const loadDataForDate = (targetDate) => {
    const existingLog = data.find(d => d.date === targetDate);
    if (existingLog) {
      setMeals({
        breakfast: existingLog.meals?.breakfast || [],
        lunch: existingLog.meals?.lunch || [],
        snacks: existingLog.meals?.snacks || [],
        dinner: existingLog.meals?.dinner || [],
        junk: existingLog.meals?.junk || [],
      });
      setEggs(existingLog.eggs || 0);
      setWater(existingLog.water || 0);
    } else {
      setMeals({ breakfast: [], lunch: [], snacks: [], dinner: [], junk: [] });
      setEggs(0);
      setWater(0);
    }
  };

  const addItem = (section, item) => {
    setMeals(prev => ({ ...prev, [section]: [...prev[section], item] }));
  };

  const removeItem = (section, index) => {
    setMeals(prev => ({ ...prev, [section]: prev[section].filter((_, i) => i !== index) }));
  };

  const handleSave = () => {
    const junkCount = meals.junk.length;
    let score = 10;
    score -= (junkCount * 2);
    if(water < 2) score -= 1;
    if(score < 0) score = 0;

    onAdd({ date, meals, eggs, water, score });
    alert("Saved successfully!");
  };

  const handleDeleteFullLog = async (logDate) => {
    if (window.confirm("Are you sure you want to delete the entire log for " + logDate + "?")) {
      await onDeleteLog(logDate);
      if (logDate === date) {
         setMeals({ breakfast: [], lunch: [], snacks: [], dinner: [], junk: [] });
         setEggs(0);
         setWater(0);
      }
    }
  };

  // NEW: Force load data when clicking "Edit"
  const handleEditClick = (log) => {
    setDate(log.date);      // Update the date picker
    loadDataForDate(log.date); // Manually load data immediately
    setIsHistoryOpen(false); // Close modal
  };

  return (
    <div className="relative">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg text-green-600 dark:text-green-400">
             <Utensils size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Daily Food Log</h2>
            <p className="text-xs text-gray-500">Track your calories & habits</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <input type="date" value={date} onChange={e => setDate(e.target.value)} 
            className="flex-1 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-green-500"/>
          
          <button onClick={() => setIsHistoryOpen(true)} className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-white px-4 py-2 rounded-lg transition-colors font-medium text-sm">
            <Calendar size={18}/> History
          </button>
        </div>
      </div>

      {/* MEAL SECTIONS */}
      <div className="grid lg:grid-cols-2 gap-4 mb-6">
        <MealSection title="🍳 Breakfast" items={meals.breakfast} onAdd={(i) => addItem('breakfast', i)} onDelete={(i) => removeItem('breakfast', i)} />
        <MealSection title="🥗 Lunch" items={meals.lunch} onAdd={(i) => addItem('lunch', i)} onDelete={(i) => removeItem('lunch', i)} />
        <MealSection title="🥜 Snacks" items={meals.snacks} onAdd={(i) => addItem('snacks', i)} onDelete={(i) => removeItem('snacks', i)} />
        <MealSection title="🍲 Dinner" items={meals.dinner} onAdd={(i) => addItem('dinner', i)} onDelete={(i) => removeItem('dinner', i)} />
      </div>

      <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-xl border border-red-200 dark:border-red-900/30 mb-6">
         <MealSection title="⚠️ Junk / Cheat Meals" items={meals.junk} onAdd={(i) => addItem('junk', i)} onDelete={(i) => removeItem('junk', i)} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-20">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col items-center justify-center">
              <label className="text-gray-500 dark:text-gray-400 mb-2 font-medium">Total Eggs</label>
              <div className="flex items-center gap-4">
                  <button onClick={() => setEggs(Math.max(0, eggs-1))} className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 font-bold">-</button>
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">{eggs}</span>
                  <button onClick={() => setEggs(eggs+1)} className="w-10 h-10 rounded-full bg-yellow-100 text-yellow-700 hover:bg-yellow-200 font-bold">+</button>
              </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col items-center justify-center">
              <label className="text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-2 font-medium"><Droplets size={16} className="text-blue-500"/> Water (Litres)</label>
              <input type="number" step="0.5" className="text-4xl font-bold text-center bg-transparent text-gray-900 dark:text-white w-28 border-b-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 outline-none pb-1"
                value={water} onChange={e => setWater(e.target.value)} />
          </div>
          <button onClick={handleSave} className="bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-lg shadow-green-600/20 transition-all flex flex-col items-center justify-center gap-2 py-4">
             <Save size={28} /> <span>Save All Changes</span>
          </button>
      </div>

      {/* --- HISTORY MODAL --- */}
      {isHistoryOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 w-full max-w-lg max-h-[80vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                <Calendar size={20} className="text-blue-500"/> Past Logs
              </h3>
              <button onClick={() => setIsHistoryOpen(false)} className="text-gray-500 hover:text-red-500 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {data.length === 0 ? <div className="text-center text-gray-500 py-10">No logs found.</div> : (
                [...data].sort((a,b) => new Date(b.date) - new Date(a.date)).map(log => {
                  // FIX 1: Use _id from MongoDB, fallback to id
                  const logId = log._id || log.id; 
                  return (
                    <div key={logId} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:border-blue-500 cursor-pointer transition-all bg-white dark:bg-gray-800 shadow-sm"
                         onClick={() => setSelectedLog(selectedLog === logId ? null : logId)}>
                      <div className="flex justify-between items-center">
                        <div className="font-bold text-gray-800 dark:text-gray-200">{log.date}</div>
                        <div className="flex gap-2 text-xs">
                          <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-md font-medium">{log.water}L 💧</span>
                        </div>
                      </div>

                      {selectedLog === logId && (
                        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 text-sm space-y-3" onClick={e => e.stopPropagation()}>
                           <div className="grid grid-cols-1 gap-1 text-gray-600 dark:text-gray-400">
                             {log.meals?.breakfast?.length > 0 && <p>🍳 Breakfast: {log.meals.breakfast.map(i => i.name).join(', ')}</p>}
                             {log.meals?.lunch?.length > 0 && <p>🥗 Lunch: {log.meals.lunch.map(i => i.name).join(', ')}</p>}
                           </div>

                          <div className="grid grid-cols-2 gap-2 mt-4">
                            <button 
                              className="flex items-center justify-center gap-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 font-bold py-2 rounded border border-blue-200 dark:border-blue-800"
                              onClick={() => handleEditClick(log)}
                            >
                              <Edit2 size={14}/> Edit
                            </button>
                            <button 
                              className="flex items-center justify-center gap-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 font-bold py-2 rounded border border-red-200 dark:border-red-800"
                              onClick={() => handleDeleteFullLog(log.date)}
                            >
                              <Trash2 size={14}/> Delete Day
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}