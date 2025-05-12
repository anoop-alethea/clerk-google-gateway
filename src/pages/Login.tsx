
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/infrastructure/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";
import OAuthButtons from "@/components/auth/OAuthButtons";

const Login = () => {
  const { isLoading, user } = useAuth();
  const [isSignup, setIsSignup] = useState(false);

  // If already authenticated, redirect to home
  if (user) {
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
            {/* OAuth Buttons */}
            <OAuthButtons isLoading={isLoading} />

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

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
