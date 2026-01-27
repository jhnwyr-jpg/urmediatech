-- Remove the dangerous public read access policy from orders table
DROP POLICY IF EXISTS "Allow public read access for orders" ON public.orders;