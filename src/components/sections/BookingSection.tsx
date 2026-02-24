import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Clock, User, Phone, Mail, CheckCircle2, ArrowRight, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { format, isBefore, startOfDay, addDays } from "date-fns";
import { cn } from "@/lib/utils";

const TIME_SLOTS = [
  "10:00 AM", "11:00 AM", "12:00 PM",
  "1:00 PM", "2:00 PM", "3:00 PM",
  "4:00 PM", "5:00 PM", "6:00 PM",
  "7:00 PM", "8:00 PM", "9:00 PM",
];

type BookingStep = "calendar" | "form";

const BookingSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { toast } = useToast();
  const { t } = useLanguage();

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [step, setStep] = useState<BookingStep>("calendar");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "", email: "" });

  const today = startOfDay(new Date());
  const maxDate = addDays(today, 30);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTime("");
  };

  const handleNext = () => {
    if (selectedDate && selectedTime) setStep("form");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime || !formData.name.trim() || !formData.phone.trim()) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("meetings").insert({
        visitor_name: formData.name.trim(),
        visitor_phone: formData.phone.trim(),
        visitor_email: formData.email.trim() || null,
        meeting_date: format(selectedDate, "yyyy-MM-dd"),
        meeting_time: selectedTime,
        service_type: "Discovery Call",
        status: "pending",
      });

      if (error) throw error;

      setIsSuccess(true);
      toast({
        title: t("booking.successTitle"),
        description: t("booking.successDesc"),
      });

      setTimeout(() => {
        setIsSuccess(false);
        setStep("calendar");
        setSelectedDate(undefined);
        setSelectedTime("");
        setFormData({ name: "", phone: "", email: "" });
      }, 4000);
    } catch (error) {
      console.error("Booking error:", error);
      toast({
        title: t("booking.errorTitle"),
        description: t("booking.errorDesc"),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedDayLabel = selectedDate
    ? format(selectedDate, "EEE, MMM d")
    : "";

  return (
    <section id="booking" ref={ref} className="py-24 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 gradient-bg opacity-5 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 left-0 w-64 h-64 gradient-bg opacity-10 blur-[80px] rounded-full" />

      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="text-sm font-medium text-primary uppercase tracking-wider">
            {t("booking.label")}
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mt-4 mb-4">
            {t("booking.title")}{" "}
            <span className="gradient-text">{t("booking.titleHighlight")}</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {t("booking.subtitle")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          {isSuccess ? (
            <div className="bg-card rounded-2xl border border-border/50 shadow-card p-12 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="w-20 h-20 rounded-full gradient-bg flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle2 className="w-10 h-10 text-primary-foreground" />
              </motion.div>
              <h3 className="text-2xl font-bold text-foreground mb-2">{t("booking.confirmedTitle")}</h3>
              <p className="text-muted-foreground mb-4">{t("booking.confirmedDesc")}</p>
              <div className="inline-flex items-center gap-2 bg-secondary rounded-xl px-4 py-2 text-sm font-medium text-foreground">
                <Clock className="w-4 h-4 text-primary" />
                {selectedDayLabel} — {selectedTime}
              </div>
            </div>
          ) : (
            <div className="bg-card rounded-2xl border border-border/50 shadow-card overflow-hidden">
              {/* Header info strip */}
              <div className="bg-secondary/50 border-b border-border/50 px-6 py-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{t("booking.callTitle")}</h3>
                  <p className="text-sm text-muted-foreground">30 {t("booking.minutes")} • Google Meet</p>
                </div>
              </div>

              {step === "calendar" ? (
                <div className="p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Calendar */}
                    <div>
                      <p className="text-sm font-medium text-foreground mb-3">{t("booking.selectDate")}</p>
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={handleDateSelect}
                        disabled={(date) =>
                          isBefore(date, today) ||
                          date > maxDate ||
                          date.getDay() === 5 // Friday off
                        }
                        className="p-3 pointer-events-auto rounded-xl border border-border/50"
                      />
                    </div>

                    {/* Time slots */}
                    <div>
                      <p className="text-sm font-medium text-foreground mb-3">
                        {selectedDate
                          ? `${selectedDayLabel} — ${t("booking.selectTime")}`
                          : t("booking.pickDateFirst")}
                      </p>
                      {selectedDate ? (
                        <div className="grid grid-cols-2 gap-2 max-h-[340px] overflow-y-auto pr-1">
                          {TIME_SLOTS.map((time) => (
                            <button
                              key={time}
                              onClick={() => setSelectedTime(time)}
                              className={cn(
                                "px-4 py-3 rounded-xl border text-sm font-medium transition-all",
                                selectedTime === time
                                  ? "gradient-bg text-primary-foreground border-transparent shadow-lg"
                                  : "border-border/50 text-foreground hover:border-primary/50 hover:bg-secondary/50"
                              )}
                            >
                              {time}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-[300px] text-muted-foreground text-sm">
                          {t("booking.pickDateFirst")}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Next button */}
                  <div className="mt-6 flex justify-end">
                    <Button
                      variant="gradient"
                      size="lg"
                      disabled={!selectedDate || !selectedTime}
                      onClick={handleNext}
                      className="group"
                    >
                      {t("booking.next")}
                      <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="p-6">
                  <button
                    onClick={() => setStep("calendar")}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    {t("booking.back")}
                  </button>

                  <div className="inline-flex items-center gap-2 bg-secondary rounded-xl px-4 py-2 text-sm font-medium text-foreground mb-6">
                    <Clock className="w-4 h-4 text-primary" />
                    {selectedDayLabel} — {selectedTime}
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        {t("booking.nameLabel")} *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          placeholder={t("booking.namePlaceholder")}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        {t("booking.phoneLabel")} *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          type="tel"
                          inputMode="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder={t("booking.phonePlaceholder")}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        {t("booking.emailLabel")}
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                          placeholder={t("booking.emailPlaceholder")}
                          className="pl-10"
                        />
                      </div>
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
                          {t("booking.submitting")}
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-5 h-5" />
                          {t("booking.confirm")}
                        </>
                      )}
                    </Button>
                  </form>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default BookingSection;
