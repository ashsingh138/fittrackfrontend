import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus } from 'lucide-react';

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    gender: 'Male',
    location: '',
    height: '', // cm
    weight: '', // kg
  });
const [error, setError] = useState('');
  const handleSubmit = async (e) => { // Make async
    e.preventDefault();
    setError('');
    
    // Call signup from AuthContext
    const result = await signup(formData);
    
    if (result.success) {
      navigate('/'); // Redirect to Dashboard on success
    } else {
      setError(result.message); // Show error from backend (e.g., "User already exists")
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4 py-10">
      <div className="max-w-xl w-full bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create Account</h2>
          <p className="text-gray-500 dark:text-gray-400">Start your fitness journey today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Personal Details */}
          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Full Name</label>
                <input type="text" required className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg p-2.5 text-gray-900 dark:text-white"
                 value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
             </div>
             <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Location</label>
                <input type="text" placeholder="City, Country" className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg p-2.5 text-gray-900 dark:text-white"
                 value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
             </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
             <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Age</label>
                <input type="number" required className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg p-2.5 text-gray-900 dark:text-white"
                 value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} />
             </div>
             <div className="col-span-2">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Gender</label>
                <select className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg p-2.5 text-gray-900 dark:text-white"
                 value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}>
                   <option>Male</option>
                   <option>Female</option>
                   <option>Other</option>
                </select>
             </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Height (cm)</label>
                <input type="number" required className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg p-2.5 text-gray-900 dark:text-white"
                 value={formData.height} onChange={e => setFormData({...formData, height: e.target.value})} />
             </div>
             <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Weight (kg)</label>
                <input type="number" required className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg p-2.5 text-gray-900 dark:text-white"
                 value={formData.weight} onChange={e => setFormData({...formData, weight: e.target.value})} />
             </div>
          </div>

          {/* Account Credentials */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email</label>
                <input type="email" required className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg p-2.5 text-gray-900 dark:text-white"
                 value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Password</label>
                <input type="password" required className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg p-2.5 text-gray-900 dark:text-white"
                 value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
              </div>
            </div>
          </div>

          <button type="submit" className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2">
            <UserPlus size={20} /> Create Account
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account? <Link to="/login" className="text-blue-600 font-bold hover:underline">Log In</Link>
        </p>
      </div>
    </div>
  );
}