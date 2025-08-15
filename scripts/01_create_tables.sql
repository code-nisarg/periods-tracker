-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create periods table to track period start dates
CREATE TABLE IF NOT EXISTS public.periods (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  start_date DATE NOT NULL,
  cycle_length INTEGER DEFAULT 28,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create symptoms table to track daily symptoms
CREATE TABLE IF NOT EXISTS public.symptoms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  symptom_type TEXT NOT NULL, -- 'physical', 'flow', 'mood'
  symptom_name TEXT NOT NULL,
  intensity INTEGER DEFAULT 1, -- 1-5 scale
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.symptoms ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Create policies for periods
CREATE POLICY "Users can view own periods" ON public.periods
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own periods" ON public.periods
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own periods" ON public.periods
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own periods" ON public.periods
  FOR DELETE USING (auth.uid() = user_id);

-- Create policies for symptoms
CREATE POLICY "Users can view own symptoms" ON public.symptoms
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own symptoms" ON public.symptoms
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own symptoms" ON public.symptoms
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own symptoms" ON public.symptoms
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_periods_user_id ON public.periods(user_id);
CREATE INDEX IF NOT EXISTS idx_periods_start_date ON public.periods(start_date);
CREATE INDEX IF NOT EXISTS idx_symptoms_user_id ON public.symptoms(user_id);
CREATE INDEX IF NOT EXISTS idx_symptoms_date ON public.symptoms(date);
CREATE INDEX IF NOT EXISTS idx_symptoms_user_date ON public.symptoms(user_id, date);
