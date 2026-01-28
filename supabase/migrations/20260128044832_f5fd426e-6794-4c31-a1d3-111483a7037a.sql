-- Add coupon code column to notification_subscribers
ALTER TABLE public.notification_subscribers 
ADD COLUMN coupon_code TEXT,
ADD COLUMN coupon_used BOOLEAN DEFAULT false,
ADD COLUMN coupon_used_at TIMESTAMP WITH TIME ZONE;

-- Create index for fast coupon lookup
CREATE INDEX idx_subscribers_coupon ON public.notification_subscribers(coupon_code) WHERE coupon_code IS NOT NULL;