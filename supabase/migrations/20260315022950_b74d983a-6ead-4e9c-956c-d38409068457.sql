-- Remove unnecessary public read access from site_stats
DROP POLICY IF EXISTS "Allow public read access for site_stats" ON public.site_stats;