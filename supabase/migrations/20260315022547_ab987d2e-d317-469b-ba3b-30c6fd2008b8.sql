-- FIX 1: Prevent privilege escalation on profiles INSERT
-- Drop the old permissive INSERT policy
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

-- Recreate with is_admin forced to false
CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
TO public
WITH CHECK (auth.uid() = user_id AND is_admin = false);

-- FIX 2: Restrict conversion_settings SELECT to admins only  
DROP POLICY IF EXISTS "Anyone can read conversion settings" ON public.conversion_settings;

CREATE POLICY "Admins can read conversion settings"
ON public.conversion_settings FOR SELECT
TO public
USING (is_admin(auth.uid()));