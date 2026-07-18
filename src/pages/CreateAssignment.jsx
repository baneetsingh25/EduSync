import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate, Navigate } from 'react-router-dom';
import { generateAssignmentPrompt, isAIConfigured } from '../services/aiService';

export default function CreateAssignment() {
  const { classes, addAssignment, currentUser, geminiKey } = useContext(AppContext);
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [classId, setClassId] = useState('');
  const [points, setPoints] = useState('100');
  const [dueDate, setDueDate] = useState('');
  const [publishing, setPublishing] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // AI Assist States
  const [showAIInput, setShowAIInput] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [generatingAI, setGeneratingAI] = useState(false);

  // Auth Protection
  if (!currentUser) return <Navigate to="/login?role=teacher" replace />;
  if (currentUser.role !== 'teacher') return <Navigate to="/student" replace />;

  const handleAIAssist = async () => {
    if (!aiTopic.trim()) return;
    if (!isAIConfigured(geminiKey)) {
      alert("Please configure your Gemini API Key first by clicking the robot icon in the top navigation bar!");
      return;
    }

    setGeneratingAI(true);
    try {
      const selectedClass = classes.find(c => c.id === classId);
      const className = selectedClass ? selectedClass.name : "general study";
      
      const generatedInstructions = await generateAssignmentPrompt(aiTopic, className, geminiKey);
      setDescription(generatedInstructions);
      setShowAIInput(false);
    } catch (err) {
      alert("AI Generation failed: " + err.message);
    } finally {
      setGeneratingAI(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !classId || !dueDate) {
      alert('Please fill out Title, Class, and Due Date.');
      return;
    }

    setPublishing(true);

    // Call context action
    await addAssignment(title, description, classId, points, dueDate);

    // Show Toast
    setPublishing(false);
    setShowToast(true);

    // Redirect to Dashboard after 1.5s
    setTimeout(() => {
      setShowToast(false);
      navigate('/teacher');
    }, 1500);
  };

  return (
    <div className="fade-in-up w-full max-w-3xl mx-auto px-container-padding py-stack-lg flex flex-col items-center pb-24 md:pb-12">
      
      {/* Success Toast */}
      {showToast && (
        <div className="fixed bottom-20 md:bottom-10 right-10 bg-secondary text-white px-5 py-3 rounded-xl flex items-center gap-3 shadow-lg z-50 animate-bounce">
          <span className="material-symbols-outlined">check_circle</span>
          <span className="text-xs font-bold">Assignment Published Successfully!</span>
        </div>
      )}

      {/* Main Form Container */}
      <div className="w-full bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-6 md:p-10 transition-all duration-300 shadow-sm">
        
        {/* Heading Section */}
        <div className="mb-6">
          <h1 className="font-headline text-headline-lg font-bold text-chocolate mb-1">Create New Assignment</h1>
          <p className="text-xs font-medium text-on-surface-variant">Set clear goals and deadlines for your students.</p>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-on-surface-variant" htmlFor="title">Assignment Title</label>
            <input 
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Chapter 5: Advanced SQL"
              required
              className="w-full h-11 px-4 rounded-lg border border-outline-variant bg-white text-xs font-medium text-on-surface placeholder:text-outline/45 transition-all form-focus-ring"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-on-surface-variant" htmlFor="description">Description / Instructions</label>
              <button
                type="button"
                onClick={() => setShowAIInput(!showAIInput)}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-rust hover:text-primary transition-colors py-0.5 px-2 bg-rust/5 rounded-md"
              >
                <span className="material-symbols-outlined text-xs">smart_toy</span>
                {showAIInput ? 'Close AI Draft' : 'Draft with AI'}
              </button>
            </div>

            {showAIInput && (
              <div className="p-3 bg-surface-container border border-outline-variant/40 rounded-lg flex flex-col md:flex-row gap-2 items-center">
                <input 
                  type="text"
                  placeholder="E.g., SQL Joins practice with sample tables and 3 questions..."
                  value={aiTopic}
                  onChange={(e) => setAiTopic(e.target.value)}
                  className="flex-1 px-3 py-1.5 bg-white border border-outline/35 rounded-lg text-xs font-medium focus:ring-1 focus:ring-primary outline-none"
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAIAssist(); } }}
                />
                <div className="flex gap-2 w-full md:w-auto justify-end">
                  <button
                    type="button"
                    onClick={handleAIAssist}
                    disabled={generatingAI}
                    className="px-3 py-1.5 bg-rust text-white text-xs font-bold rounded-lg hover:bg-primary transition-colors flex items-center gap-1"
                  >
                    {generatingAI ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        Generating...
                      </>
                    ) : (
                      'Generate'
                    )}
                  </button>
                </div>
              </div>
            )}

            <textarea 
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detail the expectations, resources, and steps for completion..."
              rows="6"
              className="w-full p-4 rounded-lg border border-outline-variant bg-white text-xs font-medium text-on-surface placeholder:text-outline/45 transition-all form-focus-ring resize-none"
            />
          </div>

          {/* Two Column Selector */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-md">
            {/* Class select */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-on-surface-variant" htmlFor="classSelect">Class Selection</label>
              <select 
                id="classSelect"
                value={classId}
                onChange={(e) => setClassId(e.target.value)}
                required
                className="w-full h-11 px-3 rounded-lg border border-outline-variant bg-white text-xs font-medium text-on-surface transition-all form-focus-ring"
              >
                <option value="">Select a class</option>
                {classes.map(cls => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name} ({cls.code})
                  </option>
                ))}
              </select>
            </div>

            {/* Points */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-on-surface-variant" htmlFor="points">Max Points</label>
              <input 
                type="number"
                id="points"
                value={points}
                onChange={(e) => setPoints(e.target.value)}
                min="0"
                required
                className="w-full h-11 px-4 rounded-lg border border-outline-variant bg-white text-xs font-medium text-on-surface transition-all form-focus-ring"
              />
            </div>
          </div>

          {/* Due date */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-on-surface-variant" htmlFor="dueDate">Due Date & Time</label>
            <input 
              type="datetime-local"
              id="dueDate"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
              className="w-full h-11 px-4 rounded-lg border border-outline-variant bg-white text-xs font-medium text-on-surface transition-all form-focus-ring"
            />
          </div>

          {/* Mock upload attachments placeholder block */}
          <div className="pt-2">
            <label className="text-xs font-bold text-on-surface-variant mb-1 block">Attachments (Optional)</label>
            <div className="border border-dashed border-outline-variant/60 rounded-xl p-6 flex flex-col items-center justify-center bg-surface-container-low/20 hover:bg-surface-container-low/40 transition-all cursor-pointer">
              <span className="material-symbols-outlined text-outline text-[32px] mb-1">upload_file</span>
              <p className="text-xs font-semibold text-on-surface-variant">Attachments simulated uploading</p>
              <p className="text-[10px] text-outline/70">PDF, DOCX, JPG (Max 25MB)</p>
            </div>
          </div>

          {/* Form buttons */}
          <div className="flex flex-col md:flex-row gap-gutter pt-4">
            <button 
              type="submit"
              disabled={publishing}
              className="flex-1 h-12 bg-rust hover:bg-[#b06519] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
            >
              {publishing ? (
                <span>Publishing...</span>
              ) : (
                <>
                  <span>Publish Assignment</span>
                  <span className="material-symbols-outlined text-sm">send</span>
                </>
              )}
            </button>
            <button 
              type="button"
              onClick={() => navigate('/teacher')}
              className="flex-1 h-12 bg-transparent text-chocolate border border-outline/30 hover:bg-surface-container-low rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
            >
              <span>Cancel</span>
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>

        </form>

      </div>

      {/* Helper info */}
      <div className="mt-6 max-w-3xl w-full flex justify-between items-center px-1 text-outline/65 text-[10px] font-bold">
        <div className="flex items-center gap-1">
          <span className="material-symbols-outlined text-xs">info</span>
          Your progress is autosaved.
        </div>
        <span className="underline hover:text-primary cursor-pointer">Assignment Guidelines</span>
      </div>

    </div>
  );
}
