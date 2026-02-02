import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Mail, Phone, MapPin, Save, Loader2 } from "lucide-react";

const ContactInfoSettings = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    contact_email: "contact@urmedia.tech",
    whatsapp_number: "+8801609252155",
    location_en: "Dhaka, Bangladesh",
    location_bn: "ঢাকা, বাংলাদেশ",
  });

  useEffect(() => {
    fetchContactInfo();
  }, []);

  const fetchContactInfo = async () => {
    try {
      const { data, error } = await supabase
        .from("site_settings")
        .select("key, value")
        .in("key", ["contact_email", "whatsapp_number", "location_en", "location_bn"]);

      if (error) throw error;

      if (data && data.length > 0) {
        const settings: Record<string, string> = {};
        data.forEach((item) => {
          if (item.value) settings[item.key] = item.value;
        });
        setFormData((prev) => ({ ...prev, ...settings }));
      }
    } catch (error) {
      console.error("Error fetching contact info:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updates = Object.entries(formData).map(([key, value]) => ({
        key,
        value,
        updated_at: new Date().toISOString(),
      }));

      for (const update of updates) {
        const { error } = await supabase
          .from("site_settings")
          .upsert(update, { onConflict: "key" });

        if (error) throw error;
      }

      toast({
        title: "সফল!",
        description: "Contact information আপডেট হয়েছে।",
      });
    } catch (error) {
      console.error("Error saving contact info:", error);
      toast({
        title: "Error",
        description: "Contact information save করতে সমস্যা হয়েছে।",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Phone className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Contact Information</h3>
          <p className="text-sm text-muted-foreground">ওয়েবসাইটের contact section এর তথ্য পরিবর্তন করুন</p>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="contact_email" className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Email Address
          </Label>
          <Input
            id="contact_email"
            name="contact_email"
            value={formData.contact_email}
            onChange={handleChange}
            placeholder="contact@example.com"
          />
        </div>

        {/* WhatsApp */}
        <div className="space-y-2">
          <Label htmlFor="whatsapp_number" className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            WhatsApp Number
          </Label>
          <Input
            id="whatsapp_number"
            name="whatsapp_number"
            value={formData.whatsapp_number}
            onChange={handleChange}
            placeholder="+8801XXXXXXXXX"
          />
          <p className="text-xs text-muted-foreground">Country code সহ লিখুন (যেমন: +8801609252155)</p>
        </div>

        {/* Location English */}
        <div className="space-y-2">
          <Label htmlFor="location_en" className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Location (English)
          </Label>
          <Input
            id="location_en"
            name="location_en"
            value={formData.location_en}
            onChange={handleChange}
            placeholder="Dhaka, Bangladesh"
          />
        </div>

        {/* Location Bangla */}
        <div className="space-y-2">
          <Label htmlFor="location_bn" className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Location (বাংলা)
          </Label>
          <Input
            id="location_bn"
            name="location_bn"
            value={formData.location_bn}
            onChange={handleChange}
            placeholder="ঢাকা, বাংলাদেশ"
          />
        </div>
      </div>

      <Button onClick={handleSave} disabled={isSaving} className="w-full sm:w-auto">
        {isSaving ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </>
        )}
      </Button>
    </div>
  );
};

export default ContactInfoSettings;
