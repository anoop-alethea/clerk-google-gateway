
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { BookOpen, ExternalLink } from "lucide-react";
import { useDocusaurusAuth } from "@/utils/docusaurusAuth";

const Index = () => {
  const { signOut } = useAuth();
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const { docusaurusUrl, isAuthenticated } = useDocusaurusAuth();

  const handleSignOut = async () => {
    await signOut();
    // Also sign out from Supabase to keep both auth systems in sync
    await supabase.auth.signOut();
    navigate("/login");
    toast.success("Signed out successfully");
  };

  const handleDocusaurusClick = () => {
    if (docusaurusUrl) {
      // Open documentation in a new tab
      window.open(docusaurusUrl, "_blank");
    } else {
      toast.error("Authentication required to access documentation");
    }
  };

  if (!isLoaded) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">My App</h1>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              Welcome, {user?.fullName || user?.emailAddresses[0]?.emailAddress?.split('@')[0]}
            </div>
            <Button variant="outline" onClick={handleSignOut}>Sign Out</Button>
          </div>
        </header>
        
        <main className="bg-white shadow rounded-lg p-8">
          <h2 className="text-xl font-semibold mb-4">Dashboard</h2>
          <p className="text-gray-600">
            You are now signed in with a verified account. This is a protected page that only authenticated users can access.
          </p>
          
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <h3 className="text-lg font-medium text-blue-700">Your Account Information</h3>
            <div className="mt-2 space-y-2">
              <p><span className="font-semibold">Email:</span> {user?.emailAddresses[0]?.emailAddress}</p>
              <p><span className="font-semibold">Name:</span> {user?.fullName || 'Not provided'}</p>
            </div>
          </div>
          
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Link to="/documentation">
              <Button variant="default" className="w-full sm:w-auto">
                <BookOpen className="mr-2 h-4 w-4" />
                Local Documentation
              </Button>
            </Link>
            
            <Button 
              variant="outline" 
              className="w-full sm:w-auto"
              onClick={handleDocusaurusClick}
              disabled={!isAuthenticated}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              External Docusaurus Docs
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
