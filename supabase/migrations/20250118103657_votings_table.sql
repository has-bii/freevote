-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID DEFAULT auth.uid() NOT NULL PRIMARY KEY,  -- Use auth.uid() for default
  full_name TEXT NOT NULL,
  avatar TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable row-level security for the profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy for accessing profiles
CREATE POLICY "all accesses based on user_id"
ON profiles
FOR ALL
USING ((SELECT auth.uid()) = id);

-- Function to handle user update in profiles
CREATE OR REPLACE FUNCTION public.handle_user_update() 
RETURNS "trigger"
LANGUAGE "plpgsql" 
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  UPDATE public.profiles
  SET full_name = new.raw_user_meta_data ->> 'full_name',
      avatar = new.raw_user_meta_data ->> 'avatar'
  WHERE id = new.id;
  RETURN new;
END;
$$;

-- Function to handle new user insertion in profiles
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS "trigger"
LANGUAGE "plpgsql" 
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar)
  VALUES (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar'
  );
  RETURN new;
END;
$$;

-- Trigger to handle new user insert
CREATE OR REPLACE TRIGGER new_user
AFTER INSERT ON auth.users
FOR EACH ROW 
EXECUTE FUNCTION handle_new_user();

-- Trigger to handle user update
CREATE OR REPLACE TRIGGER update_user
AFTER UPDATE ON auth.users
FOR EACH ROW 
EXECUTE FUNCTION handle_user_update();

-- Create voting_type enum type
CREATE TYPE voting_type AS ENUM (
  'voting',
  'nomination'
);

-- Create votings table
CREATE TABLE votings (
    id UUID DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    user_id UUID DEFAULT auth.uid() NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,  -- Use auth.uid() for user_id default
    name TEXT NOT NULL,
    description TEXT,
    type voting_type,
    icon TEXT NOT NULL,
    is_open BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable row-level security for the votings table
ALTER TABLE votings ENABLE ROW LEVEL SECURITY;

-- Policy for accessing votings based on user_id
CREATE POLICY "all accesses based on user_id"
ON votings
FOR ALL
USING ((SELECT auth.uid()) = user_id);

-- Public access policy for votings (authenticated users can select)
CREATE POLICY "Public"
ON votings
FOR SELECT
TO authenticated
USING (true);
