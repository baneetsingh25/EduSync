import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { NavLink, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const { currentUser } = useContext(AppContext);
  const location = useLocation();

  if (!currentUser || currentUser.role !== 'teacher') return null;

  return (
    <aside className="h-[calc(100vh-64px)] w-64 left-0 top-16 sticky bg-surface-container-low border-r border-outline-variant flex flex-col py-stack-md z-30 hidden md:flex">
      <div className="px-6 mb-stack-lg">
        <h2 className="font-headline-md text-sm font-bold text-chocolate uppercase tracking-wider">Faculty Portal</h2>
        <p className="text-[11px] text-on-surface-variant">Classroom Management</p>
      </div>

      <nav className="flex-1 space-y-1 px-4">
        {/* Dashboard Link */}
        <NavLink 
          to="/teacher" 
          end
          className={({ isActive }) => 
            `flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-body-md text-sm ${
              isActive 
                ? 'text-primary font-bold border-r-4 border-primary bg-surface-container-high' 
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest'
            }`
          }
        >
          <span className="material-symbols-outlined">dashboard</span>
          <span>Grading Queue</span>
        </NavLink>

        {/* Create Assignment Link */}
        <NavLink 
          to="/teacher/create" 
          className={({ isActive }) => 
            `flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-body-md text-sm ${
              isActive 
                ? 'text-primary font-bold border-r-4 border-primary bg-surface-container-high' 
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest'
            }`
          }
        >
          <span className="material-symbols-outlined">add_circle</span>
          <span>Create Assignment</span>
        </NavLink>

        {/* Mock Links for Presentation */}
        <div className="flex items-center gap-3 px-4 py-3 text-outline/50 cursor-not-allowed font-body-md text-sm">
          <span className="material-symbols-outlined">analytics</span>
          <span>Gradebook</span>
        </div>
        <div className="flex items-center gap-3 px-4 py-3 text-outline/50 cursor-not-allowed font-body-md text-sm">
          <span className="material-symbols-outlined">settings</span>
          <span>Settings</span>
        </div>
      </nav>

      {/* User Footer Profile */}
      <div className="px-6 py-stack-md border-t border-outline-variant/30 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-sm">
          JD
        </div>
        <div>
          <p className="text-xs font-bold text-on-surface">{currentUser.full_name}</p>
          <p className="text-[10px] text-on-surface-variant">History Dept.</p>
        </div>
      </div>
    </aside>
  );
}
