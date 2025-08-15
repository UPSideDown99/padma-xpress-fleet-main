-- Update existing user to admin role
UPDATE public.profiles 
SET role = 'admin', full_name = 'Super Admin'
WHERE id = (
  SELECT id FROM auth.users WHERE email = 'admin@padma.id'
);