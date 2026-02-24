import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";
import { Send, CheckCircle2, AlertCircle, Phone, CalendarDays, Clock, Pencil, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { useLanguage } from "@/contexts/LanguageContext";
import { format, isBefore, startOfDay, addDays } from "date-fns";
import { cn } from "@/lib/utils";

const TIME_SLOTS = [
  "10:00 AM", "11:00 AM", "12:00 PM",
  "1:00 PM", "2:00 PM", "3:00 PM",
  "4:00 PM", "5:00 PM", "6:00 PM",
  "7:00 PM", "8:00 PM", "9:00 PM",
];

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().trim().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  phone: z.string().trim().max(30, "Phone must be less than 30 characters").optional().or(z.literal("")),
  message: z.string().trim().min(1, "Message is required").max(1000, "Message must be less than 1000 characters"),
});

const ContactSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { toast } = useToast();
  const { t, language } = useLanguage();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [errors, setErrors] = useState<{ name?: string; email?: string; phone?: string; message?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>("");

  const today = startOfDay(new Date());
  const maxDate = addDays(today, 30);
  
  const [contactInfo, setContactInfo] = useState({
    email: "contact@urmedia.tech",
    whatsapp: "+8801609252155",
    location: "Dhaka, Bangladesh",
  });

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const { data } = await supabase
          .from("site_settings")
          .select("key, value")
          .in("key", ["contact_email", "whatsapp_number", "location_en", "location_bn"]);

        if (data && data.length > 0) {
          const settings: Record<string, string> = {};
          data.forEach((item) => {
            if (item.value) settings[item.key] = item.value;
          });
          
          setContactInfo({
            email: settings.contact_email || "contact@urmedia.tech",
            whatsapp: settings.whatsapp_number || "+8801609252155",
            location: language === "bn" 
              ? (settings.location_bn || "ঢাকা, বাংলাদেশ")
              : (settings.location_en || "Dhaka, Bangladesh"),
          });
        }
      } catch (error) {
        console.error("Error fetching contact info:", error);
      }
    };

    fetchContactInfo();
  }, [language]);

  // Auto-save draft when user leaves without submitting
  const saveDraft = useCallback(async () => {
    const { name, email, phone } = formData;
    if ((!name.trim() && !email.trim() && !phone.trim()) || draftSaved) return;
    
    try {
      await supabase.from("contact_submissions").insert({
        name: name.trim() || "Draft - No Name",
        email: email.trim() || "draft@no-email.com",
        phone: phone.trim() || null,
        message: formData.message.trim() || "(ফর্ম পূরণ করেছেন কিন্তু সাবমিট করেননি)",
        status: "draft",
      });
      setDraftSaved(true);
    } catch (e) {
      console.error("Draft save error:", e);
    }
  }, [formData, draftSaved]);

  useEffect(() => {
    const handleBeforeUnload = () => { saveDraft(); };
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") saveDraft();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [saveDraft]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setDraftSaved(false);
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    const result = contactSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: typeof errors = {};
      result.error.errors.forEach(err => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as keyof typeof errors] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { error: dbError } = await supabase
        .from("contact_submissions")
        .insert({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim() || null,
          message: formData.message.trim(),
        });

      if (dbError) console.error("DB Error:", dbError);

      // If meeting date selected, also create a meeting
      if (selectedDate && selectedTime) {
        await supabase.from("meetings").insert({
          visitor_name: formData.name.trim(),
          visitor_phone: formData.phone.trim() || null,
          visitor_email: formData.email.trim() || null,
          meeting_date: format(selectedDate, "yyyy-MM-dd"),
          meeting_time: selectedTime,
          service_type: "Discovery Call",
          status: "pending",
        });
      }

      await supabase.functions.invoke("contact-to-sheets", {
        body: {
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          message: formData.message.trim(),
        },
      });

      setIsSuccess(true);
      setDraftSaved(true);
      setFormData({ name: "", email: "", phone: "", message: "" });
      setSelectedDate(undefined);
      setSelectedTime("");
      setShowCalendar(false);
      
      toast({
        title: t("contact.successTitle"),
        description: t("contact.successDesc"),
      });
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: t("contact.errorTitle"),
        description: t("contact.errorDesc"),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setIsSuccess(false), 3000);
    }
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-72 h-72 gradient-bg opacity-10 blur-[100px] rounded-full" />
      <div className="absolute top-1/4 right-0 w-48 h-48 gradient-bg opacity-10 blur-[80px] rounded-full" />
      
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left - Content */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-sm font-medium text-primary uppercase tracking-wider">
              {t("contact.label")}
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mt-4 mb-6">
              {t("contact.title")}{" "}
              <span className="gradient-text">{t("contact.titleHighlight")}</span> {t("contact.titleEnd")}
            </h2>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              {t("contact.subtitle")}
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                  <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t("contact.emailLabel")}</p>
                  <p className="font-medium text-foreground">{contactInfo.email}</p>
                </div>
              </div>
              
              <a 
                href={`https://wa.me/${contactInfo.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-4 hover:bg-secondary/50 p-2 -ml-2 rounded-xl transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-[#25D366]/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-[#25D366]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">WhatsApp</p>
                  <p className="font-medium text-foreground">{contactInfo.whatsapp}</p>
                </div>
              </a>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                  <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t("contact.locationLabel")}</p>
                  <p className="font-medium text-foreground">{contactInfo.location}</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right - Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-card rounded-2xl p-8 border border-border/50 shadow-card"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                  {t("contact.nameLabel")}
                </label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={t("contact.namePlaceholder")}
                  className={errors.name ? "border-destructive" : ""}
                />
                {errors.name && (
                  <p className="text-destructive text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" /> {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                  {t("contact.emailFieldLabel")}
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={t("contact.emailPlaceholder")}
                  className={errors.email ? "border-destructive" : ""}
                />
                {errors.email && (
                  <p className="text-destructive text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" /> {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                  {t("contact.phoneLabel")}
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder={t("contact.phonePlaceholder")}
                    className={`pl-10 ${errors.phone ? "border-destructive" : ""}`}
                  />
                </div>
                {errors.phone && (
                  <p className="text-destructive text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" /> {errors.phone}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                  {t("contact.messageLabel")}
                </label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder={t("contact.messagePlaceholder")}
                  rows={5}
                  className={errors.message ? "border-destructive" : ""}
                />
                {errors.message && (
                  <p className="text-destructive text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" /> {errors.message}
                  </p>
                )}
              </div>

              {/* Meeting Date Picker */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {language === "bn" ? "মিটিং তারিখ (ঐচ্ছিক)" : "Meeting Date (Optional)"}
                </label>

                {!selectedDate || showCalendar ? (
                  !showCalendar ? (
                    <button
                      type="button"
                      onClick={() => setShowCalendar(true)}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border border-border/50 text-muted-foreground hover:border-primary/50 hover:bg-secondary/30 transition-all text-sm"
                    >
                      <CalendarDays className="w-4 h-4" />
                      {language === "bn" ? "মিটিংয়ের তারিখ নির্বাচন করুন" : "Select a meeting date"}
                    </button>
                  ) : (
                    <AnimatePresence>
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border border-border/50 rounded-xl overflow-hidden"
                      >
                        <div className="flex items-center justify-between bg-secondary/50 px-4 py-2 border-b border-border/50">
                          <span className="text-sm font-medium text-foreground flex items-center gap-2">
                            <CalendarDays className="w-4 h-4 text-primary" />
                            {language === "bn" ? "তারিখ ও সময় সিলেক্ট করুন" : "Select date & time"}
                          </span>
                          <button type="button" onClick={() => { setShowCalendar(false); setSelectedDate(undefined); setSelectedTime(""); }} className="text-muted-foreground hover:text-foreground">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="p-4 space-y-4">
                          <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={(date) => { setSelectedDate(date); setSelectedTime(""); }}
                            disabled={(date) => isBefore(date, today) || date > maxDate || date.getDay() === 5}
                            className="p-3 pointer-events-auto rounded-xl border border-border/50 mx-auto"
                          />
                          {selectedDate && (
                            <div>
                              <p className="text-sm font-medium text-foreground mb-2">
                                {format(selectedDate, "EEE, MMM d")} — {language === "bn" ? "সময় সিলেক্ট করুন" : "Select time"}
                              </p>
                              <div className="grid grid-cols-3 gap-2">
                                {TIME_SLOTS.map((time) => (
                                  <button
                                    key={time}
                                    type="button"
                                    onClick={() => { setSelectedTime(time); setShowCalendar(false); }}
                                    className={cn(
                                      "px-3 py-2 rounded-lg border text-xs font-medium transition-all",
                                      selectedTime === time
                                        ? "gradient-bg text-primary-foreground border-transparent"
                                        : "border-border/50 text-foreground hover:border-primary/50 hover:bg-secondary/50"
                                    )}
                                  >
                                    {time}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  )
                ) : (
                  <div className="flex items-center justify-between bg-secondary/50 border border-border/50 rounded-lg px-4 py-3">
                    <div className="flex items-center gap-3 text-sm">
                      <Clock className="w-4 h-4 text-primary" />
                      <span className="font-medium text-foreground">
                        {format(selectedDate, "EEE, MMM d")} — {selectedTime}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowCalendar(true)}
                      className="text-primary hover:text-primary/80 text-sm font-medium flex items-center gap-1"
                    >
                      <Pencil className="w-3 h-3" />
                      {language === "bn" ? "এডিট" : "Edit"}
                    </button>
                  </div>
                )}
              </div>

              <Button
                type="submit"
                variant="gradient"
                size="lg"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                    />
                    {t("contact.sending")}
                  </>
                ) : isSuccess ? (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    {t("contact.sent")}
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    {t("contact.send")}
                  </>
                )}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
