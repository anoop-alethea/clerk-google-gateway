
// Environment variable configuration with TypeScript support
// This provides type-safe access to environment variables

// Define environment variable types
interface Env {
  CLERK_PUBLISHABLE_KEY: string;
  DOCUSAURUS_SITE_URL: string;
  DOCUSAURUS_JWT_SECRET: string;
}

// Helper function to get environment variables with validation
function getEnvVariable(key: keyof Env): string {
  const value = import.meta.env[`VITE_${key}`] as string;
  
  if (!value && import.meta.env.PROD) {
    console.warn(`Environment variable ${key} is missing in production mode`);
  }
  
  return value || '';
}

// Default values for development
const defaults: Partial<Env> = {
  // For Clerk, we don't provide a default key as it should be explicitly set
  DOCUSAURUS_SITE_URL: "https://your-docusaurus-site.vercel.app",
  // Note: In production, use a properly generated secure secret
  DOCUSAURUS_JWT_SECRET: "your-jwt-secret-key"
};

// Export environment variables with fallbacks to defaults
export const env: Env = {
  CLERK_PUBLISHABLE_KEY: getEnvVariable("CLERK_PUBLISHABLE_KEY"),
  DOCUSAURUS_SITE_URL: getEnvVariable("DOCUSAURUS_SITE_URL") || defaults.DOCUSAURUS_SITE_URL!,
  DOCUSAURUS_JWT_SECRET: getEnvVariable("DOCUSAURUS_JWT_SECRET") || defaults.DOCUSAURUS_JWT_SECRET!,
};
