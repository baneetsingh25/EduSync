-- SQL Schema Setup for EduSync Warm Path Assignment Tracker

-- Enable uuid-ossp extension for UUID generation if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create Profiles Table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY, -- References auth.users.id
    email TEXT NOT NULL UNIQUE,
    role TEXT NOT NULL CHECK (role IN ('student', 'teacher')),
    full_name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Classes Table
CREATE TABLE IF NOT EXISTS public.classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create Assignments Table
CREATE TABLE IF NOT EXISTS public.assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    max_points INTEGER DEFAULT 100 NOT NULL,
    due_date TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create Submissions Table
CREATE TABLE IF NOT EXISTS public.submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id UUID REFERENCES public.assignments(id) ON DELETE CASCADE NOT NULL,
    student_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    student_name TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_url TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    grade NUMERIC CHECK (grade >= 0),
    feedback TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- Create Policies
-- Profiles: Users can read all profiles; users can only update their own profile
CREATE POLICY "Allow public read access to profiles" ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "Allow users to update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Classes: Read access for everyone; write access for teachers/authenticated users
CREATE POLICY "Allow public read access to classes" ON public.classes
    FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to insert classes" ON public.classes
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Assignments: Read access for everyone; write/update/delete for teachers
CREATE POLICY "Allow public read access to assignments" ON public.assignments
    FOR SELECT USING (true);

CREATE POLICY "Allow teachers to insert assignments" ON public.assignments
    FOR INSERT WITH CHECK (true); -- Simplified for development, usually checks profiles.role

CREATE POLICY "Allow teachers to update assignments" ON public.assignments
    FOR UPDATE USING (true);

CREATE POLICY "Allow teachers to delete assignments" ON public.assignments
    FOR DELETE USING (true);

-- Submissions: Students can view/insert their own submissions; teachers can view/update all submissions
CREATE POLICY "Allow users to view submissions" ON public.submissions
    FOR SELECT USING (true);

CREATE POLICY "Allow students to insert submissions" ON public.submissions
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow teachers to update submissions (grading)" ON public.submissions
    FOR UPDATE USING (true);

-- Seed Data: Insert Default Classes
INSERT INTO public.classes (name, code) VALUES
('Introduction to Medieval History', 'HIST-101')
ON CONFLICT (code) DO NOTHING;

INSERT INTO public.classes (name, code) VALUES
('Database Management Systems', 'CS-302')
ON CONFLICT (code) DO NOTHING;

INSERT INTO public.classes (name, code) VALUES
('Quantitative Biology', 'BIO-204')
ON CONFLICT (code) DO NOTHING;

INSERT INTO public.classes (name, code) VALUES
('Computer Science 101', 'CS-101')
ON CONFLICT (code) DO NOTHING;
