import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

export default function Navbar({ activeClassId, setActiveClassId }) {
  const { currentUser, logout, isSupabase, classes, geminiKey, saveGeminiKey } = useContext(AppContext);
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [tempKey, setTempKey] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const openAIModal = () => {
    setTempKey(geminiKey);
    setShowAIModal(true);
  };

  const handleSaveKey = (e) => {
    e.preventDefault();
    saveGeminiKey(tempKey);
    setShowAIModal(false);
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
            {isSupabase ? 'Supabase Live' : 'Demo Local Mode'}
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
          
          {/* AI Settings Indicator Button */}
          <button 
            onClick={openAIModal}
            className={`p-2 rounded-full transition-colors relative flex items-center justify-center ${
              geminiKey 
                ? 'text-rust hover:bg-rust/10' 
                : 'text-on-surface-variant hover:bg-surface-container-high'
            }`}
            title="Configure Gemini Assistant"
          >
            <span className="material-symbols-outlined">smart_toy</span>
            {geminiKey && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-secondary border border-white rounded-full"></span>
            )}
          </button>

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

      {/* Gemini Settings Modal */}
      {showAIModal && (
        <div className="fixed inset-0 bg-[#453724]/40 backdrop-blur-sm z-50 flex items-start md:items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#FAF9F5] border-2 border-[#453724] rounded-2xl p-6 w-full max-w-md shadow-[6px_6px_0px_0px_#453724] animate-in fade-in zoom-in-95 duration-200 relative my-4 md:my-auto">
            
            {/* Close Button */}
            <button 
              onClick={() => setShowAIModal(false)}
              className="absolute top-4 right-4 text-[#453724] hover:bg-[#453724]/10 p-1.5 rounded-full transition-colors flex items-center justify-center"
              title="Close Dialog"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>

            <h3 className="font-headline text-lg font-bold text-chocolate mb-2 flex items-center gap-2 pr-8">
              <span className="material-symbols-outlined text-rust">smart_toy</span>
              Configure Gemini Assistant
            </h3>
            <p className="text-xs text-on-surface-variant mb-4 leading-relaxed font-medium">
              Save your Gemini API Key locally to unlock AI features (AI Assignment draft generator, AI grading suggestions, and student study companions).
            </p>
            
            <form onSubmit={handleSaveKey} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-chocolate flex justify-between" htmlFor="aiKey">
                  <span>Google Gemini API Key</span>
                  {geminiKey && <span className="text-[10px] text-secondary font-bold">Key is active</span>}
                </label>
                <input 
                  type="password" 
                  id="aiKey"
                  value={tempKey}
                  onChange={(e) => setTempKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full px-3 py-2 bg-white border border-[#453724] rounded-lg text-sm focus:ring-1 focus:ring-primary outline-none"
                />
              </div>

              <div className="text-[10px] text-outline font-semibold leading-relaxed border-t border-[#453724]/10 pt-3">
                Note: Your API Key is saved directly in your browser's local storage and is only used to query the Gemini client locally. It is never uploaded to any server.
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button 
                  type="button" 
                  onClick={() => setShowAIModal(false)}
                  className="px-4 py-2 text-xs font-bold text-chocolate hover:bg-[#453724]/5 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2.5 bg-rust border-2 border-[#453724] text-white hover:bg-primary rounded-xl font-bold text-xs shadow-sm transition-colors active:scale-95 flex items-center gap-1"
                >
                  Save API Key
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </header>
  );
}
