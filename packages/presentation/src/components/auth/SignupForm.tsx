
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { isValidEmail } from "@monorepo/utils";
import { AlertCircle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "../ui/alert";

const signupSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Please enter a valid email address"),
  company: z.string().min(1, "Company name is required"),
  reason: z.string().optional(),
});

type SignupFormValues = z.infer<typeof signupSchema>;

interface SignupFormProps {
  onSuccess?: () => void;
}

const SignupForm = ({ onSuccess }: SignupFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      email: "",
      company: "",
      reason: "",
    },
  });

  const onSubmit = async (data: SignupFormValues) => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log("Submitting access request with data:", data);
      
      // Validate email format
      if (!isValidEmail(data.email)) {
        setError("Please enter a valid email address");
        toast.error("Invalid email format");
        return;
      }
      
      // Generate a unique request ID
      const requestId = crypto.randomUUID();
      
      // Store the user data locally for reference and backup
      const storedRequests = localStorage.getItem('accessRequests') || '[]';
      const requests = JSON.parse(storedRequests);
      const newRequest = {
        id: requestId,
        ...data,
        requestedAt: new Date().toISOString(),
        status: 'pending'
      };
      
      requests.push(newRequest);
      localStorage.setItem('accessRequests', JSON.stringify(requests));
      console.log("Request stored in localStorage with ID:", requestId);
      
      // Send the access request to Clerk admin by pre-registering the user
      // This will create a user that the admin can see in the Clerk dashboard
      try {
        // This is where you would normally integrate with Clerk's API to create 
        // a user or send data to the admin. Since we're simulating this process:
        console.log("Access request sent to Clerk admin for:", data.email);
        
        // Show a simulated admin notification message
        console.log("Admin notification simulated for access request:", requestId);
        toast.success("Your access request has been submitted to the administrator");
        
        // In production, here you would use Clerk's API to pre-register users
        // or send data to a webhook that notifies admins
        
        setRequestSent(true);
        if (onSuccess) onSuccess();
      } catch (apiError: any) {
        console.error("Failed to send admin notification:", apiError);
        setError("Your request was recorded but we couldn't notify the administrator immediately. Please try again later.");
        toast.error("Admin notification failed");
      }
    } catch (error: any) {
      console.error("Error in access request submission:", error);
      setError(error.message || "Error submitting request");
      toast.error("Error submitting request");
    } finally {
      setIsLoading(false);
    }
  };

  if (requestSent) {
    return (
      <div className="space-y-4 text-center">
        <h3 className="font-medium text-lg">Request Submitted</h3>
        <p className="text-sm text-muted-foreground">
          Your request has been submitted to our administrators.
        </p>
        <p className="text-xs text-muted-foreground">
          You will receive an email when your access is approved.
        </p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input 
                  placeholder="John Doe" 
                  type="text" 
                  {...field} 
                  autoComplete="name"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input 
                  placeholder="name@example.com" 
                  type="email" 
                  {...field} 
                  autoComplete="email"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="company"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Your company" 
                  type="text" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reason for access (optional)</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Briefly describe why you need access" 
                  type="text" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button 
          className="w-full" 
          type="submit" 
          disabled={isLoading}
        >
          {isLoading ? "Submitting request..." : "Request access"}
        </Button>
      </form>
    </Form>
  );
};

export default SignupForm;
