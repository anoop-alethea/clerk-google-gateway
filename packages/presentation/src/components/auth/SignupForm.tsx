
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { sendAccessRequestNotification, checkResendApiStatus } from "@monorepo/utils";
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
  const [apiStatus, setApiStatus] = useState<{isConfigured: boolean; status: string; apiKey: string} | null>(null);
  
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
      
      // Check Resend API status first
      const resendStatus = await checkResendApiStatus();
      setApiStatus(resendStatus);
      console.log("Resend API status:", resendStatus);
      
      // Store the user data locally regardless of email success
      // This ensures we don't lose the information even if email fails
      const storedRequests = localStorage.getItem('accessRequests') || '[]';
      const requests = JSON.parse(storedRequests);
      requests.push({
        ...data,
        requestedAt: new Date().toISOString()
      });
      localStorage.setItem('accessRequests', JSON.stringify(requests));
      console.log("Request stored in localStorage");
      
      // Send notification email to admin
      const success = await sendAccessRequestNotification({
        fullName: data.fullName,
        email: data.email,
        company: data.company,
        reason: data.reason
      });
      
      if (success) {
        console.log("Email sent successfully to admin");
        toast.success("Your access request has been submitted");
        setRequestSent(true);
        
        if (onSuccess) onSuccess();
      } else {
        console.error("Email sending failed but user data was stored");
        // Show error to user but let them know the request was still recorded
        setError("We couldn't send the notification email, but your request has been recorded. Our team will review it soon.");
        toast.error("Email notification failed, but your request was recorded");
        
        // Log the error
        console.error("Admin notification email failed, but request was recorded");
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
          Our team will reach out to you at the earliest.
        </p>
        <p className="text-xs text-muted-foreground">
          Please check your email for further instructions.
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
        {apiStatus && !apiStatus.isConfigured && (
          <Alert variant="warning" className="bg-amber-50 text-amber-800 border-amber-200">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>API Configuration Issue</AlertTitle>
            <AlertDescription>
              There may be an issue with our email service. Your request will still be recorded.
            </AlertDescription>
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
