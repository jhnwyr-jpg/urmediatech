import { motion } from "framer-motion";
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle2, ArrowRight } from "lucide-react";
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

interface BookingCalendarProps {
  visitorName: string;
  visitorEmail: string;
  visitorPhone: string;
  onBooked?: () => void;
}

const BookingCalendar = ({ visitorName, visitorEmail, visitorPhone, onBooked }: BookingCalendarProps) => {
  const { toast } = useToast();
  const { t } = useLanguage();

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBooked, setIsBooked] = useState(false);

  const today = startOfDay(new Date());
  const maxDate = addDays(today, 30);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTime("");
  };

  const handleBook = async () => {
    if (!selectedDate || !selectedTime) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("meetings").insert({
        visitor_name: visitorName,
        visitor_phone: visitorPhone || null,
        visitor_email: visitorEmail || null,
        meeting_date: format(selectedDate, "yyyy-MM-dd"),
        meeting_time: selectedTime,
        service_type: "Discovery Call",
        status: "pending",
      });

      if (error) throw error;

      setIsBooked(true);
      toast({
        title: t("booking.successTitle"),
        description: t("booking.successDesc"),
      });
      onBooked?.();
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

  const selectedDayLabel = selectedDate ? format(selectedDate, "EEE, MMM d") : "";

  if (isBooked) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card rounded-2xl border border-border/50 shadow-card p-10 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="w-16 h-16 rounded-full gradient-bg flex items-center justify-center mx-auto mb-5"
        >
          <CheckCircle2 className="w-8 h-8 text-primary-foreground" />
        </motion.div>
        <h3 className="text-xl font-bold text-foreground mb-2">{t("booking.confirmedTitle")}</h3>
        <p className="text-muted-foreground mb-4">{t("booking.confirmedDesc")}</p>
        <div className="inline-flex items-center gap-2 bg-secondary rounded-xl px-4 py-2 text-sm font-medium text-foreground">
          <Clock className="w-4 h-4 text-primary" />
          {selectedDayLabel} — {selectedTime}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-card rounded-2xl border border-border/50 shadow-card overflow-hidden"
    >
      {/* Header */}
      <div className="bg-secondary/50 border-b border-border/50 px-6 py-4 flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
          <Clock className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">{t("booking.callTitle")}</h3>
          <p className="text-sm text-muted-foreground">30 {t("booking.minutes")} • Google Meet</p>
        </div>
      </div>

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
                date.getDay() === 5
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

        {/* Book button */}
        <div className="mt-6 flex justify-end">
          <Button
            variant="gradient"
            size="lg"
            disabled={!selectedDate || !selectedTime || isSubmitting}
            onClick={handleBook}
            className="group"
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
                {t("booking.confirm")}
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default BookingCalendar;
