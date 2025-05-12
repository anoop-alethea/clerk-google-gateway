
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resendApiKey = Deno.env.get("RESEND_API_KEY");

// Make sure we have the API key before creating the Resend client
if (!resendApiKey) {
  console.error("RESEND_API_KEY environment variable is not set");
}

const resend = new Resend(resendApiKey);

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
    // Log API key status (don't log the actual key)
    console.log("Resend API key status:", resendApiKey ? "Present" : "Missing");
    
    const { to, subject, content }: EmailRequest = await req.json();
    
    // Log the email request for troubleshooting
    console.log("Sending email to admin using Resend:", { to, subject });
    
    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY environment variable is not set");
    }
    
    // Send the email using Resend
    const { data, error } = await resend.emails.send({
      from: "Access Requests <onboarding@resend.dev>",
      to: [to],
      subject: subject,
      html: content,
    });
    
    if (error) {
      console.error("Error sending email:", error);
      throw new Error(`Failed to send email: ${error.message || JSON.stringify(error)}`);
    }
    
    console.log("Email sent successfully:", data);
    
    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error sending admin email:", error);
    
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
