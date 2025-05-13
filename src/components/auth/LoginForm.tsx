import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { useSignIn } from "@clerk/clerk-react";
import { toast } from "sonner";
import { useClerkTokenRedirect } from "@/hooks/useClerkTokenRedirect"; // Updated import path

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSuccess?: () => void;
  onForgotPassword?: () => void;
}

const LoginForm = ({ onSuccess, onForgotPassword }: LoginFormProps) => {
  const { isLoaded, signIn, setActive } = useSignIn();
  const { redirectToDocusaurus } = useClerkTokenRedirect();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    if (!isLoaded) return;

    try {
      setIsLoading(true);

      const result = await signIn.create({
        identifier: data.email,
        password: data.password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        toast.success("Signed in successfully");

        // 🔐 Redirect to Docusaurus with secure JWT
        await redirectToDocusaurus(import.meta.env.VITE_DOCUSAURUS_SITE_URL);

        if (onSuccess) onSuccess();
      } else {
        toast.error("Something went wrong during sign in");
      }
    } catch (error: any) {
      toast.error(error.errors?.[0]?.message || "Error signing in");
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Password</FormLabel>
                <Button
                  variant="link"
                  className="p-0 h-auto text-xs"
                  type="button"
                  onClick={onForgotPassword}
                >
                  Forgot password?
                </Button>
              </div>
              <FormControl>
                <Input
                  placeholder="********"
                  type="password"
                  {...field}
                  autoComplete="current-password"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          className="w-full flex items-center justify-center gap-2"
          type="submit"
          disabled={isLoading}
        >
          <LogIn className="w-4 h-4" />
          {isLoading ? "Signing in..." : "Sign in"}
        </Button>
      </form>
    </Form>
  );
};

export default LoginForm;
