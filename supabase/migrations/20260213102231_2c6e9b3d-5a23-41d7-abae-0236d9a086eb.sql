
-- Create pricing_plans table
CREATE TABLE public.pricing_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  plan_key TEXT NOT NULL UNIQUE,
  name_bn TEXT NOT NULL,
  name_en TEXT NOT NULL,
  price TEXT NOT NULL,
  period_bn TEXT NOT NULL DEFAULT 'ওয়ান-টাইম',
  period_en TEXT NOT NULL DEFAULT 'one-time',
  icon TEXT NOT NULL DEFAULT 'Zap',
  is_featured BOOLEAN NOT NULL DEFAULT false,
  sort_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create pricing_features table
CREATE TABLE public.pricing_features (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  plan_id UUID NOT NULL REFERENCES public.pricing_plans(id) ON DELETE CASCADE,
  text_bn TEXT NOT NULL,
  text_en TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'Check',
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.pricing_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_features ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Anyone can read active pricing plans" ON public.pricing_plans FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can read pricing features" ON public.pricing_features FOR SELECT USING (true);

-- Admin write access
CREATE POLICY "Admins can manage pricing plans" ON public.pricing_plans FOR ALL USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can manage pricing features" ON public.pricing_features FOR ALL USING (public.is_admin(auth.uid()));

-- Trigger for updated_at
CREATE TRIGGER update_pricing_plans_updated_at BEFORE UPDATE ON public.pricing_plans FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed initial data
INSERT INTO public.pricing_plans (plan_key, name_bn, name_en, price, period_bn, period_en, icon, is_featured, sort_order) VALUES
  ('starter', 'স্টার্টার প্যাকেজ', 'Starter Package', '১,৯৯৯', 'ওয়ান-টাইম', 'one-time', 'Zap', false, 0),
  ('premium', 'প্রিমিয়াম প্যাকেজ', 'Premium Package', '৩,৯৯৯', 'ওয়ান-টাইম', 'one-time', 'Crown', false, 1),
  ('business', 'বিজনেস প্যাকেজ', 'Business Package', '৪,৯৯৯', 'ওয়ান-টাইম', 'one-time', 'Sparkles', true, 2);

-- Seed starter features
INSERT INTO public.pricing_features (plan_id, text_bn, text_en, icon, sort_order) 
SELECT id, 'ফ্রি .shop ডোমেইন', 'Free .shop Domain', 'Globe', 0 FROM public.pricing_plans WHERE plan_key = 'starter'
UNION ALL SELECT id, 'ফ্রি হোস্টিং', 'Free Hosting', 'Server', 1 FROM public.pricing_plans WHERE plan_key = 'starter'
UNION ALL SELECT id, 'Next.js দিয়ে ফুল কোডেড ওয়েবসাইট', 'Full Coded Website with Next.js', 'Code', 2 FROM public.pricing_plans WHERE plan_key = 'starter'
UNION ALL SELECT id, 'ফুল ফাংশনাল অ্যাডমিন প্যানেল', 'Full Functional Admin Panel', 'Shield', 3 FROM public.pricing_plans WHERE plan_key = 'starter';

-- Seed premium features
INSERT INTO public.pricing_features (plan_id, text_bn, text_en, icon, sort_order)
SELECT id, 'ফ্রি .com ডোমেইন', 'Free .com Domain', 'Globe', 0 FROM public.pricing_plans WHERE plan_key = 'premium'
UNION ALL SELECT id, 'ফ্রি প্রিমিয়াম হোস্টিং', 'Free Premium Hosting', 'Server', 1 FROM public.pricing_plans WHERE plan_key = 'premium'
UNION ALL SELECT id, 'Next.js দিয়ে ফুল কোডেড ওয়েবসাইট', 'Full Coded Website with Next.js', 'Code', 2 FROM public.pricing_plans WHERE plan_key = 'premium'
UNION ALL SELECT id, 'ফুল ফাংশনাল অ্যাডমিন প্যানেল', 'Full Functional Admin Panel', 'Shield', 3 FROM public.pricing_plans WHERE plan_key = 'premium'
UNION ALL SELECT id, '২৪ ঘণ্টা প্রাইওরিটি সাপোর্ট', '24/7 Priority Support', 'Headphones', 4 FROM public.pricing_plans WHERE plan_key = 'premium'
UNION ALL SELECT id, 'SEO বেসিক সেটআপ', 'Basic SEO Setup', 'Palette', 5 FROM public.pricing_plans WHERE plan_key = 'premium';

-- Seed business features
INSERT INTO public.pricing_features (plan_id, text_bn, text_en, icon, sort_order)
SELECT id, 'প্রিমিয়াম কাস্টম ডিজাইন (ইউনিক লুক)', 'Premium Custom Design (Unique Look)', 'Palette', 0 FROM public.pricing_plans WHERE plan_key = 'business'
UNION ALL SELECT id, 'ওয়েবসাইট স্পিড অপ্টিমাইজেশন', 'Website Speed Optimization', 'Zap', 1 FROM public.pricing_plans WHERE plan_key = 'business'
UNION ALL SELECT id, 'অ্যাডভান্স SEO সেটআপ', 'Advanced SEO Setup', 'Globe', 2 FROM public.pricing_plans WHERE plan_key = 'business'
UNION ALL SELECT id, '২৪/৭ প্রাইওরিটি সাপোর্ট', '24/7 Priority Support', 'Headphones', 3 FROM public.pricing_plans WHERE plan_key = 'business'
UNION ALL SELECT id, 'আনলিমিটেড রিভিশন', 'Unlimited Revisions', 'Code', 4 FROM public.pricing_plans WHERE plan_key = 'business'
UNION ALL SELECT id, 'মাসিক ফ্রি মেইনটেন্যান্স', 'Monthly Free Maintenance', 'Shield', 5 FROM public.pricing_plans WHERE plan_key = 'business'
UNION ALL SELECT id, 'সিকিউরিটি + ব্যাকআপ সিস্টেম', 'Security + Backup System', 'Shield', 6 FROM public.pricing_plans WHERE plan_key = 'business'
UNION ALL SELECT id, 'অতিরিক্ত পেজ / ল্যান্ডিং পেজ', 'Additional Pages / Landing Pages', 'Globe', 7 FROM public.pricing_plans WHERE plan_key = 'business'
UNION ALL SELECT id, 'পেমেন্ট গেটওয়ে / অটোমেশন সেটআপ', 'Payment Gateway / Automation Setup', 'Server', 8 FROM public.pricing_plans WHERE plan_key = 'business'
UNION ALL SELECT id, 'প্রিমিয়াম হোস্টিং সাজেশন / সেটআপ', 'Premium Hosting Suggestion / Setup', 'Crown', 9 FROM public.pricing_plans WHERE plan_key = 'business';
