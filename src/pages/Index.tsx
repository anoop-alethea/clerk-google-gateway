
import { useUser, useClerk } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const { user } = useUser();
  const { signOut } = useClerk();
  const navigate = useNavigate();
  
  // Example of email verification check
  // You can modify this logic to check for specific domains or email addresses
  useEffect(() => {
    // This is where you can implement your custom authorization logic
    // For example, only allow specific email domains or addresses
    const userEmail = user?.emailAddresses[0]?.emailAddress || '';
    const isEmailAuthorized = userEmail.endsWith('@gmail.com'); // Example check
    
    if (!isEmailAuthorized) {
      toast.error("Unauthorized email domain. Only certain emails are allowed.");
      // Sign out unauthorized users
      signOut().then(() => navigate('/login'));
    }
  }, [user, signOut, navigate]);

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">My App</h1>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              Welcome, {user?.firstName || user?.emailAddresses[0]?.emailAddress}
            </div>
            <Button variant="outline" onClick={handleSignOut}>Sign Out</Button>
          </div>
        </header>
        
        <main className="bg-white shadow rounded-lg p-8">
          <h2 className="text-xl font-semibold mb-4">Dashboard</h2>
          <p className="text-gray-600">
            You are now signed in with a verified Google account. This is a protected page that only authenticated users with approved email addresses can access.
          </p>
          
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <h3 className="text-lg font-medium text-blue-700">Your Account Information</h3>
            <div className="mt-2 space-y-2">
              <p><span className="font-semibold">Email:</span> {user?.emailAddresses[0]?.emailAddress}</p>
              <p><span className="font-semibold">Name:</span> {user?.fullName}</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
