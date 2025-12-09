import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, AlertCircle } from 'lucide-react';

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', age: '', gender: 'Male', location: '', height: '', weight: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => { 
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    const result = await signup(formData);
    
    if (result.success) {
      navigate('/'); 
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

        {/* ERROR WARNING BOX */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 px-4 py-3 rounded-xl mb-6 flex items-start gap-3 text-sm">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
           {/* ... (Keep your input fields exactly the same as before) ... */}
           {/* Just verify the Input fields use: onChange={e => { ...; setError(''); }} so typing clears the error */}
           
           {/* Example Input Update: */}
           <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Full Name</label>
                <input type="text" required className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg p-2.5 text-gray-900 dark:text-white"
                 value={formData.name} onChange={e => { setFormData({...formData, name: e.target.value}); setError('') }} />
             </div>
             {/* ... Repeat setError('') for other inputs ... */}
           </div>
           
           {/* ... Rest of form ... */}

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