-- Tighten permissive RLS policies flagged by linter

-- contact_submissions: replace permissive insert policy
DROP POLICY IF EXISTS "Anyone can submit contact form" ON public.contact_submissions;
CREATE POLICY "Anyone can submit contact form"
ON public.contact_submissions
FOR INSERT
WITH CHECK (
  length(trim(name)) BETWEEN 1 AND 100
  AND length(trim(email)) BETWEEN 3 AND 255
  AND position('@' in email) > 1
  AND length(trim(message)) BETWEEN 1 AND 2000
  AND (phone IS NULL OR length(trim(phone)) <= 30)
);

-- meetings: replace permissive insert policy
DROP POLICY IF EXISTS "Anyone can create meetings" ON public.meetings;
CREATE POLICY "Anyone can create meetings"
ON public.meetings
FOR INSERT
WITH CHECK (
  length(trim(visitor_name)) BETWEEN 1 AND 100
  AND (visitor_email IS NULL OR (length(trim(visitor_email)) <= 255 AND position('@' in visitor_email) > 1))
  AND (visitor_phone IS NULL OR length(trim(visitor_phone)) <= 30)
  AND length(meeting_date::text) > 0
  AND length(meeting_time::text) > 0
);

-- chat_messages: replace permissive insert policy
DROP POLICY IF EXISTS "Anyone can create messages" ON public.chat_messages;
CREATE POLICY "Anyone can create messages"
ON public.chat_messages
FOR INSERT
WITH CHECK (
  role IN ('user','assistant')
  AND length(trim(content)) BETWEEN 1 AND 5000
);

-- chat_conversations: replace permissive insert policy and remove permissive update policy
DROP POLICY IF EXISTS "Anyone can create conversations" ON public.chat_conversations;
CREATE POLICY "Anyone can create conversations"
ON public.chat_conversations
FOR INSERT
WITH CHECK (
  length(trim(session_id)) BETWEEN 8 AND 200
);

DROP POLICY IF EXISTS "Anyone can update own conversation" ON public.chat_conversations;
CREATE POLICY "Admins can update conversations"
ON public.chat_conversations
FOR UPDATE
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));
