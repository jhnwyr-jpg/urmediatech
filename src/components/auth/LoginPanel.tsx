import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { queryClient } from "@/lib/queryClient";

export function LoginPanel({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        toast({ title: "Logged in successfully" });
        queryClient.invalidateQueries({ queryKey: ["/api/me"] });
        onOpenChange(false);
      }
      if (event === "USER_UPDATED") {
        toast({ title: "Profile updated" });
      }
      if (event === "SIGNED_OUT") {
        queryClient.invalidateQueries({ queryKey: ["/api/me"] });
      }
    });

    return () => subscription.unsubscribe();
  }, [onOpenChange, toast]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Sign In / Sign Up</DialogTitle>
          <DialogDescription>
            Use your email to access your account or join UR Media.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Auth
            supabaseClient={supabase}
            appearance={ {
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: 'hsl(var(--primary))',
                    brandAccent: 'hsl(var(--primary))',
                  },
                },
              },
            } }
            providers={[]}
            theme="light"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
