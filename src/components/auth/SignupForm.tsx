
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { sendAccessRequestNotification } from "@/utils/emailUtils";

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
      
      // Send notification email to admin
      const success = await sendAccessRequestNotification({
        fullName: data.fullName,
        email: data.email,
        company: data.company,
        reason: data.reason
      });
      
      if (success) {
        toast.success("Your access request has been submitted");
        setRequestSent(true);
        
        if (onSuccess) onSuccess();
      } else {
        toast.error("Error submitting request. Please try again.");
      }
    } catch (error: any) {
      toast.error("Error submitting request");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (requestSent) {
    return (
      <div className="space-y-4 text-center">
        <h3 className="font-medium text-lg">Request Submitted</h3>
        <p className="text-sm text-muted-foreground">
          Your request has been sent. Our team will reach out to you at the earliest.
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
