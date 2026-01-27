-- Remove the dangerous public read access policy
DROP POLICY IF EXISTS "Allow public read access for profiles" ON public.profiles;

-- Ensure proper policy exists for users to view their own profile
-- (Already exists but let's make sure it's correct)
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
USING (is_admin(auth.uid()));