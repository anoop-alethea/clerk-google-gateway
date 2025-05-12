
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
    const { error } = await supabase.functions.invoke('send-access-request', {
      body: { data },
    });
    
    if (error) {
      console.error("Error calling edge function:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error sending access request notification:", error);
    return false;
  }
};
