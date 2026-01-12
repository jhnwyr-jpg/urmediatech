-- Create tracking_pixels table for managing pixel configurations
CREATE TABLE public.tracking_pixels (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pixel_type TEXT NOT NULL DEFAULT 'facebook', -- facebook, google_analytics, tiktok, etc.
  pixel_id TEXT NOT NULL,
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  -- Page-wise controls
  enabled_on_home BOOLEAN NOT NULL DEFAULT true,
  enabled_on_product BOOLEAN NOT NULL DEFAULT true,
  enabled_on_contact BOOLEAN NOT NULL DEFAULT true,
  enabled_on_checkout BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Enable RLS
ALTER TABLE public.tracking_pixels ENABLE ROW LEVEL SECURITY;

-- Anyone can read pixels (needed for frontend injection)
CREATE POLICY "Anyone can read tracking pixels"
ON public.tracking_pixels
FOR SELECT
USING (true);

-- Only admins can insert pixels
CREATE POLICY "Admins can insert tracking pixels"
ON public.tracking_pixels
FOR INSERT
WITH CHECK (is_admin(auth.uid()));

-- Only admins can update pixels
CREATE POLICY "Admins can update tracking pixels"
ON public.tracking_pixels
FOR UPDATE
USING (is_admin(auth.uid()));

-- Only admins can delete pixels
CREATE POLICY "Admins can delete tracking pixels"
ON public.tracking_pixels
FOR DELETE
USING (is_admin(auth.uid()));

-- Add trigger for updated_at
CREATE TRIGGER update_tracking_pixels_updated_at
BEFORE UPDATE ON public.tracking_pixels
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();