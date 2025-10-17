import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "@/store/useStore";
import { toast } from "sonner";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: "admin";
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const navigate = useNavigate();
  const currentUser = useStore((state) => state.currentUser);

  useEffect(() => {
    // For demo purposes, we'll check if there's a current user
    // In production, this should be integrated with proper authentication
    if (!currentUser) {
      toast.error("Please login to access this page");
      navigate("/auth");
      return;
    }

    // Admin role check - for demo, we'll allow access if user exists
    // In production with Lovable Cloud, use proper role checking from user_roles table
    if (requiredRole === "admin") {
      // For demo: Check if email contains "admin" or ID starts with "A"
      const isAdmin = 
        currentUser.email.toLowerCase().includes("admin") ||
        currentUser.id.startsWith("A");
      
      if (!isAdmin) {
        toast.error("Access denied. Admin privileges required.");
        navigate("/");
        return;
      }
    }
  }, [currentUser, requiredRole, navigate]);

  if (!currentUser) {
    return null;
  }

  return <>{children}</>;
}
