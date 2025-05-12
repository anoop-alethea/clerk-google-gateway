import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Lock } from "lucide-react";
import { useSignIn } from "@clerk/clerk-react";
import { toast } from "sonner";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

const resetPasswordSchema = z.object({
  code: z.string().min(6, "Please enter the 6-digit code"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

interface ForgotPasswordFormProps {
  onBack: () => void;
  onSuccess?: () => void;
}

const ForgotPasswordForm = ({ onBack, onSuccess }: ForgotPasswordFormProps) => {
  const { isLoaded, signIn } = useSignIn();
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [resetCompleted, setResetCompleted] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  
  const emailForm = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const resetForm = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      code: "",
      password: "",
    },
  });

  useEffect(() => {
    if (emailSent) {
      console.log("Email sent state changed. Reset form values:", resetForm.getValues());
      resetForm.reset({ code: "", password: "" });
    }
  }, [emailSent, resetForm]);

  const onSubmitEmail = async (data: ForgotPasswordFormValues) => {
    if (!isLoaded) {
      return;
    }
    
    try {
      setIsLoading(true);
      setUserEmail(data.email);
      
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: data.email,
      });
      
      setEmailSent(true);
      toast.success("Password reset email sent");
    } catch (error: any) {
      toast.error(error.errors?.[0]?.message || "Error sending password reset email");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitReset = async (data: ResetPasswordFormValues) => {
    console.log("Submitting reset form with data:", data);
    if (!isLoaded) {
      return;
    }
    
    try {
      setIsLoading(true);
      
      await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code: data.code,
        password: data.password,
      });
      
      setResetCompleted(true);
      toast.success("Password has been reset successfully");
      if (onSuccess) onSuccess();
    } catch (error: any) {
      toast.error(error.errors?.[0]?.message || "Error resetting password");
    } finally {
      setIsLoading(false);
    }
  };

  if (resetCompleted) {
    return (
      <div className="space-y-4">
        <div className="text-center">
          <Lock className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="font-medium text-lg">Password reset complete</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Your password has been reset successfully.
          </p>
        </div>
        <Button 
          className="w-full" 
          onClick={onBack}
        >
          Back to login
        </Button>
      </div>
    );
  }

  if (emailSent) {
    console.log("Rendering email sent view. Current form values:", resetForm.getValues());
    
    return (
      <div className="space-y-4">
        <div className="text-center">
          <Mail className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="font-medium text-lg">Check your email</h3>
          <p className="text-sm text-muted-foreground mt-2 mb-4">
            We've sent a verification code to <strong>{userEmail}</strong>. Enter the code below to reset your password.
          </p>
        </div>

        <Form {...resetForm}>
          <form onSubmit={resetForm.handleSubmit(onSubmitReset)} className="space-y-4">
            <FormField
              control={resetForm.control}
              name="code"
              render={({ field }) => {
                console.log("Code field rendering, current value:", field.value);
                return (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter 6-digit code" 
                      type="text"
                      onChange={(e) => {
                        console.log("Code input onChange called with:", e.target.value);
                        field.onChange(e.target.value);
                      }}
                      onFocus={(e) => {
                        console.log("Code input focused, current value:", e.target.value);
                        // If value is email, clear it on focus
                        if (e.target.value.includes('@')) {
                          e.target.value = '';
                          field.onChange('');
                        }
                      }}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}}
            />
            <FormField
              control={resetForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Enter your new password" {...field} />
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
                onClick={() => {
                  setEmailSent(false);
                  resetForm.reset();
                }}
              >
                Back
              </Button>
              <Button 
                className="w-full" 
                type="submit" 
                disabled={isLoading}
              >
                {isLoading ? "Resetting..." : "Reset Password"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="font-medium text-lg">Reset your password</h3>
        <p className="text-sm text-muted-foreground">
          Enter your email address and we'll send you a verification code to reset your password.
        </p>
      </div>
      
      <Form {...emailForm}>
        <form onSubmit={emailForm.handleSubmit(onSubmitEmail)} className="space-y-4">
          <FormField
            control={emailForm.control}
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
              {isLoading ? "Sending..." : "Send Reset Code"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ForgotPasswordForm;
