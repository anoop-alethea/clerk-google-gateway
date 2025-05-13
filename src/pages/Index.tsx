
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useNavigate, Link } from "react-router-dom";
import { BookOpen, ExternalLink } from "lucide-react";
import { useDocusaurusAuth } from "@/hooks/useDocusaurusAuth";
import { useState } from "react";

const Index = () => {
  const { signOut } = useAuth();
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const { getDocusaurusUrl, isAuthenticated } = useDocusaurusAuth();
  const [isGeneratingToken, setIsGeneratingToken] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
    toast.success("Signed out successfully");
  };

  const handleDocusaurusClick = async () => {
    if (isGeneratingToken) return;
    
    if (isAuthenticated) {
      try {
        setIsGeneratingToken(true);
        const docusaurusUrl = await getDocusaurusUrl();
        // Open documentation in a new tab
        window.open(docusaurusUrl, "_blank");
      } catch (error) {
        console.error("Failed to generate token:", error);
        toast.error("Failed to access documentation");
      } finally {
        setIsGeneratingToken(false);
      }
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
              disabled={!isAuthenticated || isGeneratingToken}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              {isGeneratingToken ? 'Loading...' : 'External Docusaurus Docs'}
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
