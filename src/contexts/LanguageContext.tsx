import { createContext, useContext, useState, ReactNode } from "react";

type Language = "bn" | "en";

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations = {
  bn: {
    // Navbar
    "nav.services": "সেবাসমূহ",
    "nav.projects": "প্রজেক্ট",
    "nav.about": "আমাদের সম্পর্কে",
    "nav.contact": "যোগাযোগ করুন",
    "nav.signin": "সাইন ইন",
    
    // Hero
    "hero.badge": "প্রফেশনাল ওয়েব ডেভেলপমেন্ট এজেন্সি",
    "hero.title1": "আপনার স্বপ্নের ওয়েবসাইট",
    "hero.title2": "বানাই",
    "hero.title3": "আমরা",
    "hero.subtitle": "ল্যান্ডিং পেজ, ই-কমার্স, বিজনেস ওয়েবসাইট থেকে শুরু করে কাস্টম ওয়েব অ্যাপ্লিকেশন - সব ধরনের ওয়েব সলিউশন আমরা তৈরি করি।",
    "hero.demo": "ডেমো দেখুন",
    "hero.contact": "যোগাযোগ করুন",
    "hero.projects": "প্রজেক্ট",
    "hero.satisfaction": "সন্তুষ্টি",
    "hero.rating": "রেটিং",
    "hero.dashboard": "ড্যাশবোর্ড ওভারভিউ",
    "hero.welcome": "স্বাগতম, অ্যাডমিন",
    "hero.last7days": "গত ৭ দিন",
    "hero.export": "এক্সপোর্ট",
    "hero.revenue": "আয়",
    "hero.visitors": "ভিজিটর",
    "hero.conversion": "কনভার্শন",
    "hero.analytics": "অ্যানালিটিক্স",
    "hero.recentActivity": "সাম্প্রতিক কার্যক্রম",
    "hero.activity1": "নতুন সাইনআপ",
    "hero.activity2": "পেমেন্ট প্রাপ্ত",
    "hero.activity3": "অর্ডার সম্পন্ন",
    "hero.activity4": "রিভিউ পোস্ট",
    
    // Features
    "features.label": "আমাদের সেবাসমূহ",
    "features.title": "সব ধরনের ওয়েব",
    "features.titleHighlight": "সলিউশন",
    "features.subtitle": "স্টার্টআপ থেকে এন্টারপ্রাইজ - আপনার বিজনেসের জন্য পারফেক্ট ওয়েব সলিউশন তৈরি করি।",
    "features.uiux": "UI/UX ডিজাইন",
    "features.uiuxDesc": "ইউজার-ফ্রেন্ডলি, আধুনিক ডিজাইন যা আপনার ব্র্যান্ডকে আলাদা করে তুলবে।",
    "features.webdev": "ফুল-স্ট্যাক ডেভেলপমেন্ট",
    "features.webdevDesc": "React, Next.js, Node.js সহ আধুনিক টেকনোলজি দিয়ে স্কেলেবল অ্যাপ তৈরি।",
    "features.landing": "ল্যান্ডিং পেজ",
    "features.landingDesc": "কনভার্শন অপ্টিমাইজড ল্যান্ডিং পেজ যা সেল বাড়াতে সাহায্য করে।",
    "features.brand": "ই-কমার্স সলিউশন",
    "features.brandDesc": "অনলাইন স্টোর, পেমেন্ট ইন্টিগ্রেশন সহ কমপ্লিট ই-কমার্স সেটআপ।",
    "features.expertTitle": "এক্সপার্ট ডেভেলপারদের টিম",
    "features.expertDesc": "আমাদের অভিজ্ঞ ডেভেলপার টিম আপনার আইডিয়াকে বাস্তবে রূপ দেয়। ক্লিন কোড, বেস্ট প্র্যাকটিস ফলো করে প্রফেশনাল ওয়েবসাইট ডেলিভার করি।",
    "features.tryNow": "শুরু করুন →",
    
    // Portfolio
    "portfolio.label": "আমাদের কাজ",
    "portfolio.title": "সাম্প্রতিক",
    "portfolio.titleHighlight": "প্রজেক্ট",
    "portfolio.subtitle": "আমাদের সাম্প্রতিক কাজ দেখুন। লাইভ ডেমো দেখতে যেকোনো প্রজেক্টে ক্লিক করুন।",
    "portfolio.viewDemo": "লাইভ ডেমো দেখুন",
    "portfolio.newTab": "নতুন ট্যাবে খুলবে",
    "portfolio.saas": "SaaS ড্যাশবোর্ড",
    "portfolio.saasDesc": "স্বজ্ঞাত ড্যাশবোর্ড এবং অ্যানালিটিক্স ফিচার সহ আধুনিক SaaS প্ল্যাটফর্ম।",
    "portfolio.saasCategory": "ওয়েব অ্যাপ্লিকেশন",
    "portfolio.masala": "মসলা রেস্টুরেন্ট",
    "portfolio.masalaDesc": "মেনু শোকেস এবং অনলাইন উপস্থিতি সহ মার্জিত রেস্টুরেন্ট ওয়েবসাইট।",
    "portfolio.masalaCategory": "ব্যবসায়িক ওয়েবসাইট",
    "portfolio.khejur": "খেজুর গুড়",
    "portfolio.khejurDesc": "মার্জিত ডিজাইন এবং মসৃণ ব্যবহারকারী অভিজ্ঞতা সহ খেজুর গুড় ল্যান্ডিং পেজ।",
    "portfolio.khejurCategory": "ল্যান্ডিং পেজ",
    "portfolio.tshirt": "টি-শার্ট স্টোর",
    "portfolio.tshirtDesc": "ফ্যাশন এবং পোশাক ব্র্যান্ডের জন্য স্টাইলিশ ই-কমার্স ল্যান্ডিং পেজ।",
    "portfolio.tshirtCategory": "ই-কমার্স",
    
    // Integrations
    "integrations.title1": "আপনার পছন্দের",
    "integrations.title2": "টেকনোলজি",
    "integrations.title3": "স্ট্যাক",
    "integrations.subtitle": "React, Next.js, Node.js, MongoDB, PostgreSQL - আধুনিক সব টেকনোলজি দিয়ে ওয়েবসাইট তৈরি করি।",
    
    // Testimonials
    "testimonials.badge": "ক্লায়েন্টদের মতামত",
    "testimonials.rating": "এর মধ্যে ৫ স্টার",
    "testimonials.reviews": "রিভিউ থেকে",
    "testimonials.join": "যোগ দিন",
    "testimonials.happyClients": "সন্তুষ্ট ক্লায়েন্টদের সাথে",
    "testimonials.plus": "এবং",
    "testimonials.you": "আপনি।",
    "testimonials.name1": "রাহাত হোসেন",
    "testimonials.role1": "ই-কমার্স উদ্যোক্তা",
    "testimonials.content1": "ইউআর মিডিয়া আমার অনলাইন স্টোর বানিয়ে দিয়েছে। সাইটটি ফাস্ট, সুন্দর এবং সেল অনেক বেড়েছে!",
    "testimonials.name2": "তানভীর আহমেদ",
    "testimonials.role2": "স্টার্টআপ ফাউন্ডার",
    "testimonials.content2": "ইউআর মিডিয়ার সাথে কাজ করা অসাধারণ অভিজ্ঞতা। আমার SaaS প্রোডাক্টের ল্যান্ডিং পেজ একদম পারফেক্ট হয়েছে।",
    "testimonials.name3": "ফারহানা আক্তার",
    "testimonials.role3": "রেস্টুরেন্ট মালিক",
    "testimonials.content3": "আমার রেস্টুরেন্টের জন্য বেস্ট ইনভেস্টমেন্ট। অনলাইন অর্ডার সিস্টেম সহ পুরো ওয়েবসাইট অসাধারণ হয়েছে।",
    
    // About
    "about.label": "আমাদের সম্পর্কে",
    "about.title": "কেন বেছে নেবেন",
    "about.titleHighlight": "ইউআর মিডিয়া",
    "about.desc1": "আমরা একটি প্রফেশনাল ওয়েব ডেভেলপমেন্ট এজেন্সি। ল্যান্ডিং পেজ, ই-কমার্স সাইট, বিজনেস ওয়েবসাইট থেকে শুরু করে কমপ্লেক্স ওয়েব অ্যাপ্লিকেশন - সব ধরনের প্রজেক্ট আমরা হ্যান্ডেল করি।",
    "about.desc2": "আমাদের ডেভেলপার টিম React, Next.js, Node.js সহ আধুনিক টেকনোলজি ব্যবহার করে স্কেলেবল, সিকিউর এবং ফাস্ট ওয়েবসাইট ডেলিভার করে। টাইমলি ডেলিভারি এবং কোয়ালিটি আমাদের প্রায়োরিটি।",
    "about.feature1": "মডার্ন টেকনোলজি স্ট্যাক",
    "about.feature2": "ক্লিন, মেইনটেইনেবল কোড",
    "about.feature3": "SEO এবং পারফরম্যান্স অপ্টিমাইজড",
    "about.feature4": "২৪/৭ সাপোর্ট",
    "about.stat1": "প্রজেক্ট ডেলিভার",
    "about.stat2": "সন্তুষ্ট ক্লায়েন্ট",
    "about.stat3": "অভিজ্ঞতা",
    "about.stat3Suffix": " বছর",
    "about.stat4": "ক্লায়েন্ট সন্তুষ্টি",
    
    // Contact
    "contact.label": "যোগাযোগ করুন",
    "contact.title": "আপনার প্রজেক্ট নিয়ে",
    "contact.titleHighlight": "আলোচনা",
    "contact.titleEnd": "করি",
    "contact.subtitle": "ল্যান্ডিং পেজ, ই-কমার্স বা কাস্টম ওয়েব অ্যাপ - যেকোনো প্রজেক্টের জন্য আমাদের সাথে যোগাযোগ করুন। ফ্রি কনসাল্টেশন পান।",
    "contact.emailLabel": "ইমেইল করুন",
    "contact.locationLabel": "অবস্থান",
    "contact.location": "ঢাকা, বাংলাদেশ",
    "contact.nameLabel": "আপনার নাম",
    "contact.namePlaceholder": "আপনার নাম লিখুন",
    "contact.emailFieldLabel": "ইমেইল ঠিকানা",
    "contact.emailPlaceholder": "আপনার ইমেইল লিখুন",
    "contact.messageLabel": "আপনার মেসেজ",
    "contact.messagePlaceholder": "আপনার প্রজেক্ট সম্পর্কে বলুন...",
    "contact.sending": "পাঠানো হচ্ছে...",
    "contact.sent": "মেসেজ পাঠানো হয়েছে!",
    "contact.send": "মেসেজ পাঠান",
    "contact.successTitle": "মেসেজ পাঠানো হয়েছে!",
    "contact.successDesc": "আমরা যত দ্রুত সম্ভব আপনার সাথে যোগাযোগ করব।",
    "contact.errorTitle": "ত্রুটি",
    "contact.errorDesc": "মেসেজ পাঠাতে ব্যর্থ। অনুগ্রহ করে আবার চেষ্টা করুন।",
    
    // CTA
    "cta.title": "আপনার ওয়েবসাইট বানাতে প্রস্তুত?",
    "cta.subtitle": "ফ্রি কনসাল্টেশন নিন। আমরা আপনার বাজেট এবং রিকোয়ারমেন্ট অনুযায়ী বেস্ট সলিউশন দিব।",
    "cta.button": "ফ্রি কনসাল্টেশন",
    
    // Showcase
    "showcase.pixelPerfect": "পিক্সেল-পারফেক্ট ডিজাইন",
    "showcase.everyDetail": "প্রতিটি বিস্তারিত গুরুত্বপূর্ণ",
    "showcase.justNow": "এইমাত্র",
    "showcase.2mAgo": "২ মিনিট আগে",
    "showcase.seeWorking": "রিয়েল টাইম অ্যানালিটিক্স",
    "showcase.optimize": "দিয়ে ট্র্যাক করুন",
    "showcase.seeWorkingDesc": "আমরা শুধু ওয়েবসাইট বানাই না, কমপ্লিট অ্যানালিটিক্স সেটআপ করে দিই যাতে আপনি জানতে পারেন কতজন ভিজিটর আসছে, কোথা থেকে আসছে।",
    "showcase.measureSuccess": "আপনার বিজনেস গ্রোথ ট্র্যাক করুন",
    "showcase.measureSuccessDesc": "Google Analytics, Facebook Pixel সহ সব ট্র্যাকিং টুল সেটআপ করে দিই। ডেটা দেখে সিদ্ধান্ত নিন।",
    "showcase.track1": "ভিজিটর এনগেজমেন্ট ট্র্যাক",
    "showcase.track2": "কনভার্শন রেট মনিটর",
    "showcase.track3": "সেলস ফানেল অ্যানালাইসিস",
    "showcase.performanceOverview": "পারফরম্যান্স ওভারভিউ",
    "showcase.conversionRate": "কনভার্শন রেট",
    "showcase.pageViews": "পেজ ভিউ",
    "showcase.intuitive": "ফাস্ট এবং",
    "showcase.userExperience": "রেসপন্সিভ",
    "showcase.intuitiveDesc": "মোবাইল থেকে ডেস্কটপ - সব ডিভাইসে পারফেক্টলি কাজ করে। Google PageSpeed স্কোর ৯০+ গ্যারান্টি।",
    
    // Footer
    "footer.desc": "প্রফেশনাল ওয়েব ডেভেলপমেন্ট এজেন্সি। ল্যান্ডিং পেজ, ই-কমার্স, বিজনেস ওয়েবসাইট - সব ধরনের ওয়েব সলিউশন।",
    "footer.company": "কোম্পানি",
    "footer.services": "সেবাসমূহ",
    "footer.about": "আমাদের সম্পর্কে",
    "footer.projects": "প্রজেক্ট",
    "footer.webDesign": "ওয়েব ডিজাইন",
    "footer.development": "ডেভেলপমেন্ট",
    "footer.branding": "ই-কমার্স",
    "footer.copyright": "© ২০২৬ ইউআর মিডিয়া। সর্বস্বত্ব সংরক্ষিত।",
    "footer.backToTop": "উপরে যান",
  },
  en: {
    // Navbar
    "nav.services": "Services",
    "nav.projects": "Projects",
    "nav.about": "About",
    "nav.contact": "Contact Us",
    "nav.signin": "Sign In",
    
    // Hero
    "hero.badge": "Professional Web Development Agency",
    "hero.title1": "We Build Your",
    "hero.title2": "Dream",
    "hero.title3": "Website",
    "hero.subtitle": "From landing pages and e-commerce to custom web applications - we deliver complete web solutions for your business.",
    "hero.demo": "View Demo",
    "hero.contact": "Contact Us",
    "hero.projects": "Projects",
    "hero.satisfaction": "Satisfaction",
    "hero.rating": "Rating",
    "hero.dashboard": "Dashboard Overview",
    "hero.welcome": "Welcome back, Admin",
    "hero.last7days": "Last 7 days",
    "hero.export": "Export",
    "hero.revenue": "Revenue",
    "hero.visitors": "Visitors",
    "hero.conversion": "Conversion",
    "hero.analytics": "Analytics",
    "hero.recentActivity": "Recent Activity",
    "hero.activity1": "New signup",
    "hero.activity2": "Payment received",
    "hero.activity3": "Order completed",
    "hero.activity4": "Review posted",
    
    // Features
    "features.label": "Our Services",
    "features.title": "Complete Web",
    "features.titleHighlight": "Solutions",
    "features.subtitle": "From startups to enterprise - we build the perfect web solution for your business needs.",
    "features.uiux": "UI/UX Design",
    "features.uiuxDesc": "User-friendly, modern designs that make your brand stand out from the competition.",
    "features.webdev": "Full-Stack Development",
    "features.webdevDesc": "Scalable applications built with React, Next.js, Node.js and modern technologies.",
    "features.landing": "Landing Pages",
    "features.landingDesc": "Conversion-optimized landing pages designed to boost your sales and leads.",
    "features.brand": "E-commerce Solutions",
    "features.brandDesc": "Complete online store setup with payment integration and inventory management.",
    "features.expertTitle": "Expert Developer Team",
    "features.expertDesc": "Our experienced developers bring your ideas to life. We deliver professional websites with clean code and best practices.",
    "features.tryNow": "Get Started →",
    
    // Portfolio
    "portfolio.label": "Our Work",
    "portfolio.title": "Recent",
    "portfolio.titleHighlight": "Projects",
    "portfolio.subtitle": "Explore our latest work. Click on any project to see the live demo in action.",
    "portfolio.viewDemo": "View Live Demo",
    "portfolio.newTab": "Opens in a new tab",
    "portfolio.saas": "SaaS Dashboard",
    "portfolio.saasDesc": "Modern SaaS platform with intuitive dashboard and analytics features.",
    "portfolio.saasCategory": "Web Application",
    "portfolio.masala": "Masala Restaurant",
    "portfolio.masalaDesc": "Elegant restaurant website with menu showcase and online ordering.",
    "portfolio.masalaCategory": "Business Website",
    "portfolio.khejur": "Khejur Gur",
    "portfolio.khejurDesc": "Beautiful product landing page with smooth animations and great UX.",
    "portfolio.khejurCategory": "Landing Page",
    "portfolio.tshirt": "T-Shirt Store",
    "portfolio.tshirtDesc": "Stylish e-commerce landing page for fashion and apparel brand.",
    "portfolio.tshirtCategory": "E-commerce",
    
    // Integrations
    "integrations.title1": "Built with",
    "integrations.title2": "Modern",
    "integrations.title3": "Technologies",
    "integrations.subtitle": "React, Next.js, Node.js, MongoDB, PostgreSQL - we use the latest tech stack to build your website.",
    
    // Testimonials
    "testimonials.badge": "Client Testimonials",
    "testimonials.rating": "out of 5 stars from",
    "testimonials.reviews": "reviews",
    "testimonials.join": "Join",
    "testimonials.happyClients": "happy clients",
    "testimonials.plus": "plus",
    "testimonials.you": "you.",
    "testimonials.name1": "Rahat Hossain",
    "testimonials.role1": "E-commerce Entrepreneur",
    "testimonials.content1": "UR Media built my online store perfectly. The site is fast, beautiful, and my sales have increased significantly!",
    "testimonials.name2": "Tanvir Ahmed",
    "testimonials.role2": "Startup Founder",
    "testimonials.content2": "Amazing experience working with UR Media. My SaaS product landing page came out absolutely perfect.",
    "testimonials.name3": "Farhana Akter",
    "testimonials.role3": "Restaurant Owner",
    "testimonials.content3": "Best investment for my restaurant. The website with online ordering system exceeded all my expectations.",
    
    // About
    "about.label": "About Us",
    "about.title": "Why Choose",
    "about.titleHighlight": "UR Media",
    "about.desc1": "We're a professional web development agency. From landing pages and e-commerce sites to complex web applications - we handle all types of projects with expertise.",
    "about.desc2": "Our developer team uses React, Next.js, Node.js and modern technologies to deliver scalable, secure, and fast websites. Timely delivery and quality are our top priorities.",
    "about.feature1": "Modern Technology Stack",
    "about.feature2": "Clean, Maintainable Code",
    "about.feature3": "SEO & Performance Optimized",
    "about.feature4": "24/7 Support",
    "about.stat1": "Projects Delivered",
    "about.stat2": "Happy Clients",
    "about.stat3": "Experience",
    "about.stat3Suffix": " Years",
    "about.stat4": "Client Satisfaction",
    
    // Contact
    "contact.label": "Get In Touch",
    "contact.title": "Let's Discuss Your",
    "contact.titleHighlight": "Project",
    "contact.titleEnd": "",
    "contact.subtitle": "Landing page, e-commerce, or custom web app - contact us for any project. Get a free consultation today.",
    "contact.emailLabel": "Email us at",
    "contact.locationLabel": "Based in",
    "contact.location": "Dhaka, Bangladesh",
    "contact.nameLabel": "Your Name",
    "contact.namePlaceholder": "Enter your name",
    "contact.emailFieldLabel": "Email Address",
    "contact.emailPlaceholder": "Enter your email",
    "contact.messageLabel": "Your Message",
    "contact.messagePlaceholder": "Tell us about your project...",
    "contact.sending": "Sending...",
    "contact.sent": "Message Sent!",
    "contact.send": "Send Message",
    "contact.successTitle": "Message sent!",
    "contact.successDesc": "We'll get back to you as soon as possible.",
    "contact.errorTitle": "Error",
    "contact.errorDesc": "Failed to send message. Please try again.",
    
    // CTA
    "cta.title": "Ready to build your website?",
    "cta.subtitle": "Get a free consultation. We'll provide the best solution based on your budget and requirements.",
    "cta.button": "Free Consultation",
    
    // Showcase
    "showcase.pixelPerfect": "Pixel-Perfect Designs",
    "showcase.everyDetail": "Every detail matters",
    "showcase.justNow": "Just now",
    "showcase.2mAgo": "2m ago",
    "showcase.seeWorking": "Track with real-time",
    "showcase.optimize": "analytics",
    "showcase.seeWorkingDesc": "We don't just build websites - we set up complete analytics so you know how many visitors you're getting and where they're coming from.",
    "showcase.measureSuccess": "Track your business growth",
    "showcase.measureSuccessDesc": "We set up Google Analytics, Facebook Pixel, and all tracking tools. Make data-driven decisions for your business.",
    "showcase.track1": "Track visitor engagement",
    "showcase.track2": "Monitor conversion rates",
    "showcase.track3": "Analyze sales funnel",
    "showcase.performanceOverview": "Performance Overview",
    "showcase.conversionRate": "Conversion Rate",
    "showcase.pageViews": "Page Views",
    "showcase.intuitive": "Fast and",
    "showcase.userExperience": "Responsive",
    "showcase.intuitiveDesc": "Mobile to desktop - works perfectly on all devices. Google PageSpeed score 90+ guaranteed.",
    
    // Footer
    "footer.desc": "Professional web development agency. Landing pages, e-commerce, business websites - complete web solutions for your business.",
    "footer.company": "Company",
    "footer.services": "Services",
    "footer.about": "About",
    "footer.projects": "Projects",
    "footer.webDesign": "Web Design",
    "footer.development": "Development",
    "footer.branding": "E-commerce",
    "footer.copyright": "© 2026 UR Media. All rights reserved.",
    "footer.backToTop": "Back to top",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>("bn");

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "bn" ? "en" : "bn"));
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.bn] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
