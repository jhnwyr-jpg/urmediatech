import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { LogIn, UserPlus } from "lucide-react";

export function LoginPanel({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const syncProfileMutation = useMutation({
    mutationFn: async (supabaseUser: any) => {
      const res = await apiRequest("POST", "/api/login", {
        email: supabaseUser.email,
        userId: supabaseUser.id,
        fullName: supabaseUser.user_metadata?.full_name,
        avatarUrl: supabaseUser.user_metadata?.avatar_url,
        isAdmin: false, // Default to non-admin
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/me"] });
      onOpenChange(false);
    },
  });

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        toast({ title: "Check your email for the confirmation link" });
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        
        if (data.user) {
          await syncProfileMutation.mutateAsync(data.user);
          toast({ title: "Logged in successfully" });
        }
      }
    } catch (error: any) {
      toast({ 
        title: "Authentication Error", 
        description: error.message, 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>{isSignUp ? "Create an account" : "Welcome back"}</DialogTitle>
          <DialogDescription>
            {isSignUp ? "Join UR Media today" : "Sign in to your account"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleAuth} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Processing..." : isSignUp ? "Sign Up" : "Sign In"}
          </Button>
          <Button 
            type="button" 
            variant="ghost" 
            className="w-full" 
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
