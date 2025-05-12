
import { createHash } from 'crypto';
import { useAuth, useUser } from "@clerk/clerk-react";

// Secret used to sign the JWT token - in production you should use a stronger secret
const TOKEN_SECRET = "your-jwt-secret-key";
// How long the token is valid for (in seconds)
const TOKEN_EXPIRY = 3600; // 1 hour

/**
 * Generates a JWT token for Docusaurus authentication
 */
export function generateDocusaurusToken(userId: string, email: string): string {
  const now = Math.floor(Date.now() / 1000);
  
  // Create JWT header
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };
  
  // Create JWT payload
  const payload = {
    sub: userId,
    email: email,
    iat: now,
    exp: now + TOKEN_EXPIRY
  };
  
  // Encode header and payload
  const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  
  // Create signature
  const signature = createHash('sha256')
    .update(`${encodedHeader}.${encodedPayload}.${TOKEN_SECRET}`)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
  
  // Return complete JWT
  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

/**
 * Hook to get the Docusaurus auth URL with token
 */
export function useDocusaurusAuth() {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  
  // Base URL of your Docusaurus site
  const docusaurusBaseUrl = "https://your-docusaurus-site.vercel.app";
  
  if (!isSignedIn || !user) {
    return {
      docusaurusUrl: null,
      isAuthenticated: false
    };
  }
  
  const token = generateDocusaurusToken(
    user.id,
    user.emailAddresses[0]?.emailAddress || ""
  );
  
  return {
    docusaurusUrl: `${docusaurusBaseUrl}?token=${token}`,
    isAuthenticated: true
  };
}
