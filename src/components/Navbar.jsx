import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

export default function Navbar({ activeClassId, setActiveClassId }) {
  const { currentUser, logout, isSupabase, classes } = useContext(AppContext);
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const selectedClass = classes.find(c => c.id === activeClassId);

  return (
    <header className="w-full bg-background/95 sticky top-0 z-40 border-b border-outline-variant/30 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-gutter py-stack-sm flex justify-between items-center h-16">
        
        {/* Left Brand Anchor */}
        <div className="flex items-center gap-4">
          <span 
            className="font-headline-md text-headline-md font-bold text-primary cursor-pointer select-none"
            onClick={() => navigate('/')}
          >
            AssignmentTracker
          </span>

          {/* Database Connectivity Badge */}
          <span className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
            isSupabase 
              ? 'bg-secondary-container text-on-secondary-container border-secondary/20' 
              : 'bg-primary-container text-on-primary-container border-primary/20'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isSupabase ? 'bg-secondary animate-pulse' : 'bg-primary'}`}></span>
            {isSupabase ? ' Live' : 'Demo Local Mode'}
          </span>

          {/* Classroom Group Dropdown for Teacher */}
          {currentUser && currentUser.role === 'teacher' && (
            <div className="relative ml-4">
              <button 
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 px-3 py-1.5 bg-surface-container rounded-lg border border-outline-variant text-label-md font-semibold text-on-surface-variant hover:bg-surface-container-high transition-colors text-sm"
              >
                <span>{selectedClass ? selectedClass.name : 'Select Class'}</span>
                <span className="material-symbols-outlined text-base">expand_more</span>
              </button>

              {showDropdown && (
                <div className="absolute left-0 mt-1.5 w-64 bg-surface-container-lowest border border-outline-variant rounded-lg shadow-lg z-50 py-1">
                  {classes.map(cls => (
                    <button
                      key={cls.id}
                      onClick={() => {
                        setActiveClassId(cls.id);
                        setShowDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm text-chocolate hover:bg-surface-container transition-colors ${
                        activeClassId === cls.id ? 'font-bold bg-surface-container-low' : ''
                      }`}
                    >
                      {cls.name} ({cls.code})
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Navigation & Profile Controls */}
        <div className="flex items-center gap-4">
          {currentUser ? (
            <div className="flex items-center gap-2">
              {/* Role Indicator Badge */}
              <span className="hidden md:inline-block text-xs uppercase tracking-wider text-outline px-2 py-1 bg-surface-container rounded font-semibold">
                {currentUser.role}
              </span>

              {/* Profile Greeting */}
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-on-surface leading-tight">{currentUser.full_name}</p>
                <p className="text-xs text-on-surface-variant">{currentUser.email}</p>
              </div>

              {/* Logout Button */}
              <button 
                onClick={handleLogout}
                className="p-2 text-on-surface-variant hover:text-primary transition-colors rounded-full"
                title="Sign Out"
              >
                <span className="material-symbols-outlined">logout</span>
              </button>
            </div>
          ) : (
            <button 
              onClick={() => navigate('/login')}
              className="px-4 py-2 text-label-md font-bold text-rust hover:underline transition-all"
            >
              Sign In
            </button>
          )}
        </div>

      </div>
    </header>
  );
}
