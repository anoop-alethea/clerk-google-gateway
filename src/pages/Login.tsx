
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

type AuthScreen = "login" | "request-access" | "forgot-password";

const Login = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const [authScreen, setAuthScreen] = useState<AuthScreen>("login");

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

  const renderTitle = () => {
    switch (authScreen) {
      case "request-access":
        return "Request Access";
      case "forgot-password":
        return "Reset Password";
      default:
        return "Sign In";
    }
  };

  const renderDescription = () => {
    switch (authScreen) {
      case "request-access":
        return "Submit your details to request access to the platform";
      case "forgot-password":
        return "Reset your password via email";
      default:
        return "Enter your credentials to access your account";
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-4">
        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">
              {renderTitle()}
            </CardTitle>
            <CardDescription>
              {renderDescription()}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Auth Form */}
            {authScreen === "request-access" && <SignupForm />}
            {authScreen === "login" && (
              <LoginForm 
                onForgotPassword={() => setAuthScreen("forgot-password")} 
              />
            )}
            {authScreen === "forgot-password" && (
              <ForgotPasswordForm 
                onBack={() => setAuthScreen("login")}
              />
            )}
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-2">
            {authScreen !== "forgot-password" && (
              <div className="text-center text-sm">
                {authScreen === "request-access" ? (
                  <span>
                    Already have an account?{" "}
                    <Button variant="link" className="p-0" onClick={() => setAuthScreen("login")}>
                      Sign in
                    </Button>
                  </span>
                ) : (
                  <span>
                    Need an account?{" "}
                    <Button variant="link" className="p-0" onClick={() => setAuthScreen("request-access")}>
                      Request access
                    </Button>
                  </span>
                )}
              </div>
            )}
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
