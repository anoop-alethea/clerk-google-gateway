
import { useSignIn, useClerk } from "@clerk/clerk-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { POST_LOGIN_REDIRECT_URL } from "../infrastructure/config/authConfig";

const SSOCallback = () => {
  const { signIn, isLoaded: isSignInLoaded } = useSignIn();
  const { setActive } = useClerk();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isSignInLoaded) return;

    // Handle the OAuth callback
    const handleCallback = async () => {
      try {
        // Complete the OAuth flow
        const result = await signIn?.attemptFirstFactor({
          strategy: "oauth_callback",
          redirectUrl: '/sso-callback',
        });

        if (result?.status === "complete") {
          // Set the active session
          if (result.createdSessionId) {
            await setActive({ session: result.createdSessionId });
            toast.success("Successfully signed in!");
            
            // Redirect to the configured URL
            window.location.href = POST_LOGIN_REDIRECT_URL;
          }
        } else {
          console.error("OAuth callback failed:", result);
          toast.error("Authentication failed. Please try again.");
          navigate("/login");
        }
      } catch (error) {
        console.error("Error during OAuth callback:", error);
        toast.error("Authentication error. Please try again.");
        navigate("/login");
      }
    };

    handleCallback();
  }, [isSignInLoaded, signIn, setActive, navigate]);

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
