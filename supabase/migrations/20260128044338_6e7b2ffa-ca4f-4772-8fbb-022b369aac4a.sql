-- Create table to store notification subscribers with their contact info
CREATE TABLE public.notification_subscribers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT,
  phone TEXT,
  name TEXT,
  onesignal_player_id TEXT,
  device_info JSONB DEFAULT '{}'::jsonb,
  subscribed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.notification_subscribers ENABLE ROW LEVEL SECURITY;

-- Anyone can insert (with basic validation)
CREATE POLICY "Anyone can subscribe" 
ON public.notification_subscribers 
FOR INSERT 
WITH CHECK (
  (email IS NULL OR (length(trim(email)) >= 3 AND length(trim(email)) <= 255 AND position('@' in email) > 1))
  AND (phone IS NULL OR length(trim(phone)) <= 30)
);

-- Admins can view all subscribers
CREATE POLICY "Admins can view subscribers" 
ON public.notification_subscribers 
FOR SELECT 
USING (is_admin(auth.uid()));

-- Admins can update subscribers
CREATE POLICY "Admins can update subscribers" 
ON public.notification_subscribers 
FOR UPDATE 
USING (is_admin(auth.uid()));

-- Admins can delete subscribers
CREATE POLICY "Admins can delete subscribers" 
ON public.notification_subscribers 
FOR DELETE 
USING (is_admin(auth.uid()));

-- Create index for faster lookups
CREATE INDEX idx_subscribers_email ON public.notification_subscribers(email) WHERE email IS NOT NULL;
CREATE INDEX idx_subscribers_phone ON public.notification_subscribers(phone) WHERE phone IS NOT NULL;
CREATE INDEX idx_subscribers_active ON public.notification_subscribers(is_active) WHERE is_active = true;