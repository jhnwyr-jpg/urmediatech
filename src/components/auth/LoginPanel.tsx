import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { apiRequest, queryClient } from "@/lib/queryClient";

const ALLOWED_EMAIL = "stuckff481@gmail.com"; // Restrict access to this specific user

export function LoginPanel({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        if (session.user.email !== ALLOWED_EMAIL) {
          await supabase.auth.signOut();
          toast({ 
            title: "Access Denied", 
            description: "You do not have permission to access this panel.",
            variant: "destructive"
          });
          return;
        }

        try {
          await apiRequest("POST", "/api/login", {
            email: session.user.email,
            userId: session.user.id,
            fullName: session.user.user_metadata?.full_name,
            avatarUrl: session.user.user_metadata?.avatar_url,
            isAdmin: true, // Assuming this one person is an admin
          });
          
          toast({ title: "Logged in successfully" });
          queryClient.invalidateQueries({ queryKey: ["/api/me"] });
          onOpenChange(false);
        } catch (error) {
          console.error("Profile sync error:", error);
          toast({ 
            title: "Sync Error", 
            description: "Failed to sync profile data.",
            variant: "destructive"
          });
        }
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
