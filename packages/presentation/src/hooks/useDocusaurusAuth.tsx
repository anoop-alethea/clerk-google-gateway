
import { useAuth } from "@clerk/clerk-react";
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { isAllowedDomain } from "../../../web/src/config/env";

export const useDocusaurusAuth = () => {
  const { getToken, isSignedIn } = useAuth();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  
  useEffect(() => {
    setIsAuthenticated(!!isSignedIn);
  }, [isSignedIn]);

  const getDocusaurusUrl = useCallback(async () => {
    try {
      // Get the token from Clerk using the docusaurus template
      const token = await getToken({ template: "WiCheckDocumentation" });
      if (!token) {
        throw new Error("Failed to generate authentication token");
      }

      // Get the Docusaurus site URL from environment
      const docusaurusSiteUrl = import.meta.env.VITE_DOCUSAURUS_SITE_URL || 'http://localhost:3000';
      
      // Validate target domain for security
      if (!isAllowedDomain(docusaurusSiteUrl)) {
        toast.error("Redirect blocked: Domain not in allowed list");
        throw new Error(`Domain security error: ${new URL(docusaurusSiteUrl).hostname} is not in allowed domains list`);
      }
      
      // Create URL with token
      const url = new URL(docusaurusSiteUrl);
      url.searchParams.append("token", token);
      
      return url.toString();
    } catch (error) {
      console.error("Error generating Docusaurus URL:", error);
      throw error;
    }
  }, [getToken]);

  return { isAuthenticated, getDocusaurusUrl };
};
