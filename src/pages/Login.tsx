
import { useState } from "react";
import { useSignIn, useSignUp } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FiUser, FiLock } from "react-icons/fi";
import { toast } from "sonner";

const Login = () => {
  const { isLoaded: isSignInLoaded, signIn, setActive } = useSignIn();
  const { isLoaded: isSignUpLoaded, signUp } = useSignUp();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Sign in with Google
  const signInWithGoogle = async () => {
    if (!isSignInLoaded) return;
    try {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/",
        // Optional: You can add allowed domains if needed
        // Uncomment and modify the line below when you want to restrict by domain
        // additionalData: { allowed_domains: ["yourdomain.com", "anotherdomain.com"] }
      });
    } catch (error) {
      toast.error("Error signing in with Google");
      console.error(error);
    }
  };

  // Sign in with email/password
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSignInLoaded) return;
    
    try {
      setIsLoading(true);
      const result = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        toast.success("Signed in successfully!");
        navigate("/");
      } else {
        toast.error("Something went wrong");
      }
    } catch (error: any) {
      toast.error(error.errors?.[0]?.message || "Error signing in");
    } finally {
      setIsLoading(false);
    }
  };

  // Sign up with email/password
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSignUpLoaded) return;
    
    try {
      setIsLoading(true);
      const result = await signUp.create({
        emailAddress,
        password,
        firstName,
        lastName,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        toast.success("Account created successfully!");
        navigate("/");
      } else {
        toast.warning("Please check your email to verify your account");
      }
    } catch (error: any) {
      toast.error(error.errors?.[0]?.message || "Error creating account");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isSignInLoaded || !isSignUpLoaded) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-4">
        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Welcome</CardTitle>
            <CardDescription>
              Sign in with Google for authorized access
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
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
                Continue with Google
              </Button>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">Or continue with</span>
                </div>
              </div>

              <Tabs defaultValue="signIn" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="signIn">Sign In</TabsTrigger>
                  <TabsTrigger value="signUp">Sign Up</TabsTrigger>
                </TabsList>
                <TabsContent value="signIn">
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                          <FiUser size={16} />
                        </div>
                        <Input
                          id="email"
                          type="email"
                          placeholder="name@example.com"
                          value={emailAddress}
                          onChange={(e) => setEmailAddress(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                          <FiLock size={16} />
                        </div>
                        <Input
                          id="password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Signing in..." : "Sign In"}
                    </Button>
                  </form>
                </TabsContent>
                <TabsContent value="signUp">
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First name</Label>
                        <Input
                          id="firstName"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last name</Label>
                        <Input
                          id="lastName"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signUpEmail">Email</Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                          <FiUser size={16} />
                        </div>
                        <Input
                          id="signUpEmail"
                          type="email"
                          placeholder="name@example.com"
                          value={emailAddress}
                          onChange={(e) => setEmailAddress(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signUpPassword">Password</Label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
                          <FiLock size={16} />
                        </div>
                        <Input
                          id="signUpPassword"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                      <p className="text-xs text-gray-500">Password must be at least 8 characters</p>
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Creating account..." : "Create Account"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center text-sm text-gray-600">
            Protected by Clerk
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
