import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Save, Edit2, User, MapPin, Ruler } from 'lucide-react';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(user || {});

  const handleSave = () => {
    updateUser(formData);
    setIsEditing(false);
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Header Cover */}
        <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600"></div>
        
        <div className="px-8 pb-8">
          {/* Avatar & Header */}
          <div className="relative -mt-12 mb-6 flex justify-between items-end">
             <div className="flex items-end gap-4">
                <div className="h-24 w-24 bg-gray-900 dark:bg-gray-700 border-4 border-white dark:border-gray-800 rounded-full flex items-center justify-center text-3xl font-bold text-white">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="mb-2">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h1>
                  <p className="text-gray-500 dark:text-gray-400 text-sm flex items-center gap-1">
                    <MapPin size={14} /> {user.location || 'Unknown Location'}
                  </p>
                </div>
             </div>
             
             <button 
               onClick={() => isEditing ? handleSave() : setIsEditing(true)}
               className={`px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors ${
                 isEditing ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
               }`}
             >
               {isEditing ? <><Save size={18}/> Save</> : <><Edit2 size={18}/> Edit Profile</>}
             </button>
          </div>

          {/* Details Grid */}
          <div className="space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Full Name</label>
                  {isEditing ? (
                    <input className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded p-2 dark:text-white"
                      value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                  ) : (
                    <div className="text-lg text-gray-900 dark:text-white font-medium">{user.name}</div>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email</label>
                  <div className="text-lg text-gray-900 dark:text-white font-medium opacity-70">{user.email} <span className="text-xs text-gray-400">(Cannot change)</span></div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Location</label>
                  {isEditing ? (
                    <input className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded p-2 dark:text-white"
                      value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
                  ) : (
                    <div className="text-lg text-gray-900 dark:text-white font-medium">{user.location}</div>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Gender</label>
                  {isEditing ? (
                     <select className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded p-2 dark:text-white"
                      value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}>
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                     </select>
                  ) : (
                    <div className="text-lg text-gray-900 dark:text-white font-medium">{user.gender}</div>
                  )}
                </div>
             </div>
             
             <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2"><Ruler size={20}/> Body Stats</h3>
                <div className="grid grid-cols-3 gap-6">
                   <div>
                     <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Age</label>
                     {isEditing ? (
                        <input type="number" className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded p-2 dark:text-white"
                          value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} />
                      ) : (
                        <div className="text-xl font-bold text-gray-900 dark:text-white">{user.age}</div>
                      )}
                   </div>
                   <div>
                     <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Height (cm)</label>
                     {isEditing ? (
                        <input type="number" className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded p-2 dark:text-white"
                          value={formData.height} onChange={e => setFormData({...formData, height: e.target.value})} />
                      ) : (
                        <div className="text-xl font-bold text-gray-900 dark:text-white">{user.height}</div>
                      )}
                   </div>
                   <div>
                     <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Weight (kg)</label>
                     {isEditing ? (
                        <input type="number" className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded p-2 dark:text-white"
                          value={formData.weight} onChange={e => setFormData({...formData, weight: e.target.value})} />
                      ) : (
                        <div className="text-xl font-bold text-gray-900 dark:text-white">{user.weight}</div>
                      )}
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}