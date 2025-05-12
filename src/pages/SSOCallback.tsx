
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { POST_LOGIN_REDIRECT_URL } from "../infrastructure/config/authConfig";

const SSOCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get auth code from URL
        const hash = window.location.hash;
        const query = window.location.search;

        if (hash || query) {
          // Handle OAuth callback to get the session
          const { error } = await supabase.auth.exchangeCodeForSession(
            hash || query
          );

          if (error) {
            console.error("OAuth callback error:", error);
            toast.error("Authentication failed. Please try again.");
            navigate("/login");
            return;
          }

          // Check if we got a session
          const { data: { session } } = await supabase.auth.getSession();
          
          if (session) {
            toast.success("Successfully signed in!");
            
            // Redirect to the configured URL if external, or to our app's home
            if (POST_LOGIN_REDIRECT_URL.startsWith('http')) {
              window.location.href = POST_LOGIN_REDIRECT_URL;
            } else {
              navigate(POST_LOGIN_REDIRECT_URL);
            }
          } else {
            // If no session, redirect to login
            navigate("/login");
          }
        } else {
          // No auth parameters found in URL
          navigate("/login");
        }
      } catch (error) {
        console.error("Error during OAuth callback:", error);
        toast.error("Authentication error. Please try again.");
        navigate("/login");
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">Completing authentication...</h2>
        <div className="w-16 h-16 border-4 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    </div>
  );
};

export default SSOCallback;
