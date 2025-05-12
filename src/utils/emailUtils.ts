
import { supabase } from '@/integrations/supabase/client';

interface AccessRequestData {
  fullName: string;
  email: string;
  company: string;
  reason?: string;
}

export const sendAccessRequestNotification = async (data: AccessRequestData): Promise<boolean> => {
  try {
    console.log("Sending access request notification:", data);
    
    // Call the Supabase Edge Function
    const { data: responseData, error } = await supabase.functions.invoke('send-access-request', {
      body: { data },
    });
    
    if (error) {
      console.error("Error calling edge function:", error);
      return false;
    }
    
    // Check for warning in the response (request saved but email failed)
    if (responseData?.warning) {
      console.warn("Warning from edge function:", responseData.warning);
      // We still return true because the request was saved
      return true;
    }
    
    return true;
  } catch (error) {
    console.error("Error sending access request notification:", error);
    return false;
  }
};
