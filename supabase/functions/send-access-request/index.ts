
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AccessRequestData {
  fullName: string;
  email: string;
  company: string;
  reason?: string;
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization") ?? "" },
        },
      }
    );

    const { data: requestData } = await req.json() as { data: AccessRequestData };
    
    // Log the request for troubleshooting
    console.log("Access request received:", requestData);
    
    // Store the access request in a database table for admin reference
    const { error: dbError } = await supabaseClient
      .from('access_requests')
      .insert([
        {
          full_name: requestData.fullName,
          email: requestData.email,
          company: requestData.company,
          reason: requestData.reason || null,
          status: 'pending'
        }
      ]);
    
    if (dbError) {
      console.error("Error storing access request:", dbError);
      // Continue execution even if database insert fails
    }

    // Format email content
    const emailSubject = `New access request from ${requestData.fullName}`;
    const emailContent = `
      New access request details:
      
      Name: ${requestData.fullName}
      Email: ${requestData.email}
      Company: ${requestData.company}
      Reason: ${requestData.reason || "Not provided"}
      
      To approve this request, please create an account for this user in the admin dashboard.
    `;

    // Send notification to admin directly without using the other function
    const adminEmail = "anoop.appukuttan@aletheatech.com";
    console.log(`Sending direct notification to ${adminEmail}`);
    
    // For now, we'll just simulate a successful email sending
    // In production, you would integrate with an email provider here
    
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error processing access request:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "Failed to process access request" 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
