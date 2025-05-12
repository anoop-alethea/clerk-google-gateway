
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { useSignIn } from "@clerk/clerk-react";
import { toast } from "sonner";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

interface ForgotPasswordFormProps {
  onBack: () => void;
  onSuccess?: () => void;
}

const ForgotPasswordForm = ({ onBack, onSuccess }: ForgotPasswordFormProps) => {
  const { isLoaded, signIn } = useSignIn();
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  
  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    if (!isLoaded) {
      return;
    }
    
    try {
      setIsLoading(true);
      
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: data.email,
      });
      
      setEmailSent(true);
      toast.success("Password reset email sent");
      if (onSuccess) onSuccess();
    } catch (error: any) {
      toast.error(error.errors?.[0]?.message || "Error sending password reset email");
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="space-y-4">
        <div className="text-center">
          <Mail className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="font-medium text-lg">Check your email</h3>
          <p className="text-sm text-muted-foreground mt-2">
            We've sent you a password reset link. Please check your inbox.
          </p>
        </div>
        <Button 
          className="w-full" 
          variant="outline" 
          onClick={onBack}
        >
          Back to login
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="font-medium text-lg">Reset your password</h3>
        <p className="text-sm text-muted-foreground">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="name@example.com" type="email" {...field} autoComplete="email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-2">
            <Button 
              className="w-full" 
              variant="outline" 
              type="button"
              onClick={onBack}
            >
              Cancel
            </Button>
            <Button 
              className="w-full" 
              type="submit" 
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ForgotPasswordForm;
