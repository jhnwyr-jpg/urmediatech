import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        navigate(requireAdmin ? "/admin/login" : "/client/login", { replace: true });
        return;
      }

      if (requireAdmin) {
        const { data, error } = await supabase
          .from("profiles")
          .select("is_admin")
          .eq("user_id", session.user.id)
          .maybeSingle();

        if (error || !data?.is_admin) {
          await supabase.auth.signOut();
          navigate("/admin/login", { replace: true });
          return;
        }
      }

      setIsAuthorized(true);
    };

    checkAuth();
  }, [navigate, requireAdmin]);

  if (isAuthorized === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
