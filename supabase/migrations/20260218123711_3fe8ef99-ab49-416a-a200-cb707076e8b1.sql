
-- 1. Fix chat_conversations: Remove overly permissive SELECT, keep admin + session-based
DROP POLICY IF EXISTS "Anyone can view own conversation" ON public.chat_conversations;
CREATE POLICY "Anyone can view own conversation by session"
ON public.chat_conversations FOR SELECT
USING (
  session_id = coalesce(
    current_setting('request.headers', true)::json->>'x-session-id',
    ''
  )
  OR is_admin(auth.uid())
);

-- 2. Fix chat_messages: Remove overly permissive SELECT
DROP POLICY IF EXISTS "Anyone can view messages" ON public.chat_messages;
CREATE POLICY "View messages in accessible conversations"
ON public.chat_messages FOR SELECT
USING (
  conversation_id IN (
    SELECT id FROM public.chat_conversations
    WHERE session_id = coalesce(
      current_setting('request.headers', true)::json->>'x-session-id',
      ''
    )
  )
  OR is_admin(auth.uid())
);

-- 3. Fix chat_messages: Restrict UPDATE to admins + specific columns
DROP POLICY IF EXISTS "Anyone can update message seen" ON public.chat_messages;
CREATE POLICY "Admins can update messages"
ON public.chat_messages FOR UPDATE
USING (is_admin(auth.uid()))
WITH CHECK (is_admin(auth.uid()));

-- 4. Fix chat_conversations: Restrict visitor typing update to own session
DROP POLICY IF EXISTS "Anyone can update visitor typing" ON public.chat_conversations;
CREATE POLICY "Visitors can update own conversation typing"
ON public.chat_conversations FOR UPDATE
USING (
  session_id = coalesce(
    current_setting('request.headers', true)::json->>'x-session-id',
    ''
  )
  OR is_admin(auth.uid())
)
WITH CHECK (
  session_id = coalesce(
    current_setting('request.headers', true)::json->>'x-session-id',
    ''
  )
  OR is_admin(auth.uid())
);
