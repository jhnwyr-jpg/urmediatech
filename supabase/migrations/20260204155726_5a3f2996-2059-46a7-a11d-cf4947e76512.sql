-- Create marketing_scripts table for header/footer scripts
CREATE TABLE public.marketing_scripts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  script_name TEXT NOT NULL,
  script_type TEXT NOT NULL CHECK (script_type IN ('header', 'footer')),
  script_content TEXT NOT NULL,
  is_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Create conversion_settings table for Meta/Google API
CREATE TABLE public.conversion_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  platform TEXT NOT NULL UNIQUE CHECK (platform IN ('meta', 'google_ads', 'tiktok')),
  pixel_id TEXT,
  access_token TEXT,
  conversion_id TEXT,
  conversion_label TEXT,
  is_enabled BOOLEAN DEFAULT false,
  server_side_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create utm_visits table for tracking traffic sources
CREATE TABLE public.utm_visits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_term TEXT,
  utm_content TEXT,
  page_path TEXT,
  referrer TEXT,
  user_agent TEXT,
  ip_hash TEXT,
  session_id TEXT,
  converted BOOLEAN DEFAULT false,
  conversion_value NUMERIC(10,2),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create conversion_events table for tracking purchases/leads
CREATE TABLE public.conversion_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL CHECK (event_type IN ('PageView', 'Lead', 'Purchase', 'AddToCart', 'InitiateCheckout', 'Contact', 'ButtonClick')),
  event_value NUMERIC(10,2),
  currency TEXT DEFAULT 'BDT',
  content_name TEXT,
  content_ids TEXT[],
  utm_visit_id UUID REFERENCES public.utm_visits(id),
  metadata JSONB,
  sent_to_meta BOOLEAN DEFAULT false,
  sent_to_google BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.marketing_scripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversion_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.utm_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversion_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies for marketing_scripts (admin only for write, public for read)
CREATE POLICY "Anyone can read enabled scripts"
  ON public.marketing_scripts FOR SELECT
  USING (is_enabled = true);

CREATE POLICY "Admins can manage scripts"
  ON public.marketing_scripts FOR ALL
  USING (public.is_admin(auth.uid()));

-- RLS Policies for conversion_settings (admin only for write, public for read)
CREATE POLICY "Anyone can read conversion settings"
  ON public.conversion_settings FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage conversion settings"
  ON public.conversion_settings FOR ALL
  USING (public.is_admin(auth.uid()));

-- RLS Policies for utm_visits (anyone can insert, admins can read)
CREATE POLICY "Anyone can insert utm visits"
  ON public.utm_visits FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can read utm visits"
  ON public.utm_visits FOR SELECT
  USING (public.is_admin(auth.uid()));

-- RLS Policies for conversion_events
CREATE POLICY "Anyone can insert conversion events"
  ON public.conversion_events FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can read conversion events"
  ON public.conversion_events FOR SELECT
  USING (public.is_admin(auth.uid()));

-- Insert default conversion settings
INSERT INTO public.conversion_settings (platform, is_enabled)
VALUES 
  ('meta', false),
  ('google_ads', false),
  ('tiktok', false);

-- Create trigger for updated_at
CREATE TRIGGER update_marketing_scripts_updated_at
  BEFORE UPDATE ON public.marketing_scripts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_conversion_settings_updated_at
  BEFORE UPDATE ON public.conversion_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();