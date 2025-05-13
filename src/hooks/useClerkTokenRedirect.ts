import { useAuth } from "@clerk/clerk-react";

/**
 * Hook to redirect the user to the Docusaurus app with a secure Clerk JWT.
 */
export const useClerkTokenRedirect = () => {
  const { getToken } = useAuth();

  const redirectToDocusaurus = async (
    docusaurusUrl: string,
    template = "docusaurus"
  ): Promise<void> => {
    try {
      const token = await getToken({ template });

      if (!token) {
        throw new Error(`JWT not generated for template: ${template}`);
      }

      const url = `${docusaurusUrl}?token=${encodeURIComponent(token)}`;
      window.location.href = url;
    } catch (error) {
      console.error("🔐 Clerk JWT generation or redirect failed:", error);
      throw error;
    }
  };

  return { redirectToDocusaurus };
};
