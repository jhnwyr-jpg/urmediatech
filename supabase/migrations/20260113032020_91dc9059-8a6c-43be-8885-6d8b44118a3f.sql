-- Add status and amount columns to contact_submissions
ALTER TABLE public.contact_submissions
ADD COLUMN status text NOT NULL DEFAULT 'pending',
ADD COLUMN amount numeric DEFAULT 0;

-- Add constraint for valid status values
ALTER TABLE public.contact_submissions
ADD CONSTRAINT contact_status_check CHECK (status IN ('pending', 'running', 'success', 'cancelled'));

-- Create index for status filtering
CREATE INDEX idx_contact_submissions_status ON public.contact_submissions(status);

-- Allow admins to update contacts
CREATE POLICY "Admins can update contact submissions"
ON public.contact_submissions
FOR UPDATE
USING (is_admin(auth.uid()));