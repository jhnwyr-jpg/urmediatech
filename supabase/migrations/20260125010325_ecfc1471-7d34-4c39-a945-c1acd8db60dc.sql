-- Add admin_seen flag to track when admin has seen the conversation
ALTER TABLE public.chat_conversations
ADD COLUMN IF NOT EXISTS admin_seen boolean DEFAULT false;