import { GoogleGenerativeAI } from '@google/generative-ai';

const getAIClient = (customKey) => {
  const key = customKey || localStorage.getItem('edusync_gemini_key') || import.meta.env.VITE_GEMINI_API_KEY || '';
  if (!key) return null;
  return new GoogleGenerativeAI(key);
};

export const isAIConfigured = (customKey) => {
  return !!(customKey || localStorage.getItem('edusync_gemini_key') || import.meta.env.VITE_GEMINI_API_KEY);
};

export const generateAssignmentPrompt = async (topic, className, customKey) => {
  const genAI = getAIClient(customKey);
  if (!genAI) throw new Error("Gemini API key not configured");

  const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash' });
  const prompt = `Create assignment instructions for the topic: "${topic}" in the class: "${className}". Output format: Keep it clear and detailed. Include learning objectives, key tasks required, resources to look at, and submission guidelines. Make it look like physical stationery text, highly structured.`;
  
  const result = await model.generateContent(prompt);
  return result.response.text();
};

export const generateFeedbackSuggestion = async (studentName, assignmentTitle, maxPoints, fileName, isLate, customKey) => {
  const genAI = getAIClient(customKey);
  if (!genAI) throw new Error("Gemini API key not configured");

  const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash' });
  const prompt = `Student Name: ${studentName}\nAssignment: ${assignmentTitle} (Max points: ${maxPoints})\nSubmitted File: ${fileName}\nSubmission Timing: ${isLate ? 'LATE SUBMISSION' : 'ON TIME'}\n\nRecommend a grade (out of ${maxPoints}, deduction if late) and write a short, encouraging feedback comment (1-2 sentences). You MUST output using this format:\nGRADE: [number]\nFEEDBACK: [feedback comment]`;
  
  const result = await model.generateContent(prompt);
  const text = result.response.text();
  
  const gradeMatch = text.match(/GRADE:\s*([\d.]+)/i);
  const feedbackMatch = text.match(/FEEDBACK:\s*([\s\S]+)/i);

  return {
    grade: gradeMatch ? parseFloat(gradeMatch[1]) : Math.round(maxPoints * 0.9),
    feedback: feedbackMatch ? feedbackMatch[1].trim() : "Good effort on this assignment."
  };
};

export const generateStudyTips = async (assignmentTitle, description, customKey) => {
  const genAI = getAIClient(customKey);
  if (!genAI) throw new Error("Gemini API key not configured");

  const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash' });
  const prompt = `Assignment Topic: "${assignmentTitle}"\nInstructions: "${description}"\n\nProvide 3 quick, actionable study steps, a brief explanation of key concepts they need to know, and a draft outline to help them start writing/solving.`;
  
  const result = await model.generateContent(prompt);
  return result.response.text();
};
