
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";

const Login = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const [isSignup, setIsSignup] = useState(false);

  // Show loading state while Clerk is initializing
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // If already authenticated, redirect to home
  if (isSignedIn) {
    return <Navigate to="/" />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-4">
        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">
              {isSignup ? "Create Account" : "Sign In"}
            </CardTitle>
            <CardDescription>
              {isSignup 
                ? "Create a new account to get started" 
                : "Enter your credentials to access your account"}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Login/Signup Form */}
            {isSignup ? <SignupForm /> : <LoginForm />}
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-2">
            <div className="text-center text-sm">
              {isSignup ? (
                <span>
                  Already have an account?{" "}
                  <Button variant="link" className="p-0" onClick={() => setIsSignup(false)}>
                    Sign in
                  </Button>
                </span>
              ) : (
                <span>
                  Don't have an account?{" "}
                  <Button variant="link" className="p-0" onClick={() => setIsSignup(true)}>
                    Sign up
                  </Button>
                </span>
              )}
            </div>
            <div className="text-center text-xs text-gray-600">
              <p>Only authorized users are permitted</p>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
