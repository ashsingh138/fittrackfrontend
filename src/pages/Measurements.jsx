// src/pages/Measurements.jsx
import React, { useState } from 'react';

export default function Measurements({ data, onAdd }) {
  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    weight: '',
    waistUpper: '',
    waistLower: '',
    chest: '',
    hip: '',
    notes: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(form);
    setForm({ ...form, weight: '', waistUpper: '', waistLower: '', chest: '', hip: '', notes: '' });
  };

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {/* Input Form */}
      <div className="md:col-span-1">
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
          <h2 className="text-xl font-bold text-white mb-4">Log Body Stats</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Date</label>
              <input type="date" required className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2 text-white" 
                value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Weight (kg)</label>
                <input type="number" step="0.1" required className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2 text-white" 
                  value={form.weight} onChange={e => setForm({...form, weight: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Chest (cm)</label>
                <input type="number" step="0.1" className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2 text-white" 
                  value={form.chest} onChange={e => setForm({...form, chest: e.target.value})} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Waist Upper</label>
                <input type="number" step="0.1" className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2 text-white" 
                  value={form.waistUpper} onChange={e => setForm({...form, waistUpper: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Waist Lower</label>
                <input type="number" step="0.1" required className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2 text-white" 
                  value={form.waistLower} onChange={e => setForm({...form, waistLower: e.target.value})} />
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Notes</label>
              <textarea className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2 text-white h-20" 
                value={form.notes} onChange={e => setForm({...form, notes: e.target.value})}></textarea>
            </div>
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded-lg transition-colors">
              Save Entry
            </button>
          </form>
        </div>
      </div>

      {/* History Table */}
      <div className="md:col-span-2">
        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
          <div className="p-4 border-b border-gray-700">
            <h3 className="font-bold text-white">Recent Logs</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-400">
              <thead className="bg-gray-900 text-gray-300 uppercase font-medium">
                <tr>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Weight</th>
                  <th className="px-6 py-3">Waist (L)</th>
                  <th className="px-6 py-3">Notes</th>
                </tr>
              </thead>
              <tbody>
                {data.length === 0 ? (
                  <tr><td colSpan="4" className="px-6 py-4 text-center">No logs yet.</td></tr>
                ) : (
                  data.map((entry) => (
                    <tr key={entry.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                      <td className="px-6 py-4">{entry.date}</td>
                      <td className="px-6 py-4 font-bold text-white">{entry.weight}</td>
                      <td className="px-6 py-4">{entry.waistLower}</td>
                      <td className="px-6 py-4 italic truncate max-w-xs">{entry.notes}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}