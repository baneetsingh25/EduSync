import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { generateFeedbackSuggestion, isAIConfigured } from '../services/aiService';

export default function TeacherDashboard({ activeClassId }) {
  const { currentUser, assignments, submissions, gradeSubmission, classes, isSupabase, geminiKey } = useContext(AppContext);
  const navigate = useNavigate();
  
  // Local state for grading inputs
  const [grades, setGrades] = useState({});
  const [remarks, setRemarks] = useState({});
  const [savingId, setSavingId] = useState(null);
  const [savedId, setSavedId] = useState(null);
  const [loadingAIId, setLoadingAIId] = useState(null);
  const [filterMode, setFilterMode] = useState('all'); // 'all', 'pending', 'graded'

  // Auth Protection
  if (!currentUser) return <Navigate to="/login?role=teacher" replace />;
  if (currentUser.role !== 'teacher') return <Navigate to="/student" replace />;

  const handleAIFeedback = async (subId, studentName, fileName, isLate) => {
    if (!isAIConfigured(geminiKey)) {
      alert("Please configure your Gemini API Key first by clicking the robot icon in the top navigation bar!");
      return;
    }

    setLoadingAIId(subId);
    try {
      const result = await generateFeedbackSuggestion(
        studentName, 
        activeAssignment ? activeAssignment.title : "Assignment",
        activeAssignment ? activeAssignment.max_points : 100,
        fileName, 
        isLate, 
        geminiKey
      );
      
      setGrades(prev => ({ ...prev, [subId]: result.grade.toString() }));
      setRemarks(prev => ({ ...prev, [subId]: result.feedback }));
    } catch (err) {
      alert("AI Grading suggestions failed: " + err.message);
    } finally {
      setLoadingAIId(null);
    }
  };

  const currentClass = classes.find(c => c.id === activeClassId);

  // Filter assignments for selected class
  const classAssignments = assignments.filter(a => a.class_id === activeClassId);
  const activeAssignment = classAssignments[0] || null; // default to first assignment of class

  // Filter submissions for the active assignment
  const assignmentSubmissions = submissions.filter(
    s => activeAssignment && s.assignment_id === activeAssignment.id
  );

  // Initialize input states when submissions load
  useEffect(() => {
    const initialGrades = {};
    const initialRemarks = {};
    assignmentSubmissions.forEach(sub => {
      initialGrades[sub.id] = sub.grade !== null ? sub.grade.toString() : '';
      initialRemarks[sub.id] = sub.feedback || '';
    });
    setGrades(initialGrades);
    setRemarks(initialRemarks);
  }, [submissions, activeClassId]);

  // Handle grade change
  const handleGradeChange = (subId, value) => {
    setGrades(prev => ({ ...prev, [subId]: value }));
  };

  // Handle remark change
  const handleRemarkChange = (subId, value) => {
    setRemarks(prev => ({ ...prev, [subId]: value }));
  };

  // Save grade action
  const handleSaveGrade = async (subId) => {
    setSavingId(subId);
    const score = grades[subId];
    const feedback = remarks[subId];
    
    // Simulate server saving delay
    setTimeout(async () => {
      await gradeSubmission(subId, score, feedback);
      setSavingId(null);
      setSavedId(subId);
      setTimeout(() => setSavedId(null), 2000);
    }, 800);
  };

  // Filter queue rows
  const filteredSubmissions = assignmentSubmissions.filter(sub => {
    if (filterMode === 'pending') return sub.grade === null;
    if (filterMode === 'graded') return sub.grade !== null;
    return true;
  });

  const getSubmittedInitials = (name) => {
    if (!name) return 'ST';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getSubmittedClassBg = (index) => {
    const colors = ['bg-tertiary-fixed-dim text-on-tertiary-fixed', 'bg-secondary-fixed-dim text-on-secondary-fixed', 'bg-primary-fixed-dim text-on-primary-fixed'];
    return colors[index % colors.length];
  };

  return (
    <div className="fade-in-up flex-1 p-container-padding max-w-7xl mx-auto w-full pb-24 md:pb-12">
      
      {/* Title & Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-stack-md">
        <div>
          <h1 className="font-headline text-headline-lg font-bold text-chocolate">Grading Queue</h1>
          <p className="text-sm font-medium text-on-surface-variant">
            Active Assignment: <span className="font-bold text-tertiary">{activeAssignment ? activeAssignment.title : 'No Assignments Published'}</span>
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {/* Filter switches */}
          <div className="flex bg-surface-container border border-outline-variant/30 rounded-lg p-0.5 text-xs font-semibold">
            <button 
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1.5 rounded-md transition-all ${filterMode === 'all' ? 'bg-white text-rust shadow-sm' : 'text-on-surface-variant'}`}
            >
              All ({assignmentSubmissions.length})
            </button>
            <button 
              onClick={() => setFilterMode('pending')}
              className={`px-3 py-1.5 rounded-md transition-all ${filterMode === 'pending' ? 'bg-white text-rust shadow-sm' : 'text-on-surface-variant'}`}
            >
              Pending ({assignmentSubmissions.filter(s => s.grade === null).length})
            </button>
            <button 
              onClick={() => setFilterMode('graded')}
              className={`px-3 py-1.5 rounded-md transition-all ${filterMode === 'graded' ? 'bg-white text-rust shadow-sm' : 'text-on-surface-variant'}`}
            >
              Graded ({assignmentSubmissions.filter(s => s.grade !== null).length})
            </button>
          </div>

          <button 
            onClick={() => navigate('/teacher/create')}
            className="px-4 py-1.5 text-xs font-bold bg-rust hover:bg-[#b0671c] text-white rounded-lg flex items-center gap-1.5 shadow-sm active:scale-95 transition-all ml-auto md:ml-0"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            Create Assignment
          </button>
        </div>
      </div>

      {/* Main Queue table */}
      {!activeAssignment ? (
        <div className="border border-dashed border-outline-variant/50 rounded-xl p-12 text-center bg-white shadow-sm flex flex-col items-center">
          <span className="material-symbols-outlined text-5xl text-outline mb-3">note_add</span>
          <h3 className="font-headline text-lg font-bold text-chocolate mb-1">No assignments for this class</h3>
          <p className="text-sm text-on-surface-variant max-w-sm mb-6">
            Get started by creating a new assignment and setting a due date for your student group.
          </p>
          <button 
            onClick={() => navigate('/teacher/create')}
            className="px-6 py-2.5 bg-rust hover:bg-primary text-white font-bold rounded-xl text-xs shadow-sm transition-all"
          >
            Create First Assignment
          </button>
        </div>
      ) : filteredSubmissions.length === 0 ? (
        <div className="border border-dashed border-outline-variant/50 bg-white rounded-xl p-12 text-center shadow-sm">
          <span className="material-symbols-outlined text-4xl text-outline mb-2">inbox</span>
          <p className="text-sm font-bold text-chocolate">No submissions found</p>
          <p className="text-xs text-on-surface-variant">There are no files in this grading category yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-chocolate overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              
              <thead>
                <tr className="bg-surface-container-high border-b border-chocolate text-left">
                  <th className="px-6 py-4 font-bold text-xs text-chocolate uppercase tracking-wider">Student Name</th>
                  <th className="px-6 py-4 font-bold text-xs text-chocolate uppercase tracking-wider">Submission File</th>
                  <th className="px-6 py-4 font-bold text-xs text-chocolate uppercase tracking-wider">Time Submitted</th>
                  <th className="px-6 py-4 font-bold text-xs text-chocolate uppercase tracking-wider w-24">Grade</th>
                  <th className="px-6 py-4 font-bold text-xs text-chocolate uppercase tracking-wider">Remarks</th>
                  <th className="px-6 py-4 font-bold text-xs text-chocolate uppercase tracking-wider text-right w-28">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#453724]/20">
                {filteredSubmissions.map((sub, idx) => {
                  const isLate = activeAssignment && new Date(sub.submitted_at) > new Date(activeAssignment.due_date);
                  
                  return (
                    <tr key={sub.id} className="hover:bg-[#F6F5F0]/50 transition-colors group">
                      {/* Name */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${getSubmittedClassBg(idx)}`}>
                            {getSubmittedInitials(sub.student_name)}
                          </div>
                          <span className="text-sm font-bold text-on-surface">{sub.student_name}</span>
                        </div>
                      </td>

                      {/* File */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <a href="#" onClick={(e) => e.preventDefault()} className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline">
                          <span className="material-symbols-outlined text-sm">picture_as_pdf</span>
                          {sub.file_name}
                        </a>
                      </td>

                      {/* Time */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          {isLate && (
                            <span className="text-[10px] font-extrabold text-rust tracking-wide mb-0.5">LATE</span>
                          )}
                          <span className="text-xs text-on-surface-variant font-medium">
                            {new Date(sub.submitted_at).toLocaleString([], {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      </td>

                      {/* Grade Input */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          <input 
                            type="text"
                            value={grades[sub.id] || ''}
                            onChange={(e) => handleGradeChange(sub.id, e.target.value)}
                            placeholder={`/${activeAssignment.max_points}`}
                            className="w-16 px-2 py-1 border border-outline rounded-lg text-center text-xs font-bold text-primary focus:ring-1 focus:ring-primary outline-none"
                          />
                        </div>
                      </td>

                      {/* Remark Input */}
                      <td className="px-6 py-4 w-full min-w-[240px]">
                        <div className="flex items-center gap-2">
                          <input 
                            type="text"
                            value={remarks[sub.id] || ''}
                            onChange={(e) => handleRemarkChange(sub.id, e.target.value)}
                            placeholder="Add feedback..."
                            className="flex-1 px-3 py-1 border border-outline-variant rounded-lg text-xs font-medium focus:border-primary outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => handleAIFeedback(sub.id, sub.student_name, sub.file_name, isLate)}
                            disabled={loadingAIId === sub.id}
                            className={`p-1.5 rounded-lg border transition-all flex items-center justify-center ${
                              loadingAIId === sub.id 
                                ? 'bg-surface-container text-outline' 
                                : 'bg-rust/5 border-rust/10 text-rust hover:bg-rust/10'
                            }`}
                            title="Generate AI Feedback Suggestion"
                          >
                            {loadingAIId === sub.id ? (
                              <span className="w-3.5 h-3.5 border-2 border-outline/30 border-t-outline rounded-full animate-spin"></span>
                            ) : (
                              <span className="material-symbols-outlined text-base">smart_toy</span>
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Action */}
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        {savedId === sub.id ? (
                          <div className="inline-flex items-center gap-1 text-secondary font-bold text-xs">
                            <span className="material-symbols-outlined text-sm">check_circle</span>
                            Saved
                          </div>
                        ) : (
                          <button 
                            onClick={() => handleSaveGrade(sub.id)}
                            disabled={savingId === sub.id}
                            className="bg-rust hover:bg-[#A65E18] text-white px-3 py-1.5 rounded-lg text-[10px] font-bold md:opacity-0 group-hover:opacity-100 transition-opacity active:scale-95"
                          >
                            {savingId === sub.id ? (
                              <span className="material-symbols-outlined text-xs animate-spin">sync</span>
                            ) : (
                              'Save Grade'
                            )}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>

            </table>
          </div>

          {/* Table footer count */}
          <div className="bg-surface-container-low px-6 py-3 border-t border-[#453724]/20 flex justify-between items-center text-xs">
            <span className="font-bold text-on-surface-variant">Showing {filteredSubmissions.length} of {assignmentSubmissions.length} students</span>
            <div className="flex gap-2">
              <button disabled className="p-1 border border-outline-variant rounded hover:bg-white transition-colors disabled:opacity-50">
                <span className="material-symbols-outlined text-sm">chevron_left</span>
              </button>
              <button disabled className="p-1 border border-outline-variant rounded hover:bg-white transition-colors disabled:opacity-50">
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pro tip card */}
      <div className="mt-8 p-stack-md bg-[#fdfcf8] border border-dashed border-outline-variant rounded-xl flex items-start gap-4 shadow-sm">
        <div className="p-2 bg-primary-container/20 text-primary rounded-lg">
          <span className="material-symbols-outlined">tips_and_updates</span>
        </div>
        <div>
          <h4 className="font-bold text-xs text-on-surface">Pro-Tip for Bulk Grading</h4>
          <p className="text-xs text-on-surface-variant leading-relaxed mt-0.5 max-w-2xl">
            You can type grades and remarks, then hover to click 'Save Grade' on the respective row. Changes sync immediately to your {isSupabase ? 'live Supabase database' : 'local web storage fallback'}!
          </p>
        </div>
      </div>

    </div>
  );
}
