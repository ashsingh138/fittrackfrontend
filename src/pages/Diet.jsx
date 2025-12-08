import React, { useState } from 'react';
import { Plus, Trash2, Droplets, Utensils } from 'lucide-react';

// Pre-defined units for the dropdown
const UNITS = ["gm", "ml", "pcs", "bowl", "cup", "slice", "scoop", "tbsp", "serving"];

const MealSection = ({ title, items, onAdd, onRemove }) => {
  const [name, setName] = useState('');
  const [qty, setQty] = useState('');
  const [unit, setUnit] = useState('gm'); // default unit

  const handleAdd = () => {
    if(!name || !qty) return;
    onAdd({ name, qty, unit });
    setName('');
    setQty('');
    setUnit('gm'); // reset to default
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
      <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">{title}</h3>
      
      {/* Existing Items List */}
      <div className="space-y-2 mb-4">
        {items.map((item, idx) => (
          <div key={idx} className="flex justify-between items-center text-sm bg-gray-50 dark:bg-gray-700/40 p-2.5 rounded-lg border border-gray-100 dark:border-gray-700/50">
            <span className="text-gray-800 dark:text-gray-200 font-medium">{item.name}</span>
            <div className="flex items-center gap-3">
              <span className="text-xs bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 px-2 py-0.5 rounded-md">
                {item.qty} {item.unit}
              </span>
              <button onClick={() => onRemove(idx)} className="text-red-400 hover:text-red-600 transition-colors"><Trash2 size={15}/></button>
            </div>
          </div>
        ))}
        {items.length === 0 && <div className="text-xs text-gray-400 italic py-1">Nothing added yet</div>}
      </div>

      {/* Input Row */}
      <div className="flex flex-col sm:flex-row gap-2">
        <input 
          placeholder="Item (e.g. Dal)" 
          className="flex-1 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white outline-none focus:border-blue-500"
          value={name} onChange={e => setName(e.target.value)}
        />
        <div className="flex gap-2">
          <input 
            placeholder="Qty" 
            type="number"
            className="w-16 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white outline-none focus:border-blue-500"
            value={qty} onChange={e => setQty(e.target.value)}
          />
          <select 
            className="w-20 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg px-1 py-2 text-sm text-gray-900 dark:text-white outline-none focus:border-blue-500"
            value={unit} onChange={e => setUnit(e.target.value)}
          >
            {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
          </select>
          <button onClick={handleAdd} type="button" className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
            <Plus size={18}/>
          </button>
        </div>
      </div>
    </div>
  );
};

export default function Diet({ data, onAdd }) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [meals, setMeals] = useState({
    breakfast: [],
    lunch: [],
    snacks: [],
    dinner: [],
    junk: []
  });
  const [eggs, setEggs] = useState(0);
  const [water, setWater] = useState(0);

  const addItem = (section, item) => {
    setMeals(prev => ({ ...prev, [section]: [...prev[section], item] }));
  };

  const removeItem = (section, index) => {
    setMeals(prev => ({ ...prev, [section]: prev[section].filter((_, i) => i !== index) }));
  };

  const handleSubmit = () => {
    // Basic junk score logic
    const junkCount = meals.junk.length;
    let score = 10;
    score -= (junkCount * 2);
    if(water < 2) score -= 1;
    if(score < 0) score = 0;

    onAdd({ 
      date, 
      meals, 
      eggs, 
      water,
      score
    });
    // Reset
    setMeals({ breakfast: [], lunch: [], snacks: [], dinner: [], junk: [] });
    setEggs(0);
    setWater(0);
    alert("Diet Log Saved!");
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Utensils className="text-green-500"/> Daily Food Log
          </h2>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} 
            className="bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-green-500"/>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <MealSection title="🍳 Breakfast" items={meals.breakfast} onAdd={(i) => addItem('breakfast', i)} onRemove={(i) => removeItem('breakfast', i)} />
          <MealSection title="🥗 Lunch" items={meals.lunch} onAdd={(i) => addItem('lunch', i)} onRemove={(i) => removeItem('lunch', i)} />
          <MealSection title="🥜 Snacks" items={meals.snacks} onAdd={(i) => addItem('snacks', i)} onRemove={(i) => removeItem('snacks', i)} />
          <MealSection title="🍲 Dinner" items={meals.dinner} onAdd={(i) => addItem('dinner', i)} onRemove={(i) => removeItem('dinner', i)} />
        </div>

        {/* Junk & Water Section */}
        <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-xl border border-red-200 dark:border-red-900/30">
           <MealSection title="⚠️ Junk / Cheat Meals" items={meals.junk} onAdd={(i) => addItem('junk', i)} onRemove={(i) => removeItem('junk', i)} />
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col items-center">
                <label className="text-gray-500 dark:text-gray-400 mb-2 font-medium">Total Eggs</label>
                <div className="flex items-center gap-4">
                    <button onClick={() => setEggs(Math.max(0, eggs-1))} className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-xl font-bold transition-colors">-</button>
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">{eggs}</span>
                    <button onClick={() => setEggs(eggs+1)} className="w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-200 dark:hover:bg-yellow-900/50 text-xl font-bold transition-colors">+</button>
                </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col items-center">
                <label className="text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-2 font-medium"><Droplets size={16} className="text-blue-500"/> Water (Litres)</label>
                <input 
                  type="number" step="0.5" 
                  className="text-4xl font-bold text-center bg-transparent text-gray-900 dark:text-white w-28 border-b-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 outline-none pb-1"
                  value={water} onChange={e => setWater(e.target.value)}
                />
            </div>
        </div>

        <button onClick={handleSubmit} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-green-600/20 transition-all text-lg">
            Save Full Day Log
        </button>
      </div>

      {/* Recent History Sidebar */}
      <div className="space-y-4">
         <h3 className="font-bold text-gray-900 dark:text-white">Recent Logs</h3>
         {data.slice(0, 5).map(day => (
            <div key={day.id} className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:border-green-500/50 transition-colors">
                <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-700 pb-2 mb-2">
                    <span className="font-bold text-gray-900 dark:text-white">{day.date}</span>
                    <div className="flex gap-2 text-xs">
                        <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-1 rounded">{day.water}L 💧</span>
                        <span className="bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 px-2 py-1 rounded">{day.eggs} 🥚</span>
                    </div>
                </div>
                <div className="text-xs space-y-1.5 text-gray-600 dark:text-gray-400">
                    {day.meals.breakfast.length > 0 && <p className="truncate"><strong className="text-gray-900 dark:text-gray-300">B:</strong> {day.meals.breakfast.map(i => `${i.name}`).join(', ')}</p>}
                    {day.meals.lunch.length > 0 && <p className="truncate"><strong className="text-gray-900 dark:text-gray-300">L:</strong> {day.meals.lunch.map(i => `${i.name}`).join(', ')}</p>}
                    {day.meals.dinner.length > 0 && <p className="truncate"><strong className="text-gray-900 dark:text-gray-300">D:</strong> {day.meals.dinner.map(i => `${i.name}`).join(', ')}</p>}
                    {day.meals.junk.length > 0 && <p className="text-red-500 font-medium mt-1">⚠️ {day.meals.junk.map(i => `${i.name} (${i.qty})`).join(', ')}</p>}
                </div>
            </div>
         ))}
      </div>
    </div>
  );
}