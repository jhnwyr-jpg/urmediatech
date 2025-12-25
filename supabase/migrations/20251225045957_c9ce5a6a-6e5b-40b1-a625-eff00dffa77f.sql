
-- Allow public read access for admin dashboard data (since we're using simple auth, not Supabase auth)
-- Note: In production, you should use proper Supabase authentication

-- Add permissive SELECT policy for orders
CREATE POLICY "Allow public read access for orders" 
ON public.orders 
FOR SELECT 
USING (true);

-- Add permissive SELECT policy for site_stats
CREATE POLICY "Allow public read access for site_stats" 
ON public.site_stats 
FOR SELECT 
USING (true);

-- Add permissive SELECT policy for profiles
CREATE POLICY "Allow public read access for profiles" 
ON public.profiles 
FOR SELECT 
USING (true);
