import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import logo from "@/assets/logo.ico";

const ClientLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { language } = useLanguage();

  const t = {
    bn: {
      title: "ক্লায়েন্ট লগইন",
      signUpTitle: "নতুন অ্যাকাউন্ট তৈরি করুন",
      email: "ইমেইল",
      emailPlaceholder: "আপনার ইমেইল লিখুন",
      password: "পাসওয়ার্ড",
      passwordPlaceholder: "আপনার পাসওয়ার্ড লিখুন",
      login: "লগইন করুন",
      signUp: "সাইন আপ করুন",
      noAccount: "অ্যাকাউন্ট নেই?",
      hasAccount: "অ্যাকাউন্ট আছে?",
      createAccount: "অ্যাকাউন্ট তৈরি করুন",
      loginHere: "লগইন করুন",
      backToHome: "হোমে ফিরে যান",
      loggingIn: "লগইন হচ্ছে...",
      signingUp: "সাইন আপ হচ্ছে...",
      successLogin: "সফলভাবে লগইন হয়েছে!",
      successSignUp: "অ্যাকাউন্ট তৈরি হয়েছে! আপনি এখন লগইন করতে পারেন।",
      errorLogin: "লগইন ব্যর্থ। ইমেইল বা পাসওয়ার্ড সঠিক নয়।",
      errorSignUp: "সাইন আপ ব্যর্থ। অনুগ্রহ করে আবার চেষ্টা করুন।",
      welcomeBack: "স্বাগতম!",
      welcomeDesc: "আপনার সার্ভিস এবং অর্ডার দেখতে লগইন করুন।",
      orContinueWith: "অথবা",
      continueWithGoogle: "Google দিয়ে লগইন করুন",
      errorGoogle: "Google লগইন ব্যর্থ। অনুগ্রহ করে আবার চেষ্টা করুন।",
    },
    en: {
      title: "Client Login",
      signUpTitle: "Create New Account",
      email: "Email",
      emailPlaceholder: "Enter your email",
      password: "Password",
      passwordPlaceholder: "Enter your password",
      login: "Login",
      signUp: "Sign Up",
      noAccount: "Don't have an account?",
      hasAccount: "Already have an account?",
      createAccount: "Create Account",
      loginHere: "Login here",
      backToHome: "Back to Home",
      loggingIn: "Logging in...",
      signingUp: "Signing up...",
      successLogin: "Successfully logged in!",
      successSignUp: "Account created! You can now login.",
      errorLogin: "Login failed. Invalid email or password.",
      errorSignUp: "Sign up failed. Please try again.",
      welcomeBack: "Welcome Back!",
      welcomeDesc: "Login to view your services and orders.",
      orContinueWith: "or",
      continueWithGoogle: "Continue with Google",
      errorGoogle: "Google login failed. Please try again.",
    },
  };

  const texts = t[language];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/client/dashboard`,
          },
        });

        if (error) throw error;

        toast({
          title: "✓",
          description: texts.successSignUp,
        });
        setIsSignUp(false);
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        toast({
          title: "✓",
          description: texts.successLogin,
        });
        navigate("/client/dashboard");
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: isSignUp ? texts.errorSignUp : texts.errorLogin,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/client/dashboard`,
        },
      });

      if (error) throw error;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: texts.errorGoogle,
      });
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Back to Home */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft size={18} />
          {texts.backToHome}
        </Link>

        {/* Card */}
        <div
          className="p-8 rounded-3xl relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.1) 100%)",
            backdropFilter: "blur(20px) saturate(180%)",
            WebkitBackdropFilter: "blur(20px) saturate(180%)",
            border: "1px solid rgba(255,255,255,0.18)",
            boxShadow:
              "0 8px 32px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.2)",
          }}
        >
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <img src={logo} alt="UR Media" className="w-10 h-10" />
            <span className="font-bold text-xl text-foreground">
              UR <span className="text-primary">Media</span>
            </span>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              {isSignUp ? texts.signUpTitle : texts.title}
            </h1>
            <p className="text-muted-foreground text-sm">{texts.welcomeDesc}</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">{texts.email}</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                  id="email"
                  type="email"
                  placeholder={texts.emailPlaceholder}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 rounded-xl bg-background/50"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{texts.password}</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={texts.passwordPlaceholder}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-12 rounded-xl bg-background/50"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="gradient"
              className="w-full h-12 rounded-xl text-base"
              disabled={isLoading}
            >
              {isLoading
                ? isSignUp
                  ? texts.signingUp
                  : texts.loggingIn
                : isSignUp
                ? texts.signUp
                : texts.login}
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-sm text-muted-foreground">{texts.orContinueWith}</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Google Login */}
          <Button
            type="button"
            variant="outline"
            className="w-full h-12 rounded-xl text-base gap-3"
            onClick={handleGoogleLogin}
            disabled={isGoogleLoading}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            {isGoogleLoading ? "..." : texts.continueWithGoogle}
          </Button>

          {/* Toggle Sign Up / Login */}
          <div className="mt-6 text-center text-sm text-muted-foreground">
            {isSignUp ? texts.hasAccount : texts.noAccount}{" "}
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-primary hover:underline font-medium"
            >
              {isSignUp ? texts.loginHere : texts.createAccount}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ClientLogin;
