import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { NavLink } from 'react-router-dom';

export default function BottomNav() {
  const { currentUser } = useContext(AppContext);

  // Suppress navbar if no user is signed in
  if (!currentUser) return null;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-40 flex justify-around items-center px-4 py-2 pb-safe bg-surface border-t border-outline-variant/30 shadow-lg rounded-t-xl">
      {currentUser.role === 'student' ? (
        <>
          <NavLink 
            to="/student"
            end
            className={({ isActive }) => 
              `flex flex-col items-center justify-center px-4 py-1.5 rounded-full transition-all ${
                isActive 
                  ? 'bg-primary-container text-on-primary-container scale-95 font-bold' 
                  : 'text-on-surface-variant hover:text-primary'
              }`
            }
          >
            <span className="material-symbols-outlined">home</span>
            <span className="text-[10px] font-label-md">Home</span>
          </NavLink>

          <div className="flex flex-col items-center justify-center text-outline/40 p-2 cursor-not-allowed">
            <span className="material-symbols-outlined">calendar_month</span>
            <span className="text-[10px] font-label-md">Calendar</span>
          </div>

          <div className="flex flex-col items-center justify-center text-outline/40 p-2 cursor-not-allowed">
            <span className="material-symbols-outlined">grade</span>
            <span className="text-[10px] font-label-md">Grades</span>
          </div>
        </>
      ) : (
        <>
          <NavLink 
            to="/teacher"
            end
            className={({ isActive }) => 
              `flex flex-col items-center justify-center px-4 py-1.5 rounded-full transition-all ${
                isActive 
                  ? 'bg-primary-container text-on-primary-container scale-95 font-bold' 
                  : 'text-on-surface-variant hover:text-primary'
              }`
            }
          >
            <span className="material-symbols-outlined">dashboard</span>
            <span className="text-[10px] font-label-md">Queue</span>
          </NavLink>

          <NavLink 
            to="/teacher/create"
            className={({ isActive }) => 
              `flex flex-col items-center justify-center px-4 py-1.5 rounded-full transition-all ${
                isActive 
                  ? 'bg-primary-container text-on-primary-container scale-95 font-bold' 
                  : 'text-on-surface-variant hover:text-primary'
              }`
            }
          >
            <span className="material-symbols-outlined">add_circle</span>
            <span className="text-[10px] font-label-md">Create</span>
          </NavLink>
        </>
      )}
    </nav>
  );
}
