import { differenceInDays, isSameDay, subDays, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';

// Hardcoded schedule - you could move this to settings later
const WORKOUT_SCHEDULE = [
  "Rest & Recovery 🧘",     // Sunday (0)
  "Chest & Triceps 🦁",     // Monday (1)
  "Back & Biceps 🦍",       // Tuesday (2)
  "Active Recovery / Abs 🏃", // Wednesday (3)
  "Legs & Shoulders 🦵",    // Thursday (4)
  "Full Body / Cardio 🔥",  // Friday (5)
  "Core & Abs 🍫"           // Saturday (6)
];

export const getAssignedWorkout = () => {
  const dayIndex = new Date().getDay();
  return WORKOUT_SCHEDULE[dayIndex];
};

export const calculateBMI = (weight, heightCm) => {
  if (!weight || !heightCm) return 0;
  const heightM = heightCm / 100;
  return (weight / (heightM * heightM)).toFixed(1);
};

export const calculateWaistHipRatio = (waist, hip) => {
  if (!waist || !hip) return 0;
  return (waist / hip).toFixed(2);
};

export const getWeeklyStats = (measurements, workouts, diet) => {
  const today = new Date();
  const start = subDays(today, 6); // Last 7 days

  const last7DaysMeasurements = measurements.filter(m => new Date(m.date) >= start);
  const last7DaysWorkouts = workouts.filter(w => new Date(w.date) >= start && w.completed);
  const last7DaysDiet = diet.filter(d => new Date(d.date) >= start);

  // Calculate change
  const newestM = measurements[0];
  const oldestMInWeek = last7DaysMeasurements[last7DaysMeasurements.length - 1];
  
  const waistChange = newestM && oldestMInWeek ? (newestM.waistLower - oldestMInWeek.waistLower).toFixed(1) : 0;
  const weightChange = newestM && oldestMInWeek ? (newestM.weight - oldestMInWeek.weight).toFixed(1) : 0;

  // Diet Avg
  const avgScore = last7DaysDiet.length 
    ? (last7DaysDiet.reduce((acc, curr) => acc + curr.score, 0) / last7DaysDiet.length).toFixed(1) 
    : 0;

  return {
    workoutCount: last7DaysWorkouts.length,
    dietAvg: avgScore,
    waistChange,
    weightChange,
    cleanDietDays: last7DaysDiet.filter(d => d.score >= 8).length
  };
};

export const getBadges = (workouts, diet, measurements, settings) => {
  const badges = [];
  
  // 1. Consistency Badge
  if (workouts.length >= 5) badges.push({ icon: '🔥', text: 'Workout Starter', color: 'text-orange-500' });
  if (workouts.length >= 20) badges.push({ icon: '🚀', text: 'Consistency King', color: 'text-red-500' });

  // 2. Weight Loss Badge
  const currentWeight = measurements[0]?.weight || 0;
  const startWeight = settings.startWeight || 0;
  if (startWeight - currentWeight >= 2) badges.push({ icon: '📉', text: '2kg Down!', color: 'text-blue-500' });
  
  // 3. Diet Streak
  const perfectDays = diet.filter(d => d.score >= 9).length;
  if (perfectDays >= 7) badges.push({ icon: '🥦', text: 'Clean Eater', color: 'text-green-500' });

  return badges;
};

export const exportToCSV = (data) => {
  const headers = ['Date', 'Weight (kg)', 'Waist Lower (cm)', 'Hip (cm)', 'Notes'];
  const rows = data.measurements.map(m => [
    m.date, 
    m.weight, 
    m.waistLower, 
    m.hip || '', 
    `"${m.notes || ''}"` // Escape quotes
  ]);

  let csvContent = "data:text/csv;charset=utf-8," 
    + headers.join(",") + "\n" 
    + rows.map(e => e.join(",")).join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "fittrack_data.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};