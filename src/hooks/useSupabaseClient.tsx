
import { useAuth } from "@clerk/clerk-react";
import { useCallback, useMemo } from "react";
import { createClerkSupabaseClient } from "@/integrations/supabase/client";

export function useSupabaseClient() {
  const { getToken } = useAuth();
  
  // Create a function to get the Clerk token for Supabase
  const getSupabaseToken = useCallback(async () => {
    return getToken({ template: "supabase" });
  }, [getToken]);
  
  // Create a Supabase client that uses the Clerk session token
  const supabaseClient = useMemo(
    () => createClerkSupabaseClient(getSupabaseToken),
    [getSupabaseToken]
  );
  
  return supabaseClient;
}
