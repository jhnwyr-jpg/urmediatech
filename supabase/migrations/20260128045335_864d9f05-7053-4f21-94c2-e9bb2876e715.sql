-- Add expiry date column to notification_subscribers
ALTER TABLE public.notification_subscribers 
ADD COLUMN coupon_expires_at TIMESTAMP WITH TIME ZONE;