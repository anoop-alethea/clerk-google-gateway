
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/infrastructure/contexts/AuthContext";
import { useUserProfile } from "@/application/hooks/useUserProfile";

const Index = () => {
  const { user, signOut } = useAuth();
  const { profile, isLoading: profileLoading } = useUserProfile();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">My App</h1>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              {profileLoading ? (
                "Loading..."
              ) : (
                <>Welcome, {profile?.full_name || user?.email?.split('@')[0]}</>
              )}
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
              <p><span className="font-semibold">Email:</span> {user?.email}</p>
              <p><span className="font-semibold">Name:</span> {profile?.full_name || 'Not provided'}</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
