import React, { createContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../supabaseClient';

export const AppContext = createContext();

// Mock Initial Seed Data for Local Fallback Mode
const DEFAULT_CLASSES = [
  { id: 'class-hist-101', name: 'Introduction to Medieval History', code: 'HIST-101' },
  { id: 'class-cs-302', name: 'Database Management Systems', code: 'CS-302' },
  { id: 'class-bio-204', name: 'Quantitative Biology', code: 'BIO-204' },
  { id: 'class-cs-101', name: 'Computer Science 101', code: 'CS-101' }
];

const DEFAULT_ASSIGNMENTS = [
  {
    id: 'assign-dbms-4',
    class_id: 'class-cs-302',
    title: 'DBMS Lab 4: SQL Joins',
    description: 'Practice writing complex SQL statements utilizing INNER, LEFT, RIGHT, and FULL OUTER joins. Submit a text file containing queries and screenshots of the execution tables.',
    max_points: 100,
    due_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // tomorrow
  },
  {
    id: 'assign-discrete-math',
    class_id: 'class-cs-101',
    title: 'Discrete Math: Graph Theory',
    description: 'Solve the problem set on graph traversals, Eulerian path, and Hamiltonian paths. Scan and upload hand-written solutions.',
    max_points: 100,
    due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days
  },
  {
    id: 'assign-swe-class',
    class_id: 'class-cs-101',
    title: 'Software Eng: Class Diagrams',
    description: 'Draw UML Class diagrams based on the case study of a library management system. Use draw.io or any diagramming tool and submit as a PDF or image.',
    max_points: 100,
    due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
  },
  {
    id: 'assign-os-threads',
    class_id: 'class-cs-302',
    title: 'Operating Systems: Kernel Threads',
    description: 'Implement a multi-threaded producer-consumer system in C using POSIX mutex and conditional variables.',
    max_points: 10,
    due_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // past
  },
  {
    id: 'assign-net-security',
    class_id: 'class-cs-302',
    title: 'Network Security: RSA Quiz',
    description: 'Calculate cryptographic components using RSA prime factorization steps manually.',
    max_points: 10,
    due_date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // past
  },
  {
    id: 'assign-medieval-essay',
    class_id: 'class-hist-101',
    title: 'Mid-term Research Essay',
    description: 'Write a 1500-word essay on the socioeconomic impact of the Black Death in 14th century Europe.',
    max_points: 100,
    due_date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days
  }
];

const DEFAULT_SUBMISSIONS = [
  {
    id: 'sub-eleanor',
    assignment_id: 'assign-medieval-essay',
    student_id: 'stud-eleanor',
    student_name: 'Eleanor Markward',
    file_name: 'research_v2.pdf',
    submitted_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
    grade: null,
    feedback: null
  },
  {
    id: 'sub-benedict',
    assignment_id: 'assign-medieval-essay',
    student_id: 'stud-benedict',
    student_name: 'Benedict Thaw',
    file_name: 'history_essay.pdf',
    submitted_at: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(), // 1.5 days ago
    grade: null,
    feedback: null
  },
  {
    id: 'sub-sarah',
    assignment_id: 'assign-medieval-essay',
    student_id: 'stud-sarah',
    student_name: 'Sarah Jenkins',
    file_name: 'final_submission.pdf',
    submitted_at: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(), // 2 days ago
    grade: 92,
    feedback: 'Excellent source analysis!'
  },
  {
    id: 'sub-oscar',
    assignment_id: 'assign-medieval-essay',
    student_id: 'stud-oscar',
    student_name: 'Oscar Henderson',
    file_name: 'medieval_essay.pdf',
    submitted_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    grade: null,
    feedback: null
  },
  {
    id: 'sub-alex-os',
    assignment_id: 'assign-os-threads',
    student_id: 'stud-alex',
    student_name: 'Alex',
    file_name: 'os_kernel_threads.c',
    submitted_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    grade: 9.5,
    feedback: 'Excellent work on the visualization of race conditions.'
  },
  {
    id: 'sub-alex-net',
    assignment_id: 'assign-net-security',
    student_id: 'stud-alex',
    student_name: 'Alex',
    file_name: 'rsa_math_problems.pdf',
    submitted_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    grade: 8,
    feedback: 'Review the prime factorization step for larger integers.'
  }
];

export const AppProvider = ({ children }) => {
  const [classes, setClasses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSupabase, setIsSupabase] = useState(isSupabaseConfigured);

  // Load Initial Database State
  useEffect(() => {
    const initDatabase = async () => {
      setLoading(true);
      if (isSupabaseConfigured) {
        try {
          // Fetch from Supabase
          const { data: classesData, error: classesError } = await supabase
            .from('classes')
            .select('*');
          
          const { data: assignmentsData, error: assignmentsError } = await supabase
            .from('assignments')
            .select('*');
          
          const { data: submissionsData, error: submissionsError } = await supabase
            .from('submissions')
            .select('*');

          if (classesError || assignmentsError || submissionsError) {
            throw new Error('Supabase schema tables are not ready or loaded.');
          }

          setClasses(classesData || []);
          setAssignments(assignmentsData || []);
          setSubmissions(submissionsData || []);
          setIsSupabase(true);
          console.log('Successfully connected to live Supabase Postgres database!');
        } catch (err) {
          console.warn('Supabase fetch failed (database tables might not be created yet). Falling back to Local Storage.', err.message);
          setIsSupabase(false);
          loadLocalData();
        }
      } else {
        loadLocalData();
      }
      
      // Load current user from session if available
      const savedUser = localStorage.getItem('edusync_user');
      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
      }
      setLoading(false);
    };

    const loadLocalData = () => {
      // Classes
      let localClasses = localStorage.getItem('edusync_classes');
      if (!localClasses) {
        localStorage.setItem('edusync_classes', JSON.stringify(DEFAULT_CLASSES));
        localClasses = JSON.stringify(DEFAULT_CLASSES);
      }
      setClasses(JSON.parse(localClasses));

      // Assignments
      let localAssignments = localStorage.getItem('edusync_assignments');
      if (!localAssignments) {
        localStorage.setItem('edusync_assignments', JSON.stringify(DEFAULT_ASSIGNMENTS));
        localAssignments = JSON.stringify(DEFAULT_ASSIGNMENTS);
      }
      setAssignments(JSON.parse(localAssignments));

      // Submissions
      let localSubmissions = localStorage.getItem('edusync_submissions');
      if (!localSubmissions) {
        localStorage.setItem('edusync_submissions', JSON.stringify(DEFAULT_SUBMISSIONS));
        localSubmissions = JSON.stringify(DEFAULT_SUBMISSIONS);
      }
      setSubmissions(JSON.parse(localSubmissions));
    };

    initDatabase();
  }, []);

  // Authentication: User Login Simulation
  const login = async (email, requestedRole = 'student') => {
    setLoading(true);
    let user = null;
    
    // Hardcoded logic for mock user logins
    if (email === 'alex@university.edu') {
      user = { id: 'stud-alex', email, role: 'student', full_name: 'Alex' };
    } else if (email === 'doe@university.edu') {
      user = { id: 'teach-doe', email, role: 'teacher', full_name: 'Prof. Doe' };
    } else {
      // Dynamic profile creation for testing custom accounts
      const name = email.split('@')[0];
      const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
      user = {
        id: `user-${Date.now()}`,
        email,
        role: requestedRole,
        full_name: requestedRole === 'teacher' ? `Prof. ${capitalizedName}` : capitalizedName
      };
    }

    if (isSupabase) {
      try {
        // Try to fetch profile from Supabase first
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('email', email)
          .single();

        if (error || !profile) {
          // Create new profile record in Supabase
          const demoUuid = email === 'doe@university.edu' 
            ? 'd8808de1-64bd-4ee7-9f68-12c85e25287e' 
            : 'c8808de1-64bd-4ee7-9f68-12c85e25287f';
            
          const { data: newProfile, error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: user.id.includes('user-') ? crypto.randomUUID() : demoUuid,
              email: user.email,
              role: user.role,
              full_name: user.full_name
            })
            .select()
            .single();
          
          if (!insertError && newProfile) {
            user = newProfile;
          }
        } else {
          user = profile;
        }

        // Force correct roles for demo accounts to prevent any db schema/state drift lockouts
        if (user) {
          if (email === 'doe@university.edu') {
            user.role = 'teacher';
          } else if (email === 'alex@university.edu') {
            user.role = 'student';
          }
        }
      } catch (err) {
        console.warn('Supabase auth lookup failed, using local profile object instead.', err.message);
      }
    }

    setCurrentUser(user);
    localStorage.setItem('edusync_user', JSON.stringify(user));
    setLoading(false);
    return user;
  };

  // Authentication: Logout
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('edusync_user');
  };

  // Create Assignment
  const addAssignment = async (title, description, classId, maxPoints, dueDate) => {
    setLoading(true);
    const newAssignObj = {
      title,
      description,
      class_id: classId,
      max_points: parseInt(maxPoints),
      due_date: new Date(dueDate).toISOString(),
    };

    if (isSupabase) {
      try {
        const { data, error } = await supabase
          .from('assignments')
          .insert(newAssignObj)
          .select()
          .single();

        if (error) throw error;
        
        // Re-fetch assignments
        const { data: refreshed, error: fetchErr } = await supabase
          .from('assignments')
          .select('*');
        if (!fetchErr) setAssignments(refreshed);
      } catch (err) {
        console.error('Supabase assignment creation error:', err.message);
        fallbackAddAssignment(newAssignObj);
      }
    } else {
      fallbackAddAssignment(newAssignObj);
    }
    setLoading(false);
  };

  const fallbackAddAssignment = (newAssign) => {
    const localAss = [...assignments, { ...newAssign, id: `assign-${Date.now()}` }];
    localStorage.setItem('edusync_assignments', JSON.stringify(localAss));
    setAssignments(localAss);
  };

  // Student Assignment Submission
  const submitAssignment = async (assignmentId, fileName) => {
    if (!currentUser) return;
    setLoading(true);
    const newSubObj = {
      assignment_id: assignmentId,
      student_id: currentUser.id,
      student_name: currentUser.full_name,
      file_name: fileName,
      submitted_at: new Date().toISOString()
    };

    if (isSupabase) {
      try {
        const { error } = await supabase
          .from('submissions')
          .insert(newSubObj);

        if (error) throw error;

        const { data: refreshed, error: fetchErr } = await supabase
          .from('submissions')
          .select('*');
        if (!fetchErr) setSubmissions(refreshed);
      } catch (err) {
        console.error('Supabase submission error:', err.message);
        fallbackSubmitAssignment(newSubObj);
      }
    } else {
      fallbackSubmitAssignment(newSubObj);
    }
    setLoading(false);
  };

  const fallbackSubmitAssignment = (newSub) => {
    // Remove duplicate submissions from same student for same assignment to simulate re-upload
    const filtered = submissions.filter(
      s => !(s.assignment_id === newSub.assignment_id && s.student_id === newSub.student_id)
    );
    const localSubs = [...filtered, { ...newSub, id: `sub-${Date.now()}`, grade: null, feedback: null }];
    localStorage.setItem('edusync_submissions', JSON.stringify(localSubs));
    setSubmissions(localSubs);
  };

  // Teacher Grading Submission
  const gradeSubmission = async (submissionId, grade, feedback) => {
    setLoading(true);
    const numGrade = grade === '' || grade === null ? null : parseFloat(grade);

    if (isSupabase) {
      try {
        const { error } = await supabase
          .from('submissions')
          .update({ grade: numGrade, feedback })
          .eq('id', submissionId);

        if (error) throw error;

        const { data: refreshed, error: fetchErr } = await supabase
          .from('submissions')
          .select('*');
        if (!fetchErr) setSubmissions(refreshed);
      } catch (err) {
        console.error('Supabase grading update error:', err.message);
        fallbackGradeSubmission(submissionId, numGrade, feedback);
      }
    } else {
      fallbackGradeSubmission(submissionId, numGrade, feedback);
    }
    setLoading(false);
  };

  const fallbackGradeSubmission = (subId, numGrade, feedbackText) => {
    const localSubs = submissions.map(s => {
      if (s.id === subId) {
        return { ...s, grade: numGrade, feedback: feedbackText };
      }
      return s;
    });
    localStorage.setItem('edusync_submissions', JSON.stringify(localSubs));
    setSubmissions(localSubs);
  };

  // Reset database helper (purely local fallback helper)
  const resetLocalDatabase = () => {
    localStorage.removeItem('edusync_classes');
    localStorage.removeItem('edusync_assignments');
    localStorage.removeItem('edusync_submissions');
    setClasses(DEFAULT_CLASSES);
    setAssignments(DEFAULT_ASSIGNMENTS);
    setSubmissions(DEFAULT_SUBMISSIONS);
  };

  return (
    <AppContext.Provider value={{
      classes,
      assignments,
      submissions,
      currentUser,
      loading,
      isSupabase,
      login,
      logout,
      addAssignment,
      submitAssignment,
      gradeSubmission,
      resetLocalDatabase
    }}>
      {children}
    </AppContext.Provider>
  );
};
