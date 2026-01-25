-- Add is_typing and last_seen columns to chat_conversations for typing indicator and seen status
ALTER TABLE public.chat_conversations
ADD COLUMN IF NOT EXISTS visitor_typing boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS admin_typing boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS last_seen_by_visitor timestamptz,
ADD COLUMN IF NOT EXISTS last_seen_by_admin timestamptz;

-- Add is_seen column to chat_messages for individual message seen status
ALTER TABLE public.chat_messages
ADD COLUMN IF NOT EXISTS is_seen boolean DEFAULT false;