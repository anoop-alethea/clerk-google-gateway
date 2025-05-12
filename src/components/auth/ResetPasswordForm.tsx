
import { useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

const resetPasswordSchema = z.object({
  code: z.string().min(6, "Please enter the 6-digit code"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

interface ResetPasswordFormProps {
  userEmail: string;
  onSubmit: (data: ResetPasswordFormValues) => Promise<void>;
  onBack: () => void;
  isLoading: boolean;
}

const ResetPasswordForm = ({
  userEmail,
  onSubmit,
  onBack,
  isLoading,
}: ResetPasswordFormProps) => {
  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      code: "",
      password: "",
    },
  });

  // Reset form values when component mounts
  useEffect(() => {
    form.setValue("code", "");
    form.setValue("password", "");
  }, [form]);

  return (
    <div className="space-y-4">
      <div className="text-center">
        <Mail className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="font-medium text-lg">Check your email</h3>
        <p className="text-sm text-muted-foreground mt-2 mb-4">
          We've sent a verification code to <strong>{userEmail}</strong>. Enter the code below to reset your password.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Verification Code</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter 6-digit code" 
                    type="text"
                    value={field.value}
                    onChange={(e) => field.onChange(e)}
                    autoComplete="off"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <Input 
                    type="password" 
                    placeholder="Enter your new password"
                    autoComplete="new-password" 
                    {...field} 
                  />
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
};

export default ResetPasswordForm;
