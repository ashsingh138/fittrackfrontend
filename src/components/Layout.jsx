// src/components/Layout.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LogOut, UserCircle, LayoutDashboard, Ruler, Dumbbell, Utensils, Sun, Moon, Settings, Camera } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const NavItem = ({ to, icon: Icon, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link 
      to={to} 
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
        isActive 
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800'
      }`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </Link>
  );
};

export default function Layout({ children }) {
  const { isDark, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 p-6 hidden md:flex flex-col fixed h-full transition-colors duration-200">
        {/* Logo Area */}
        <div className="mb-10 flex items-center gap-2">
          <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white">FT</div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">FitTrack Pro</h1>
        </div>
        
        {/* Main Navigation */}
        <nav className="space-y-2 flex-1">
          <NavItem to="/" icon={LayoutDashboard} label="Dashboard" />
          <NavItem to="/measurements" icon={Ruler} label="Measurements" />
          <NavItem to="/workouts" icon={Dumbbell} label="Workouts" />
          <NavItem to="/diet" icon={Utensils} label="Diet Log" />
          <NavItem to="/photos" icon={Camera} label="Progress Photos" />
          <NavItem to="/profile" icon={UserCircle} label="My Profile" />
        </nav>

        {/* Bottom Actions Area */}
        <div className="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-800">
          {/* Settings & Theme */}
          <NavItem to="/settings" icon={Settings} label="Goals & Settings" />
          
          <button 
            onClick={toggleTheme}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800 transition-all"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
            <span className="font-medium">{isDark ? 'Light Mode' : 'Dark Mode'}</span>
          </button>

          {/* User Profile & Logout Section */}
          <div className="border-t border-gray-200 dark:border-gray-800 pt-4 mt-4">
            <div className="flex items-center gap-3 px-2 mb-4">
              <div className="h-10 w-10 min-w-[2.5rem] rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user?.name || 'User'}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email || 'No email'}</p>
              </div>
            </div>
            
            <button 
              onClick={logout} 
              className="flex items-center gap-3 px-4 py-2 w-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-sm font-medium"
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Nav (Bottom Bar) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 p-4 flex justify-around z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
         <Link to="/" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500 transition-colors"><LayoutDashboard size={24} /></Link>
         <Link to="/measurements" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500 transition-colors"><Ruler size={24} /></Link>
         <Link to="/workouts" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500 transition-colors"><Dumbbell size={24} /></Link>
         <Link to="/diet" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500 transition-colors"><Utensils size={24} /></Link>
         <Link to="/photos" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500 transition-colors"><Camera size={24} /></Link>
         <Link to="/profile" className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-500 transition-colors"><UserCircle size={24} /></Link>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 md:ml-64 mb-20 md:mb-0 transition-colors duration-200 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}