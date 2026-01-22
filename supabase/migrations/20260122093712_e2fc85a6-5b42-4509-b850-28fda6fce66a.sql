-- Add visitor name and phone columns to chat_conversations table
ALTER TABLE public.chat_conversations
ADD COLUMN IF NOT EXISTS visitor_name TEXT,
ADD COLUMN IF NOT EXISTS visitor_phone TEXT;

-- Enable realtime for chat_conversations and chat_messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_conversations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;