import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="fade-in-up w-full max-w-7xl mx-auto px-container-padding pb-stack-lg hero-gradient">
      
      {/* Hero Section */}
      <section className="flex flex-col items-center text-center py-stack-lg md:py-24 max-w-4xl mx-auto">
        <div className="mb-stack-md inline-flex items-center gap-2 px-4 py-1 bg-surface-container-high rounded-full">
          <span className="material-symbols-outlined text-rust scale-75">verified</span>
          <span className="text-xs uppercase tracking-wider text-on-surface-variant/80 font-bold">Simple. Reliable. Effective.</span>
        </div>
        <h1 className="font-headline text-headline-xl md:text-6xl text-chocolate mb-stack-md leading-tight font-extrabold">
          Seamless Assignment Tracking for <span className="text-rust">Colleges.</span>
        </h1>
        <p className="font-body text-body-lg text-on-surface-variant/80 max-w-2xl mb-stack-lg">
          We've removed the digital friction. No complex dashboards, no steep learning curves. Just the essential tools for students and faculty to thrive together.
        </p>

        {/* Identity Selector (Core Interaction) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-md w-full mt-stack-md">
          <button 
            onClick={() => navigate('/login?role=student')}
            className="group relative overflow-hidden flex flex-col items-center justify-center p-stack-lg bg-rust hover:bg-primary text-white rounded-xl transition-all duration-300 transform hover:-translate-y-1 active:scale-95 shadow-lg"
          >
            <div className="mb-4 bg-white/20 p-4 rounded-full group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-4xl">school</span>
            </div>
            <span className="font-headline text-headline-md font-bold">I am a Student</span>
            <p className="mt-2 text-white/80 text-sm font-medium">Track deadlines and submit tasks</p>
          </button>

          <button 
            onClick={() => navigate('/login?role=teacher')}
            className="group relative overflow-hidden flex flex-col items-center justify-center p-stack-lg bg-rust hover:bg-primary text-white rounded-xl transition-all duration-300 transform hover:-translate-y-1 active:scale-95 shadow-lg"
          >
            <div className="mb-4 bg-white/20 p-4 rounded-full group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-4xl">co_present</span>
            </div>
            <span className="font-headline text-headline-md font-bold">I am a Teacher</span>
            <p className="mt-2 text-white/80 text-sm font-medium">Manage grades and assignments</p>
          </button>
        </div>
      </section>

      {/* Feature Bento Grid */}
      <section className="py-stack-lg">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-stack-md">
          
          {/* Feature 1 */}
          <div className="md:col-span-8 bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-stack-md flex flex-col md:flex-row gap-stack-md items-center organic-shadow">
            <div className="flex-1">
              <h3 className="font-headline text-headline-md font-bold mb-2">Paper-Like Simplicity</h3>
              <p className="text-on-surface-variant font-body text-sm leading-relaxed">
                Designed to mimic the comfort of physical stationery. Our interface feels familiar from the first click, reducing anxiety for non-tech-savvy users.
              </p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center gap-2 text-xs font-semibold text-secondary">
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  High-contrast text for legibility
                </li>
                <li className="flex items-center gap-2 text-xs font-semibold text-secondary">
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  Large, accessible touch targets
                </li>
              </ul>
            </div>
            <div className="w-full md:w-1/2 aspect-video bg-surface-container-high rounded-lg overflow-hidden flex items-center justify-center relative border border-outline-variant/20">
              {/* Fallback clean placeholder illustration representation */}
              <div className="flex flex-col items-center justify-center text-outline">
                <span className="material-symbols-outlined text-5xl">menu_book</span>
                <span className="text-xs mt-2 uppercase tracking-wide">Academic Canvas</span>
              </div>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="md:col-span-4 bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-stack-md flex flex-col justify-between organic-shadow card-hover">
            <div>
              <div className="w-12 h-12 bg-secondary-container text-secondary flex items-center justify-center rounded-lg mb-4">
                <span className="material-symbols-outlined text-2xl">analytics</span>
              </div>
              <h3 className="font-headline text-headline-md font-bold mb-2">Grade Visibility</h3>
              <p className="text-on-surface-variant font-body text-xs leading-relaxed">
                Real-time tracking of academic progress without the clutter of complex analytics.
              </p>
            </div>
            <div className="mt-stack-md pt-4 border-t border-outline-variant/30 flex justify-between items-center text-xs font-bold text-rust">
              <span className="uppercase tracking-wide opacity-65">Insight Module</span>
              <span className="material-symbols-outlined">arrow_forward</span>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="md:col-span-4 bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-stack-md flex flex-col justify-between organic-shadow card-hover">
            <div>
              <div className="w-12 h-12 bg-tertiary-fixed text-chocolate flex items-center justify-center rounded-lg mb-4">
                <span className="material-symbols-outlined text-2xl">notifications_active</span>
              </div>
              <h3 className="font-headline text-headline-md font-bold mb-2">Smart Reminders</h3>
              <p className="text-on-surface-variant font-body text-xs leading-relaxed">
                Gentle nudges for upcoming deadlines. No aggressive alerts—just helpful guidance.
              </p>
            </div>
            <div className="mt-stack-md pt-4 border-t border-outline-variant/30 flex items-center gap-3">
              <span className="text-xs font-bold text-outline">+4k Active Students</span>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="md:col-span-8 bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-stack-md organic-shadow overflow-hidden relative">
            <div className="flex flex-col md:flex-row gap-stack-md">
              <div className="flex-1 relative z-10">
                <h3 className="font-headline text-headline-md font-bold mb-2">Faculty Gradebook</h3>
                <p className="text-on-surface-variant font-body text-sm leading-relaxed">
                  A spacious, clean data view for educators. Replace messy spreadsheets with a structured, breathable gradebook designed for focus.
                </p>
                <button 
                  onClick={() => navigate('/login?role=teacher')}
                  className="mt-6 px-6 py-2 bg-chocolate text-white rounded-lg font-bold text-xs hover:opacity-90 transition-opacity"
                >
                  Explore Gradebook View
                </button>
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <div className="rounded-lg border border-outline-variant/30 bg-background/50 p-3 space-y-2">
                  <div className="h-6 bg-surface-container rounded w-full"></div>
                  <div className="h-6 bg-surface-container-high rounded w-5/6"></div>
                  <div className="h-6 bg-surface-container rounded w-11/12"></div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Proof Section */}
      <section className="py-stack-lg border-y border-outline-variant/20 flex flex-col md:flex-row items-center justify-around gap-stack-lg text-center md:text-left">
        <div>
          <span className="font-headline text-3xl font-extrabold text-rust">98%</span>
          <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant opacity-70">Faculty Adoption Rate</p>
        </div>
        <div>
          <span className="font-headline text-3xl font-extrabold text-rust">12s</span>
          <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant opacity-70">Average Submission Time</p>
        </div>
        <div>
          <span className="font-headline text-3xl font-extrabold text-rust">Zero</span>
          <p className="text-xs font-bold uppercase tracking-wider text-on-surface-variant opacity-70">IT Training Required</p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 text-center">
        <h2 className="font-headline text-3xl font-bold mb-stack-md text-chocolate">Ready to reclaim your academic focus?</h2>
        <p className="font-body text-base mb-stack-lg max-w-xl mx-auto text-on-surface-variant/80">
          Join 50+ colleges that have simplified their digital workflow with AssignmentTracker.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => navigate('/login?role=student')}
            className="px-stack-lg py-3.5 bg-rust text-white font-bold rounded-xl shadow-lg hover:scale-105 transition-transform active:scale-95 text-sm"
          >
            Get Started Free
          </button>
          <button className="px-stack-lg py-3.5 border-2 border-rust text-rust font-bold rounded-xl hover:bg-rust/5 transition-colors text-sm">
            Book a Demo
          </button>
        </div>
      </section>
      
    </div>
  );
}
