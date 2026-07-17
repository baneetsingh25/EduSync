import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Navigate } from 'react-router-dom';

export default function StudentDashboard() {
  const { currentUser, assignments, submissions, submitAssignment, classes, loading } = useContext(AppContext);
  const [uploadingForAssignId, setUploadingForAssignId] = useState(null);
  const [simulatedFileName, setSimulatedFileName] = useState('');
  const [showToast, setShowToast] = useState(false);

  // Auth Protection
  if (!currentUser) return <Navigate to="/login?role=student" replace />;
  if (currentUser.role !== 'student') return <Navigate to="/teacher" replace />;

  // Helper: Get Class Code & Name by Class ID
  const getClassInfo = (classId) => {
    const cls = classes.find(c => c.id === classId);
    return cls ? `${cls.code}: ${cls.name}` : 'General Academic';
  };

  // Helper: Check if student has submitted an assignment
  const getStudentSubmission = (assignId) => {
    return submissions.find(s => s.assignment_id === assignId && s.student_id === currentUser.id);
  };

  // Split assignments into Pending & Completed
  const pendingAssignments = [];
  const completedAssignments = [];

  assignments.forEach(assign => {
    const sub = getStudentSubmission(assign.id);
    if (sub && (sub.grade !== null || sub.submitted_at)) {
      completedAssignments.push({ ...assign, submission: sub });
    } else {
      pendingAssignments.push(assign);
    }
  });

  // Handle Mock Upload submission
  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!simulatedFileName.trim()) return;

    submitAssignment(uploadingForAssignId, simulatedFileName);
    setUploadingForAssignId(null);
    setSimulatedFileName('');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const getPriorityBadge = (dueDateStr) => {
    const dueDate = new Date(dueDateStr);
    const msDiff = dueDate - Date.now();
    const hoursDiff = msDiff / (1000 * 60 * 60);

    if (hoursDiff > 0 && hoursDiff < 36) {
      return (
        <span className="bg-error-container text-on-error-container px-2 py-0.5 rounded font-bold text-[10px] uppercase tracking-wider">
          High Priority
        </span>
      );
    }
    return null;
  };

  const formatDueDate = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    
    // Check if due tomorrow
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === tomorrow.toDateString()) {
      return `Due tomorrow, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    return `Due ${date.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}`;
  };

  return (
    <div className="fade-in-up w-full max-w-7xl mx-auto px-container-padding py-stack-md space-y-stack-lg pb-24 md:pb-12">
      
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-20 md:bottom-10 right-10 bg-secondary text-white px-5 py-3 rounded-xl flex items-center gap-3 shadow-lg z-50 animate-bounce">
          <span className="material-symbols-outlined">check_circle</span>
          <span className="text-xs font-bold">Assignment submitted successfully!</span>
        </div>
      )}

      {/* Header Welcome Section */}
      <section className="space-y-1">
        <h1 className="font-headline text-headline-lg-mobile md:text-headline-lg font-extrabold text-chocolate">
          Good Morning, {currentUser.full_name}
        </h1>
        <p className="font-body text-sm text-on-surface-variant">
          You have <span className="font-bold text-rust">{pendingAssignments.length}</span> pending tasks due this week. Stay focused!
        </p>
      </section>

      {/* Pending Assignments Section */}
      <section className="space-y-stack-md">
        <div className="flex items-center justify-between">
          <h2 className="font-headline text-headline-md font-bold text-chocolate">Pending Assignments</h2>
          <span className="text-xs font-bold px-3 py-1 bg-primary-container text-on-primary-container rounded-full">
            {pendingAssignments.length} Tasks
          </span>
        </div>

        {pendingAssignments.length === 0 ? (
          <div className="border border-dashed border-outline-variant/50 rounded-xl p-8 text-center bg-surface-container-low/30">
            <span className="material-symbols-outlined text-4xl text-outline mb-2">task_alt</span>
            <p className="text-sm font-bold text-chocolate">All caught up!</p>
            <p className="text-xs text-on-surface-variant">You have no pending assignments right now.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-md">
            {pendingAssignments.map(assign => (
              <div 
                key={assign.id}
                className="bg-surface-container-lowest border border-primary/10 rounded-xl p-5 shadow-sm card-hover flex flex-col justify-between gap-4"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-outline">
                        {getClassInfo(assign.class_id)}
                      </p>
                      <h3 className="font-headline text-lg font-bold text-chocolate">
                        {assign.title}
                      </h3>
                    </div>
                    {getPriorityBadge(assign.due_date)}
                  </div>
                  <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-3">
                    {assign.description}
                  </p>
                  <div className="flex items-center text-on-surface-variant gap-1.5 text-xs font-semibold">
                    <span className="material-symbols-outlined text-base">calendar_today</span>
                    <span>{formatDueDate(assign.due_date)}</span>
                  </div>
                </div>

                <button 
                  onClick={() => setUploadingForAssignId(assign.id)}
                  className="w-full mt-2 bg-primary-container hover:bg-[#c9751e]/15 text-primary hover:text-rust py-2.5 rounded-lg font-bold text-xs flex items-center justify-center gap-2 border border-primary/20 transition-all"
                >
                  <span className="material-symbols-outlined text-sm">upload_file</span>
                  Upload PDF/Image
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Completed Assignments Section */}
      <section className="space-y-stack-md">
        <h2 className="font-headline text-headline-md font-bold text-chocolate">Recently Completed</h2>
        
        {completedAssignments.length === 0 ? (
          <p className="text-xs text-outline italic">No completed tasks yet. Submit assignments above to see your history.</p>
        ) : (
          <div className="space-y-stack-sm">
            {completedAssignments.map(assign => (
              <div 
                key={assign.id}
                className="bg-surface-container border border-outline-variant/30 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 opacity-95"
              >
                <div className="space-y-1">
                  <div className="flex items-center flex-wrap gap-2">
                    <h3 className="font-headline text-sm font-bold text-chocolate">
                      {assign.title}
                    </h3>
                    <span className="bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">check_circle</span>
                      Submitted
                    </span>
                  </div>
                  <p className="text-xs text-outline font-medium">
                    File: <span className="underline italic">{assign.submission.file_name}</span> &bull; 
                    Submitted {new Date(assign.submission.submitted_at).toLocaleDateString()}
                  </p>
                  
                  {assign.submission.feedback && (
                    <p className="text-xs font-medium text-on-surface-variant italic pl-3 border-l-2 border-outline-variant/55 mt-1.5">
                      "{assign.submission.feedback}"
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-3 md:pt-0 border-outline-variant/20">
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Grade</p>
                    <p className="font-headline text-lg font-bold text-secondary">
                      {assign.submission.grade !== null ? `${assign.submission.grade}/${assign.max_points}` : 'Pending Grading'}
                    </p>
                  </div>
                  <div className="p-2 text-outline-variant hover:text-primary transition-colors cursor-pointer">
                    <span className="material-symbols-outlined">description</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Simulated Upload Modal Dialog */}
      {uploadingForAssignId && (
        <div className="fixed inset-0 bg-black/45 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <h3 className="font-headline text-lg font-bold text-chocolate mb-2">Simulate File Upload</h3>
            <p className="text-xs text-on-surface-variant mb-4">
              EduSync simulates uploading file documents onto our database structure. Select a filename to submit.
            </p>
            
            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-chocolate" htmlFor="mockFile">File Name</label>
                <input 
                  type="text" 
                  id="mockFile"
                  value={simulatedFileName}
                  onChange={(e) => setSimulatedFileName(e.target.value)}
                  placeholder="e.g., dbms_lab4_joins_alex.pdf"
                  required
                  className="w-full px-3 py-2 bg-white border border-outline/35 rounded-lg text-sm input-focus-ring"
                />
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button 
                  type="button" 
                  onClick={() => setUploadingForAssignId(null)}
                  className="px-4 py-2 text-xs font-bold text-on-surface-variant hover:bg-surface-container rounded-lg"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-rust hover:bg-primary text-white rounded-lg shadow-sm"
                >
                  Upload & Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
