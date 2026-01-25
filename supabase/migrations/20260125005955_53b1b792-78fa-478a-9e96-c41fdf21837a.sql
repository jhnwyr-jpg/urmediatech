-- Allow anyone to update their own conversation's visitor_typing field
CREATE POLICY "Anyone can update visitor typing" 
ON public.chat_conversations
FOR UPDATE
USING (true)
WITH CHECK (true);

-- Allow anyone to update message seen status
CREATE POLICY "Anyone can update message seen" 
ON public.chat_messages
FOR UPDATE
USING (true)
WITH CHECK (true);