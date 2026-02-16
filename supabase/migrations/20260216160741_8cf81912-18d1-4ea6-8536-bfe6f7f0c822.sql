
-- Create client_notifications table
CREATE TABLE public.client_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.client_notifications ENABLE ROW LEVEL SECURITY;

-- Admins can do everything
CREATE POLICY "Admins can manage all notifications"
ON public.client_notifications
FOR ALL
USING (is_admin(auth.uid()));

-- Clients can only read their own notifications (matched by client_id = user_id text)
CREATE POLICY "Clients can view their own notifications"
ON public.client_notifications
FOR SELECT
USING (client_id = auth.uid()::text);

-- Clients can update is_read on their own notifications
CREATE POLICY "Clients can mark own notifications as read"
ON public.client_notifications
FOR UPDATE
USING (client_id = auth.uid()::text)
WITH CHECK (client_id = auth.uid()::text);

-- Enable realtime for this table
ALTER PUBLICATION supabase_realtime ADD TABLE public.client_notifications;
