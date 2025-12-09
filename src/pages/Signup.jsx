import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, AlertCircle } from 'lucide-react';

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  
  // RESTORED: All data fields
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
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    const result = await signup(formData);
    
    if (result.success) {
      navigate('/'); // Redirect to Dashboard
    } else {
      setError(result.message);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4 py-10">
      <div className="max-w-xl w-full bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create Account</h2>
          <p className="text-gray-500 dark:text-gray-400">Start your fitness journey today</p>
        </div>

        {/* Professional Error Box */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 px-4 py-3 rounded-xl mb-6 flex items-start gap-3 text-sm">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 1. Name & Location */}
          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Full Name</label>
                <input type="text" required 
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg p-2.5 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.name} onChange={e => { setFormData({...formData, name: e.target.value}); setError('') }} />
             </div>
             <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Location</label>
                <input type="text" placeholder="City" 
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg p-2.5 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.location} onChange={e => { setFormData({...formData, location: e.target.value}); setError('') }} />
             </div>
          </div>

          {/* 2. Age & Gender */}
          <div className="grid grid-cols-3 gap-4">
             <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Age</label>
                <input type="number" required 
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg p-2.5 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.age} onChange={e => { setFormData({...formData, age: e.target.value}); setError('') }} />
             </div>
             <div className="col-span-2">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Gender</label>
                <select 
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg p-2.5 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.gender} onChange={e => { setFormData({...formData, gender: e.target.value}); setError('') }}>
                   <option>Male</option>
                   <option>Female</option>
                   <option>Other</option>
                </select>
             </div>
          </div>

          {/* 3. Height & Weight */}
          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Height (cm)</label>
                <input type="number" required 
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg p-2.5 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.height} onChange={e => { setFormData({...formData, height: e.target.value}); setError('') }} />
             </div>
             <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Weight (kg)</label>
                <input type="number" required 
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg p-2.5 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.weight} onChange={e => { setFormData({...formData, weight: e.target.value}); setError('') }} />
             </div>
          </div>

          {/* 4. Credentials */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email</label>
                <input type="email" required 
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg p-2.5 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.email} onChange={e => { setFormData({...formData, email: e.target.value}); setError('') }} />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Password</label>
                <input type="password" required 
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg p-2.5 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.password} onChange={e => { setFormData({...formData, password: e.target.value}); setError('') }} />
              </div>
            </div>
          </div>

          <button type="submit" disabled={isLoading} className="w-full mt-6 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2">
            {isLoading ? 'Creating Account...' : <><UserPlus size={20} /> Create Account</>}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account? <Link to="/login" className="text-blue-600 font-bold hover:underline">Log In</Link>
        </p>
      </div>
    </div>
  );
}