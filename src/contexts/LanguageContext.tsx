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
    "hero.badge": "প্রিমিয়াম ডিজাইন এজেন্সি",
    "hero.title1": "প্রিমিয়াম ওয়েবসাইট ডিজাইন",
    "hero.title2": "হয়ে গেল",
    "hero.title3": "সহজ",
    "hero.subtitle": "অসাধারণ কনভার্শন-কেন্দ্রিক ল্যান্ডিং পেজের মাধ্যমে আপনার ডিজিটাল উপস্থিতি রূপান্তর করুন যা আপনার দর্শকদের মুগ্ধ করে এবং ফলাফল নিয়ে আসে।",
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
    "features.title": "আলাদা হতে আপনার যা",
    "features.titleHighlight": "প্রয়োজন",
    "features.subtitle": "আপনার স্বপ্নকে বাস্তবে রূপ দিতে আমরা ব্যাপক ডিজাইন ও ডেভেলপমেন্ট সেবা প্রদান করি।",
    "features.uiux": "UI/UX ডিজাইন",
    "features.uiuxDesc": "সুন্দর, স্বজ্ঞাত ইন্টারফেস যা ব্যবহারকারীদের মুগ্ধ করে এবং এনগেজমেন্ট বাড়ায়।",
    "features.webdev": "ওয়েব ডেভেলপমেন্ট",
    "features.webdevDesc": "সর্বাধুনিক প্রযুক্তি দিয়ে তৈরি পরিষ্কার, পারফরম্যান্স কোড।",
    "features.landing": "ল্যান্ডিং পেজ",
    "features.landingDesc": "সর্বোচ্চ প্রভাবের জন্য অপ্টিমাইজড হাই-কনভার্টিং ল্যান্ডিং পেজ।",
    "features.brand": "ব্র্যান্ড আইডেন্টিটি",
    "features.brandDesc": "সমন্বিত ভিজ্যুয়াল আইডেন্টিটি যা আপনার ব্র্যান্ডকে স্মরণীয় করে।",
    "features.expertTitle": "বিশেষজ্ঞদের দ্বারা তৈরি",
    "features.expertDesc": "আমাদের ডিজাইনার ও ডেভেলপার টিম একসাথে কাজ করে অসাধারণ ডিজিটাল অভিজ্ঞতা তৈরি করে যা ফলাফল নিয়ে আসে।",
    "features.tryNow": "এখনই ট্রাই করুন →",
    
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
    "integrations.title1": "আপনার সাথে সংযুক্ত করুন",
    "integrations.title2": "মার্কেটিং ও সেলস",
    "integrations.title3": "টুলস",
    "integrations.subtitle": "আপনার ওয়ার্কফ্লো সুবিন্যস্ত করতে এবং দক্ষতা সর্বাধিক করতে আপনি ইতিমধ্যে যে টুলগুলি ব্যবহার করেন সেগুলির সাথে নির্বিঘ্নে ইন্টিগ্রেট করুন।",
    
    // Testimonials
    "testimonials.badge": "বিশ্বব্যাপী ব্যবসার দ্বারা বিশ্বস্ত",
    "testimonials.rating": "এর মধ্যে ৫ স্টার",
    "testimonials.reviews": "রিভিউ থেকে",
    "testimonials.join": "যোগ দিন",
    "testimonials.happyClients": "সন্তুষ্ট ক্লায়েন্টদের সাথে",
    "testimonials.plus": "এবং",
    "testimonials.you": "আপনি।",
    "testimonials.name1": "রাহাত হোসেন",
    "testimonials.role1": "মার্কেটিং ডিরেক্টর",
    "testimonials.content1": "ইউআর মিডিয়া আমাদের অনলাইন উপস্থিতি রূপান্তরিত করেছে। ডিজাইনগুলো অসাধারণ এবং কনভার্শন উল্লেখযোগ্যভাবে বেড়েছে।",
    "testimonials.name2": "তানভীর আহমেদ",
    "testimonials.role2": "স্টার্টআপ ফাউন্ডার",
    "testimonials.content2": "ইউআর মিডিয়ার সাথে কাজ করা ছিল গেম-চেঞ্জার। প্রফেশনাল, দ্রুত, এবং ফলাফল নিজেই বলে দেয়।",
    "testimonials.name3": "ফারহানা আক্তার",
    "testimonials.role3": "ই-কমার্স মালিক",
    "testimonials.content3": "আমাদের ব্র্যান্ডের জন্য সেরা বিনিয়োগ। বিস্তারিত মনোযোগ এবং সৃজনশীলতা আমাদের প্রত্যাশা ছাড়িয়ে গেছে।",
    
    // About
    "about.label": "আমাদের সম্পর্কে",
    "about.title": "কেন বেছে নেবেন",
    "about.titleHighlight": "ইউআর মিডিয়া",
    "about.desc1": "আমরা ডিজাইনার এবং ডেভেলপারদের একটি আবেগী দল যারা অসাধারণ ডিজিটাল অভিজ্ঞতা তৈরি করতে নিবেদিত। আমাদের ফোকাস হল সুন্দর, কার্যকর ওয়েবসাইট প্রদান করা যা ব্যবসা বৃদ্ধিতে সহায়তা করে।",
    "about.desc2": "বছরের অভিজ্ঞতা এবং উৎকর্ষতার প্রতি প্রতিশ্রুতি নিয়ে, আমরা ধারণাগুলিকে অসাধারণ ডিজিটাল বাস্তবতায় রূপান্তর করি। প্রতিটি প্রজেক্ট বিস্তারিত মনোযোগ এবং ফলাফলের উপর ফোকাস দিয়ে তৈরি করা হয়।",
    "about.feature1": "পিক্সেল-পারফেক্ট ডিজাইন",
    "about.feature2": "পরিষ্কার, রক্ষণাবেক্ষণযোগ্য কোড",
    "about.feature3": "SEO অপ্টিমাইজড",
    "about.feature4": "মোবাইল রেসপন্সিভ",
    "about.stat1": "প্রজেক্ট সম্পন্ন",
    "about.stat2": "সন্তুষ্ট ক্লায়েন্ট",
    "about.stat3": "অভিজ্ঞতা",
    "about.stat3Suffix": " বছর",
    "about.stat4": "ক্লায়েন্ট সন্তুষ্টি",
    
    // Contact
    "contact.label": "যোগাযোগ করুন",
    "contact.title": "চলুন কিছু",
    "contact.titleHighlight": "অসাধারণ",
    "contact.titleEnd": "তৈরি করি",
    "contact.subtitle": "আপনার ডিজিটাল উপস্থিতি রূপান্তর করতে প্রস্তুত? আমরা আপনার প্রজেক্ট সম্পর্কে শুনতে চাই। আমাদের মেসেজ করুন এবং একসাথে তৈরি করা শুরু করি।",
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
    "cta.title": "আপনার ডিজিটাল উপস্থিতি রূপান্তর করতে প্রস্তুত?",
    "cta.subtitle": "শত শত ব্যবসা তাদের ওয়েব ডিজাইনের জন্য ইউআর মিডিয়াকে বিশ্বাস করে। চলুন একসাথে অসাধারণ কিছু তৈরি করি।",
    "cta.button": "শুরু করুন",
    
    // Footer
    "footer.desc": "সুন্দর, উচ্চ-কর্মক্ষম ওয়েবসাইট তৈরি করি যা ব্যবসাকে ডিজিটাল বিশ্বে বাড়তে এবং সফল হতে সাহায়তা করে।",
    "footer.company": "কোম্পানি",
    "footer.services": "সেবাসমূহ",
    "footer.about": "আমাদের সম্পর্কে",
    "footer.projects": "প্রজেক্ট",
    "footer.webDesign": "ওয়েব ডিজাইন",
    "footer.development": "ডেভেলপমেন্ট",
    "footer.branding": "ব্র্যান্ডিং",
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
    "hero.badge": "Premium Design Agency",
    "hero.title1": "Premium Website Design",
    "hero.title2": "made",
    "hero.title3": "simple",
    "hero.subtitle": "Transform your digital presence with stunning conversion-focused landing pages that captivate your audience and drive results.",
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
    "features.title": "Everything You Need to",
    "features.titleHighlight": "Stand Out",
    "features.subtitle": "We offer comprehensive design and development services to bring your vision to life.",
    "features.uiux": "UI/UX Design",
    "features.uiuxDesc": "Beautiful, intuitive interfaces that delight users and drive engagement.",
    "features.webdev": "Web Development",
    "features.webdevDesc": "Clean, performant code built with the latest technologies.",
    "features.landing": "Landing Pages",
    "features.landingDesc": "High-converting landing pages optimized for maximum impact.",
    "features.brand": "Brand Identity",
    "features.brandDesc": "Cohesive visual identities that make your brand memorable.",
    "features.expertTitle": "Developed by experts",
    "features.expertDesc": "Our team of designers and developers work together to create exceptional digital experiences that drive results.",
    "features.tryNow": "Try Now →",
    
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
    "portfolio.masalaDesc": "Elegant restaurant website with menu showcase and online presence.",
    "portfolio.masalaCategory": "Business Website",
    "portfolio.khejur": "Khejur Gur",
    "portfolio.khejurDesc": "Khejur Gur landing page with elegant design and smooth user experience.",
    "portfolio.khejurCategory": "Landing Page",
    "portfolio.tshirt": "T-Shirt Store",
    "portfolio.tshirtDesc": "Stylish e-commerce landing page for fashion and apparel brand.",
    "portfolio.tshirtCategory": "E-commerce",
    
    // Integrations
    "integrations.title1": "Connect your",
    "integrations.title2": "marketing & sales",
    "integrations.title3": "stack",
    "integrations.subtitle": "Seamlessly integrate with the tools you already use to streamline your workflow and maximize efficiency.",
    
    // Testimonials
    "testimonials.badge": "Trusted by businesses worldwide",
    "testimonials.rating": "out of 5 stars from",
    "testimonials.reviews": "reviews",
    "testimonials.join": "Join",
    "testimonials.happyClients": "happy clients",
    "testimonials.plus": "plus",
    "testimonials.you": "you.",
    "testimonials.name1": "Rahat Hossain",
    "testimonials.role1": "Marketing Director",
    "testimonials.content1": "UR Media transformed our online presence. The designs are stunning and conversions have increased significantly.",
    "testimonials.name2": "Tanvir Ahmed",
    "testimonials.role2": "Startup Founder",
    "testimonials.content2": "Working with UR Media was a game-changer. Professional, fast, and the results speak for themselves.",
    "testimonials.name3": "Farhana Akter",
    "testimonials.role3": "E-commerce Owner",
    "testimonials.content3": "Best investment we made for our brand. The attention to detail and creativity exceeded our expectations.",
    
    // About
    "about.label": "About Us",
    "about.title": "Why Choose",
    "about.titleHighlight": "UR Media",
    "about.desc1": "We're a passionate team of designers and developers dedicated to creating exceptional digital experiences. Our focus is on delivering beautiful, functional websites that help businesses grow.",
    "about.desc2": "With years of experience and a commitment to excellence, we transform ideas into stunning digital realities. Every project is crafted with attention to detail and a focus on results.",
    "about.feature1": "Pixel-perfect designs",
    "about.feature2": "Clean, maintainable code",
    "about.feature3": "SEO optimized",
    "about.feature4": "Mobile responsive",
    "about.stat1": "Projects Completed",
    "about.stat2": "Happy Clients",
    "about.stat3": "Experience",
    "about.stat3Suffix": " Years",
    "about.stat4": "Client Satisfaction",
    
    // Contact
    "contact.label": "Get In Touch",
    "contact.title": "Let's Build Something",
    "contact.titleHighlight": "Amazing",
    "contact.titleEnd": "",
    "contact.subtitle": "Ready to transform your digital presence? We'd love to hear about your project. Drop us a message and let's start creating together.",
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
    "cta.title": "Ready to transform your digital presence?",
    "cta.subtitle": "Join hundreds of businesses that trust UR Media for their web design needs. Let's create something amazing together.",
    "cta.button": "Get Started",
    
    // Footer
    "footer.desc": "Creating beautiful, high-performance websites that help businesses grow and succeed in the digital world.",
    "footer.company": "Company",
    "footer.services": "Services",
    "footer.about": "About",
    "footer.projects": "Projects",
    "footer.webDesign": "Web Design",
    "footer.development": "Development",
    "footer.branding": "Branding",
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
