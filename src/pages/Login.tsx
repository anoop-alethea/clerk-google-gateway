
import { useSignIn } from "@clerk/clerk-react";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Login = () => {
  const { isLoaded: isSignInLoaded, signIn } = useSignIn();
  const [isLoading, setIsLoading] = useState(false);

  // Sign in with Google
  const signInWithGoogle = async () => {
    if (!isSignInLoaded) return;
    
    try {
      setIsLoading(true);
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/"
      });
    } catch (error) {
      toast.error("Error signing in with Google");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isSignInLoaded) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-4">
        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Restricted Access</CardTitle>
            <CardDescription>
              Sign in with Google to verify your email domain
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              className="w-full flex items-center justify-center gap-2 bg-white text-gray-800 hover:bg-gray-50 border border-gray-300"
              onClick={signInWithGoogle}
              disabled={isLoading}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.1711 8.36788H17.4998V8.33329H9.99984V11.6666H14.7094C14.0223 13.607 12.1761 15 9.99984 15C7.23859 15 4.99984 12.7612 4.99984 9.99996C4.99984 7.23871 7.23859 4.99996 9.99984 4.99996C11.2744 4.99996 12.4344 5.48079 13.3169 6.26621L15.674 3.90913C14.1857 2.52204 12.1969 1.66663 9.99984 1.66663C5.39775 1.66663 1.6665 5.39788 1.6665 9.99996C1.6665 14.602 5.39775 18.3333 9.99984 18.3333C14.602 18.3333 18.3332 14.602 18.3332 9.99996C18.3332 9.44121 18.2757 8.89579 18.1711 8.36788Z" fill="#FFC107"/>
                <path d="M2.62744 6.12121L5.36536 8.12913C6.10619 6.29538 7.90036 4.99996 9.99994 4.99996C11.2745 4.99996 12.4345 5.48079 13.317 6.26621L15.6741 3.90913C14.1858 2.52204 12.197 1.66663 9.99994 1.66663C6.74077 1.66663 3.91619 3.47371 2.62744 6.12121Z" fill="#FF3D00"/>
                <path d="M10 18.3333C12.1525 18.3333 14.1084 17.5096 15.5871 16.1691L13.008 13.9583C12.1432 14.6245 11.0865 15 10 15C7.83255 15 5.99213 13.6179 5.2988 11.6892L2.5918 13.8026C3.86838 16.4923 6.72005 18.3333 10 18.3333Z" fill="#4CAF50"/>
                <path d="M18.1712 8.36788H17.5V8.33329H10V11.6666H14.7096C14.3809 12.5902 13.7889 13.3903 13.0067 13.9592L13.0079 13.9583L15.5871 16.1691C15.4046 16.3333 18.3333 14.1666 18.3333 10C18.3333 9.44121 18.2758 8.89579 18.1712 8.36788Z" fill="#1976D2"/>
              </svg>
              {isLoading ? "Authenticating..." : "Continue with Google"}
            </Button>
          </CardContent>
          <CardFooter className="flex justify-center text-sm text-gray-600">
            <p>Only authorized email domains are permitted</p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
