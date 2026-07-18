# 🎓 EduSync: AI-Powered Academic Management & Assignment Tracker

EduSync is a modern, responsive Academic Management System and Assignment Tracker designed for classrooms. It bridges the gap between students and teachers by incorporating **Google Gemini AI** and **Supabase (PostgreSQL)** to automate administrative work and guide students through their learning journeys.

---

## 🎥 Video Demonstration & Pitch Deck

- **🎬 Live Demo Video:** (https://youtu.be/fQxMi3zyUVY)
- **📊 Presentation Pitch Deck:** 
(https://gamma.app/docs/ EduSync-AI-Powered-Academic-Management-Assignment-Tracker-h6wcf25ss6bczpe?mode=doc)
- **🚀 Live Deployed Application:** (https://edu-sync-sepia.vercel.app/)

---

## 💡 Key Features

### 1. For Teachers
- **AI-Assisted Assignment Generator:** Input a topic and instantly generate structured instructions with learning objectives, tasks, and submission guidelines using Gemini.
- **AI Grading Assistant:** Auto-suggests grades and drafts encouraging, constructive remarks using Gemini by reviewing submission timing and file names.
- **Classroom Dashboards:** Monitor class assignments, scores, and track student submissions in real-time.

### 2. For Students
- **AI Study Companion:** Instantly access a sliding panel with 3 study steps, key concept reviews, and essay/project outlines tailored to the assignment instructions.
- **Real-time Status Tracking:** Filter assignments by all, pending, and submitted tasks.
- **Secure File Submission:** Upload and track completed assignments instantly.

### 3. Secure AI Configuration
- **Decentralized API Keys:** Configure your Gemini API Key directly inside the sliding header bar. Keys are securely cached in your local browser storage (`localStorage`) and never sent to our servers.

---

## 🛠️ Technology Stack

- **Frontend Framework:** React (Vite-powered SPA)
- **Styling & Icons:** Tailwind CSS & Google Material Icons
- **Database & Authentication:** Supabase (utilizing Row Level Security (RLS) policies for secure data separation)
- **AI Integration:** Google Gemini API SDK (`gemini-3.5-flash`)

---

## 🚀 Getting Started Locally

### 1. Prerequisites
Ensure you have Node.js installed.

### 2. Installation
Clone the repository, navigate to the folder, and install dependencies:
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory and add your Supabase credentials:
```env
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anonymous-key
```

### 4. Running the Dev Server
Start the local server:
```bash
npm run dev
```
The application will be running locally at `http://localhost:5173/` (or matching Vite port).
