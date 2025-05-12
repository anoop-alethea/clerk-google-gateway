
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const SSOCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Add a small delay to allow Clerk to process the authentication
    const timer = setTimeout(() => {
      navigate("/");
      toast.success("Successfully signed in!");
    }, 2000);

    return () => clearTimeout(timer);
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
