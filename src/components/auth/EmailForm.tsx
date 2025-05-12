
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type EmailFormValues = z.infer<typeof emailSchema>;

interface EmailFormProps {
  onSubmit: (data: EmailFormValues) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

const EmailForm = ({ onSubmit, onCancel, isLoading }: EmailFormProps) => {
  const form = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="font-medium text-lg">Reset your password</h3>
        <p className="text-sm text-muted-foreground">
          Enter your email address and we'll send you a verification code to reset your password.
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
          <div className="flex gap-2">
            <Button 
              className="w-full" 
              variant="outline" 
              type="button"
              onClick={onCancel}
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

export default EmailForm;
