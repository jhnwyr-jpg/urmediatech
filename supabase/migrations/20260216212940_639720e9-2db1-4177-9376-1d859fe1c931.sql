
-- Table to store which features are enabled/disabled for each client
CREATE TABLE public.client_feature_controls (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL,
  feature_key text NOT NULL,
  feature_name text NOT NULL,
  is_enabled boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(client_id, feature_key)
);

ALTER TABLE public.client_feature_controls ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage all feature controls"
ON public.client_feature_controls
FOR ALL
USING (is_admin(auth.uid()));

CREATE POLICY "Clients can view their own feature controls"
ON public.client_feature_controls
FOR SELECT
USING (client_id::text = auth.uid()::text);

-- Trigger for updated_at
CREATE TRIGGER update_client_feature_controls_updated_at
BEFORE UPDATE ON public.client_feature_controls
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
