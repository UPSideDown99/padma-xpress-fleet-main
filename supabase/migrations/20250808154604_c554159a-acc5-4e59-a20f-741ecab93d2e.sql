-- Fix infinite recursion in profiles RLS policies
-- Drop the problematic admin policy that causes recursion
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Create a simple policy that allows users to view their own profile
-- and authenticated users can view other profiles (simpler approach)
CREATE POLICY "Users can view profiles" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (true);

-- Keep the existing insert and update policies as they work correctly
-- Users can insert own profile: auth.uid() = id
-- Users can update own profile: auth.uid() = id