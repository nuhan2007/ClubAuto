-- Enable RLS

-- Create user_profiles table
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create clubs table
CREATE TABLE IF NOT EXISTS public.clubs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    school TEXT NOT NULL,
    meeting_day TEXT,
    meeting_time TEXT,
    advisor_name TEXT,
    advisor_email TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create club_members table (junction table for users and clubs)
CREATE TABLE IF NOT EXISTS public.club_members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    club_id UUID REFERENCES public.clubs(id) ON DELETE CASCADE NOT NULL,
    role TEXT DEFAULT 'officer' NOT NULL,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, club_id)
);

-- Create members table (club member records, different from club_members)
CREATE TABLE IF NOT EXISTS public.members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    club_id UUID REFERENCES public.clubs(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    grade TEXT,
    email TEXT,
    phone TEXT,
    role TEXT DEFAULT 'member',
    join_date DATE DEFAULT CURRENT_DATE,
    attendance_percentage INTEGER DEFAULT 0,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- Create meeting_notes table
CREATE TABLE IF NOT EXISTS public.meeting_notes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    club_id UUID REFERENCES public.clubs(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    date DATE NOT NULL,
    attendees INTEGER DEFAULT 0,
    duration TEXT,
    status TEXT DEFAULT 'completed',
    summary TEXT,
    action_items JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id) NOT NULL
);

-- Create attendance_records table
CREATE TABLE IF NOT EXISTS public.attendance_records (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    club_id UUID REFERENCES public.clubs(id) ON DELETE CASCADE NOT NULL,
    event_date DATE NOT NULL,
    event_name TEXT NOT NULL,
    present_count INTEGER DEFAULT 0,
    absent_count INTEGER DEFAULT 0,
    total_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id) NOT NULL
);

-- Create hour_entries table
CREATE TABLE IF NOT EXISTS public.hour_entries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    club_id UUID REFERENCES public.clubs(id) ON DELETE CASCADE NOT NULL,
    member_name TEXT NOT NULL,
    date DATE NOT NULL,
    hours DECIMAL(4,2) NOT NULL,
    category TEXT,
    description TEXT,
    status TEXT DEFAULT 'approved',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id) NOT NULL
);

-- Create events table
CREATE TABLE IF NOT EXISTS public.events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    club_id UUID REFERENCES public.clubs(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    event_date DATE NOT NULL,
    event_time TEXT,
    location TEXT,
    category TEXT,
    description TEXT,
    current_attendees INTEGER DEFAULT 0,
    max_attendees INTEGER,
    status TEXT DEFAULT 'planned',
    priority TEXT DEFAULT 'medium',
    organizer TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id) NOT NULL
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    club_id UUID REFERENCES public.clubs(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    assignee TEXT,
    due_date DATE,
    priority TEXT DEFAULT 'medium',
    status TEXT DEFAULT 'todo',
    category TEXT,
    progress INTEGER DEFAULT 0,
    subtasks JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id) NOT NULL
);

-- Enable RLS on all tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.club_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meeting_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hour_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- User profiles: users can only see and edit their own profile
CREATE POLICY "Users can view own profile" ON public.user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Clubs: anyone can view clubs, only authenticated users can create
CREATE POLICY "Anyone can view clubs" ON public.clubs
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can create clubs" ON public.clubs
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Club members can update clubs" ON public.clubs
    FOR UPDATE TO authenticated USING (
        EXISTS (
            SELECT 1 FROM public.club_members 
            WHERE club_id = clubs.id AND user_id = auth.uid()
        )
    );

-- Club members: users can see memberships for clubs they belong to
CREATE POLICY "Users can view club memberships" ON public.club_members
    FOR SELECT TO authenticated USING (
        user_id = auth.uid() OR 
        EXISTS (
            SELECT 1 FROM public.club_members cm 
            WHERE cm.club_id = club_members.club_id AND cm.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can join clubs" ON public.club_members
    FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can leave clubs" ON public.club_members
    FOR DELETE TO authenticated USING (user_id = auth.uid());

-- Members: club officers can manage members
CREATE POLICY "Club members can view members" ON public.members
    FOR SELECT TO authenticated USING (
        EXISTS (
            SELECT 1 FROM public.club_members 
            WHERE club_id = members.club_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Club members can manage members" ON public.members
    FOR ALL TO authenticated USING (
        EXISTS (
            SELECT 1 FROM public.club_members 
            WHERE club_id = members.club_id AND user_id = auth.uid()
        )
    );

-- Meeting notes: club members can manage meeting notes
CREATE POLICY "Club members can view meeting notes" ON public.meeting_notes
    FOR SELECT TO authenticated USING (
        EXISTS (
            SELECT 1 FROM public.club_members 
            WHERE club_id = meeting_notes.club_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Club members can manage meeting notes" ON public.meeting_notes
    FOR ALL TO authenticated USING (
        EXISTS (
            SELECT 1 FROM public.club_members 
            WHERE club_id = meeting_notes.club_id AND user_id = auth.uid()
        )
    );

-- Attendance records: club members can manage attendance
CREATE POLICY "Club members can view attendance" ON public.attendance_records
    FOR SELECT TO authenticated USING (
        EXISTS (
            SELECT 1 FROM public.club_members 
            WHERE club_id = attendance_records.club_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Club members can manage attendance" ON public.attendance_records
    FOR ALL TO authenticated USING (
        EXISTS (
            SELECT 1 FROM public.club_members 
            WHERE club_id = attendance_records.club_id AND user_id = auth.uid()
        )
    );

-- Hour entries: club members can manage hours
CREATE POLICY "Club members can view hours" ON public.hour_entries
    FOR SELECT TO authenticated USING (
        EXISTS (
            SELECT 1 FROM public.club_members 
            WHERE club_id = hour_entries.club_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Club members can manage hours" ON public.hour_entries
    FOR ALL TO authenticated USING (
        EXISTS (
            SELECT 1 FROM public.club_members 
            WHERE club_id = hour_entries.club_id AND user_id = auth.uid()
        )
    );

-- Events: club members can manage events
CREATE POLICY "Club members can view events" ON public.events
    FOR SELECT TO authenticated USING (
        EXISTS (
            SELECT 1 FROM public.club_members 
            WHERE club_id = events.club_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Club members can manage events" ON public.events
    FOR ALL TO authenticated USING (
        EXISTS (
            SELECT 1 FROM public.club_members 
            WHERE club_id = events.club_id AND user_id = auth.uid()
        )
    );

-- Tasks: club members can manage tasks
CREATE POLICY "Club members can view tasks" ON public.tasks
    FOR SELECT TO authenticated USING (
        EXISTS (
            SELECT 1 FROM public.club_members 
            WHERE club_id = tasks.club_id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Club members can manage tasks" ON public.tasks
    FOR ALL TO authenticated USING (
        EXISTS (
            SELECT 1 FROM public.club_members 
            WHERE club_id = tasks.club_id AND user_id = auth.uid()
        )
    );

-- Function to handle user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, email, full_name)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER update_clubs_updated_at BEFORE UPDATE ON public.clubs
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
