-- Run this in your Supabase SQL Editor

-- 1. Create the user_roles table
CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  role text NOT NULL DEFAULT 'Siswa',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Set up Row Level Security (RLS)
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own role
CREATE POLICY "Users can read own role" ON public.user_roles
  FOR SELECT
  USING (auth.uid() = id);

-- Allow Admins to read all roles
CREATE POLICY "Admins can read all roles" ON public.user_roles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles WHERE id = auth.uid() AND role = 'Admin'
    )
  );

-- Allow Admins to update all roles
CREATE POLICY "Admins can update roles" ON public.user_roles
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles WHERE id = auth.uid() AND role = 'Admin'
    )
  );

-- 3. Create a trigger to automatically create a user_roles entry when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_roles (id, role)
  VALUES (new.id, 'Siswa');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function every time a user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- To make an existing user an Admin, run this manually once:
-- UPDATE public.user_roles SET role = 'Admin' WHERE id = 'your-user-uuid';
