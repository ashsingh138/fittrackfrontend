import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Measurements from './pages/Measurements';
import Workouts from './pages/Workouts';
import Diet from './pages/Diet';
import Photos from './pages/Photos';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { useFitData } from './hooks/useFitData';

// Wrapper to protect routes
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  return <Layout>{children}</Layout>;
};

// Wrapper for data hook access (Inner App)
const FitTrackApp = () => {
  const { data, addMeasurement, addWorkout, addDiet, addPhoto, deletePhoto, updateSettings, deleteDietLog,    // <--- NEW
    deleteWorkoutLog,  } = useFitData();

  return (
    <Routes>
      {/* Public Routes (No Sidebar) */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected Routes (Has Sidebar) */}
      <Route path="/" element={<ProtectedRoute><Dashboard data={data} /></ProtectedRoute>} />
      <Route path="/measurements" element={<ProtectedRoute><Measurements data={data.measurements} onAdd={addMeasurement} /></ProtectedRoute>} />
      <Route path="/workouts" element={<ProtectedRoute><Workouts data={data.workouts} onAdd={addWorkout} onDeleteLog={deleteWorkoutLog} /></ProtectedRoute>} />
      <Route path="/diet" element={<ProtectedRoute><Diet data={data.diet} onAdd={addDiet} onDeleteLog={deleteDietLog} /></ProtectedRoute>} />
      <Route path="/photos" element={<ProtectedRoute><Photos data={data.photos} onAdd={addPhoto} onDelete={deletePhoto} /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings settings={data.settings} onUpdate={updateSettings} fullData={data} /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter>
          <FitTrackApp />
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;