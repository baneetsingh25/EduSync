import React, { useContext, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AppProvider, AppContext } from './context/AppContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';
import Landing from './pages/Landing';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import CreateAssignment from './pages/CreateAssignment';

function AppContent() {
  const { classes, loading, currentUser } = useContext(AppContext);
  const [activeClassId, setActiveClassId] = useState('');
  const location = useLocation();

  // Set default active class once classes are loaded
  useEffect(() => {
    if (classes && classes.length > 0 && !activeClassId) {
      // Find HIST-101 if exists, else default to first class
      const histClass = classes.find(c => c.code === 'HIST-101');
      setActiveClassId(histClass ? histClass.id : classes[0].id);
    }
  }, [classes, activeClassId]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-chocolate">
        <span className="material-symbols-outlined text-4xl animate-spin">sync</span>
        <p className="mt-2 text-sm font-semibold">Loading EduSync portal...</p>
      </div>
    );
  }

  // Determine if layout should show teacher side layout
  const isTeacherLayout = currentUser && currentUser.role === 'teacher' && location.pathname.startsWith('/teacher');

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-rust selection:text-white">
      {/* Top Navigation Bar */}
      <Navbar activeClassId={activeClassId} setActiveClassId={setActiveClassId} />

      {/* Main Viewport */}
      <div className="flex flex-1">
        {/* Sidebar on teacher desktop viewports */}
        {isTeacherLayout && <Sidebar />}

        {/* Dynamic Route Viewport */}
        <div className="flex-1 flex flex-col relative">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/student" element={<StudentDashboard />} />
            <Route path="/teacher" element={<TeacherDashboard activeClassId={activeClassId} />} />
            <Route path="/teacher/create" element={<CreateAssignment />} />
          </Routes>
        </div>
      </div>

      {/* Bottom Navigation for mobile viewports */}
      <BottomNav />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Router>
        <AppContent />
      </Router>
    </AppProvider>
  );
}
