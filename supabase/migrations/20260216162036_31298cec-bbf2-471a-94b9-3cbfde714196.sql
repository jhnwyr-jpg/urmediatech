
-- Broadcast notifications table - no client_id needed
CREATE TABLE public.broadcast_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  url TEXT,
  image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.broadcast_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage broadcast notifications"
ON public.broadcast_notifications
FOR ALL
USING (is_admin(auth.uid()));

CREATE POLICY "Anyone can read active broadcast notifications"
ON public.broadcast_notifications
FOR SELECT
USING (is_active = true);
