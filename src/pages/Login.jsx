import React, { useContext, useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

export default function Login() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login, currentUser } = useContext(AppContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [animatingInputs, setAnimatingInputs] = useState(false);

  // Set initial role from query parameter
  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam === 'teacher' || roleParam === 'student') {
      setRole(roleParam);
    }
  }, [searchParams]);

  // Trigger input slide animation on mount
  useEffect(() => {
    setAnimatingInputs(true);
    const timer = setTimeout(() => setAnimatingInputs(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg('Please enter your email address.');
      return;
    }
    setErrorMsg('');
    try {
      const loggedUser = await login(email, role);
      if (loggedUser.role === 'teacher') {
        navigate('/teacher');
      } else {
        navigate('/student');
      }
    } catch (err) {
      setErrorMsg('Failed to log in. Please try again.');
    }
  };

  const handleQuickLogin = async (selectedEmail, selectedRole) => {
    try {
      const loggedUser = await login(selectedEmail, selectedRole);
      if (loggedUser.role === 'teacher') {
        navigate('/teacher');
      } else {
        navigate('/student');
      }
    } catch (err) {
      setErrorMsg('Failed quick login.');
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-120px)] flex flex-col items-center justify-center p-gutter relative overflow-hidden">
      
      {/* Background Ambience Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-tertiary-fixed/30 ambient-blob"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-secondary-container/20 ambient-blob"></div>

      <main className="w-full max-w-md fade-in-up">
        
        {/* Main login card container */}
        <div className="login-card bg-surface-container-low rounded-xl p-8 md:p-10">
          
          <header className="text-center mb-8">
            <div className="mb-4 inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary-container text-white shadow-sm">
              <span className="material-symbols-outlined text-[28px]">assignment</span>
            </div>
            <h1 className="font-headline text-headline-lg font-bold text-chocolate mb-1">AssignmentTracker</h1>
            <p className="text-sm font-medium text-on-surface-variant">Welcome back! Please sign in to continue.</p>
          </header>

          {errorMsg && (
            <div className="mb-4 p-3 bg-error-container text-on-error-container rounded-lg text-xs font-semibold flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">error</span>
              {errorMsg}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role Tab Selector */}
            <div className="flex bg-surface-container p-1 rounded-lg border border-outline-variant/30">
              <button
                type="button"
                onClick={() => setRole('student')}
                className={`flex-1 py-1.5 rounded-md text-xs font-bold transition-all ${
                  role === 'student' 
                    ? 'bg-white text-rust shadow-sm' 
                    : 'text-on-surface-variant hover:text-chocolate'
                }`}
              >
                Student Portal
              </button>
              <button
                type="button"
                onClick={() => setRole('teacher')}
                className={`flex-1 py-1.5 rounded-md text-xs font-bold transition-all ${
                  role === 'teacher' 
                    ? 'bg-white text-rust shadow-sm' 
                    : 'text-on-surface-variant hover:text-chocolate'
                }`}
              >
                Faculty Portal
              </button>
            </div>

            {/* Email field */}
            <div className={`space-y-1.5 transition-all duration-500 transform ${
              animatingInputs ? 'translate-y-2 opacity-0' : 'translate-y-0 opacity-100'
            }`}>
              <label className="block text-xs font-bold text-chocolate" htmlFor="email">Email Address</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">mail</span>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@university.edu"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-outline/35 rounded-lg text-sm text-on-surface placeholder:text-outline-variant/65 input-focus-ring transition-all"
                />
              </div>
            </div>

            {/* Password field */}
            <div className={`space-y-1.5 transition-all duration-500 delay-100 transform ${
              animatingInputs ? 'translate-y-2 opacity-0' : 'translate-y-0 opacity-100'
            }`}>
              <div className="flex justify-between items-center">
                <label className="block text-xs font-bold text-chocolate" htmlFor="password">Password</label>
                <button type="button" className="text-[10px] font-bold text-rust hover:underline transition-all">Forgot Password?</button>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">lock</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-2.5 bg-white border border-outline/35 rounded-lg text-sm text-on-surface placeholder:text-outline-variant/65 input-focus-ring transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-chocolate transition-colors flex items-center justify-center"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              className="w-full py-3.5 bg-rust hover:bg-[#b0671c] text-white text-xs font-bold rounded-lg shadow-sm active:scale-[0.98] transition-all flex items-center justify-center gap-2 group mt-6"
            >
              Sign In
              <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </button>
          </form>

          {/* Quick login sandbox triggers */}
          <div className="mt-8 pt-6 border-t border-outline-variant/30 space-y-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-outline text-center">Demo Quick Accounts</p>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => handleQuickLogin('alex@university.edu', 'student')}
                className="flex items-center justify-center gap-1.5 p-2 bg-white border border-outline-variant/40 hover:bg-surface-container rounded-lg text-xs font-bold text-chocolate transition-colors"
              >
                <span className="material-symbols-outlined text-sm">school</span>
                Alex (Student)
              </button>
              <button 
                onClick={() => handleQuickLogin('doe@university.edu', 'teacher')}
                className="flex items-center justify-center gap-1.5 p-2 bg-white border border-outline-variant/40 hover:bg-surface-container rounded-lg text-xs font-bold text-chocolate transition-colors"
              >
                <span className="material-symbols-outlined text-sm">co_present</span>
                Prof. Doe (Teacher)
              </button>
            </div>
          </div>

          <footer className="mt-8 text-center text-xs text-on-surface-variant/80">
            <p>Don't have an account? <span className="text-rust font-bold hover:underline cursor-pointer">Contact administrator.</span></p>
          </footer>

        </div>

        {/* Outer aesthetic elements */}
        <div className="mt-8 flex justify-center opacity-30">
          <div className="flex items-center gap-4">
            <div className="h-[1px] w-12 bg-outline"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-rust"></div>
            <div className="h-[1px] w-12 bg-outline"></div>
          </div>
        </div>

      </main>
    </div>
  );
}
