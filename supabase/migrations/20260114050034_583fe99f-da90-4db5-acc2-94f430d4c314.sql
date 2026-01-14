
-- Create services/packages table
CREATE TABLE public.services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  features JSONB DEFAULT '[]'::jsonb,
  price NUMERIC NOT NULL DEFAULT 0,
  delivery_days INTEGER DEFAULT 7,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create meetings/bookings table
CREATE TABLE public.meetings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  visitor_name TEXT NOT NULL,
  visitor_email TEXT,
  visitor_phone TEXT,
  project_name TEXT,
  service_type TEXT,
  requirements JSONB DEFAULT '{}'::jsonb,
  meeting_date DATE NOT NULL,
  meeting_time TIME NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create chat conversations table
CREATE TABLE public.chat_conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  visitor_info JSONB DEFAULT '{}'::jsonb,
  requirements JSONB DEFAULT '{}'::jsonb,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create chat messages table
CREATE TABLE public.chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID REFERENCES public.chat_conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Services policies (public read, admin manage)
CREATE POLICY "Anyone can read active services" ON public.services FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage services" ON public.services FOR ALL USING (is_admin(auth.uid()));

-- Meetings policies
CREATE POLICY "Anyone can create meetings" ON public.meetings FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view all meetings" ON public.meetings FOR SELECT USING (is_admin(auth.uid()));
CREATE POLICY "Admins can update meetings" ON public.meetings FOR UPDATE USING (is_admin(auth.uid()));
CREATE POLICY "Admins can delete meetings" ON public.meetings FOR DELETE USING (is_admin(auth.uid()));

-- Chat conversations policies
CREATE POLICY "Anyone can create conversations" ON public.chat_conversations FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can view own conversation" ON public.chat_conversations FOR SELECT USING (true);
CREATE POLICY "Anyone can update own conversation" ON public.chat_conversations FOR UPDATE USING (true);
CREATE POLICY "Admins can view all conversations" ON public.chat_conversations FOR SELECT USING (is_admin(auth.uid()));

-- Chat messages policies
CREATE POLICY "Anyone can create messages" ON public.chat_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can view messages" ON public.chat_messages FOR SELECT USING (true);
CREATE POLICY "Admins can view all messages" ON public.chat_messages FOR SELECT USING (is_admin(auth.uid()));

-- Insert default services
INSERT INTO public.services (name, category, description, features, price, delivery_days) VALUES
('Landing Page', 'landing-page', 'Professional single-page website with modern design', '["Responsive Design", "Contact Form", "SEO Optimized", "Fast Loading", "1 Revision"]', 150, 5),
('E-commerce Basic', 'ecommerce', 'Complete online store with payment integration', '["Up to 50 Products", "Payment Gateway", "Shopping Cart", "Order Management", "Mobile Responsive"]', 500, 14),
('E-commerce Pro', 'ecommerce', 'Advanced e-commerce with full features', '["Unlimited Products", "Multiple Payment Gateways", "Inventory Management", "Customer Dashboard", "Analytics"]', 1000, 21),
('Business Website', 'business', 'Corporate website with multiple pages', '["5-10 Pages", "About, Services, Contact", "Blog Section", "SEO Ready", "Admin Panel"]', 350, 10),
('Portfolio Website', 'portfolio', 'Showcase your work beautifully', '["Gallery/Portfolio Section", "About Page", "Contact Form", "Social Links", "Animations"]', 200, 7),
('Blog/News Site', 'blog', 'Content-focused website with CMS', '["Blog System", "Categories", "Search", "Comments", "Newsletter"]', 300, 10),
('Custom Web App', 'custom', 'Tailored web application for your needs', '["Custom Features", "Database Integration", "User Authentication", "API Development", "Ongoing Support"]', 1500, 30);

-- Trigger for updated_at
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_meetings_updated_at BEFORE UPDATE ON public.meetings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON public.chat_conversations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
