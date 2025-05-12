
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

// Get the API key from environment variables
const resendApiKey = Deno.env.get("RESEND_API_KEY");

// Log API key status for debugging (without exposing the actual key)
console.log("RESEND_API_KEY status:", resendApiKey ? "Found" : "Missing");

if (!resendApiKey) {
  console.error("RESEND_API_KEY environment variable is not set or empty");
}

// Initialize Resend only if we have an API key
const resend = resendApiKey ? new Resend(resendApiKey) : null;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string;
  subject: string;
  content: string;
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Check if Resend client is initialized
    if (!resend) {
      console.error("Cannot send email: Resend client is not initialized due to missing API key");
      return new Response(
        JSON.stringify({
          success: false,
          error: "Email service is not properly configured. Please contact an administrator."
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const { to, subject, content }: EmailRequest = await req.json();
    
    // Log the email request details
    console.log("Attempting to send email:", { to, subject });
    
    // Send the email using Resend
    const { data, error } = await resend.emails.send({
      from: "Access Requests <onboarding@resend.dev>",
      to: [to],
      subject: subject,
      html: content,
    });
    
    if (error) {
      console.error("Error from Resend API:", error);
      throw new Error(`Failed to send email: ${error.message || JSON.stringify(error)}`);
    }
    
    console.log("Email sent successfully:", data);
    
    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in send-admin-email function:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "Failed to send email" 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
