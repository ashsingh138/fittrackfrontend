import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const API_BASE = import.meta.env.VITE_API_URL;

const initialData = {
  settings: {
    targetDate: '2025-02-15',
    targetWeight: 75,
    targetWaist: 32,
    startWeight: 0,
    height: 175,
  },
  workoutSchedule: {}, // Will load from user profile
  measurements: [],
  workouts: [],
  diet: [],
  photos: [] // Note: Photos still local for now unless we add image upload backend
};

export function useFitData() {
  const { user, updateUser } = useAuth(); // Access auth token
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(true);

  // 1. Fetch Data on Mount (or when User changes)
  useEffect(() => {
    if (!user || !user.token) return;

    const fetchData = async () => {
      try {
        const headers = { 'Authorization': `Bearer ${user.token}` };

        // Fetch all data in parallel
        const [workoutsRes, dietRes, measureRes] = await Promise.all([
          fetch(`${API_BASE}/workouts`, { headers }),
          fetch(`${API_BASE}/diet`, { headers }),
          fetch(`${API_BASE}/measurements`, { headers })
        ]);

        const workouts = await workoutsRes.json();
        const diet = await dietRes.json();
        const measurements = await measureRes.json();

        setData(prev => ({
          ...prev,
          workouts: Array.isArray(workouts) ? workouts : [],
          diet: Array.isArray(diet) ? diet : [],
          measurements: Array.isArray(measurements) ? measurements : [],
          // Settings & Schedule come from the User object in AuthContext
          settings: user.settings || prev.settings,
          workoutSchedule: user.workoutSchedule || prev.workoutSchedule
        }));
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // 2. Helper to POST data securely
  const postData = async (endpoint, payload) => {
    if (!user) return null;
    try {
      const res = await fetch(`${API_BASE}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('API Error');
      return await res.json();
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  // --- ACTIONS ---

  const addMeasurement = async (entry) => {
    const saved = await postData('measurements', entry);
    if (saved) {
      setData(prev => ({
        ...prev,
        measurements: [saved, ...prev.measurements]
      }));
    }
  };

  const addWorkout = async (entry) => {
    const saved = await postData('workouts', entry);
    if (saved) {
      setData(prev => {
        // Check if we already have a log for this date
        const existingIndex = prev.workouts.findIndex(w => w.date === saved.date);
        
        let newList;
        if (existingIndex >= 0) {
          // UPDATE: Replace old entry
          newList = [...prev.workouts];
          newList[existingIndex] = saved;
        } else {
          // CREATE: Add to top
          newList = [saved, ...prev.workouts];
        }
        return { ...prev, workouts: newList };
      });
    }
  };

  const addDiet = async (entry) => {
    const saved = await postData('diet', entry);
    if (saved) {
      setData(prev => {
        // Check if we already have a log for this date
        const existingIndex = prev.diet.findIndex(d => d.date === saved.date);
        
        let newDietList;
        if (existingIndex >= 0) {
          // UPDATE: Replace the old entry with the new one
          newDietList = [...prev.diet];
          newDietList[existingIndex] = saved;
        } else {
          // CREATE: Add to the top
          newDietList = [saved, ...prev.diet];
        }
        
        return { ...prev, diet: newDietList };
      });
    }
  };
  // Update Settings (Target Date, Weights, etc.)
  const updateSettings = async (newSettings) => {
    const updatedSettings = { ...data.settings, ...newSettings };
    
    // Update Local State
    setData(prev => ({ ...prev, settings: updatedSettings }));
    
    // Send to Backend (User Profile)
    await updateUser({ settings: updatedSettings });
  };

  // Update Workout Schedule
  const updateSchedule = async (day, newPlan) => {
    const updatedSchedule = { 
      ...data.workoutSchedule, 
      [day]: newPlan 
    };

    // Update Local State
    setData(prev => ({ ...prev, workoutSchedule: updatedSchedule }));

    // Send to Backend
    await updateUser({ workoutSchedule: updatedSchedule });
  };

  // Photos (Keeping LocalStorage for simplicity as images are heavy for Mongo)
  const addPhoto = (entry) => {
    const newPhotos = [...data.photos, { ...entry, id: Date.now() }];
    setData(prev => ({ ...prev, photos: newPhotos }));
    localStorage.setItem('fittrack_photos', JSON.stringify(newPhotos));
  };

  const deletePhoto = (id) => {
    const newPhotos = data.photos.filter(p => p.id !== id);
    setData(prev => ({ ...prev, photos: newPhotos }));
    localStorage.setItem('fittrack_photos', JSON.stringify(newPhotos));
  };

  // Load photos from local storage on init
  useEffect(() => {
    const savedPhotos = localStorage.getItem('fittrack_photos');
    if (savedPhotos) {
      setData(prev => ({ ...prev, photos: JSON.parse(savedPhotos) }));
    }
  }, []);

  return { 
    data, 
    loading,
    updateSettings, 
    updateSchedule, 
    addMeasurement, 
    addWorkout, 
    addDiet, 
    addPhoto, 
    deletePhoto 
  };
}