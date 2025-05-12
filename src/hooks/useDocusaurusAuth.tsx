
import { useAuth, useUser } from "@clerk/clerk-react";
import { env } from "../config/env";

// Secret used to sign the JWT token - from environment variables
const TOKEN_SECRET = env.DOCUSAURUS_JWT_SECRET;
// How long the token is valid for (in seconds)
const TOKEN_EXPIRY = 3600; // 1 hour

/**
 * Generates a simple HMAC signature for JWT using Web Crypto API
 * Note: This is a simplified implementation. In production, consider using a proper JWT library.
 */
async function generateSignature(input: string, secret: string): Promise<string> {
  // Convert message and key to Uint8Array
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const keyData = encoder.encode(secret);
  
  // Create a key from the secret
  const cryptoKey = await window.crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  // Sign the data
  const signature = await window.crypto.subtle.sign(
    'HMAC',
    cryptoKey,
    data
  );
  
  // Convert the signature to Base64URL format
  return arrayBufferToBase64Url(signature);
}

/**
 * Convert ArrayBuffer to Base64URL string
 */
function arrayBufferToBase64Url(buffer: ArrayBuffer): string {
  // Convert ArrayBuffer to regular Base64
  const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));
  // Convert to Base64URL format
  return base64.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

/**
 * Generates a JWT token for Docusaurus authentication
 */
export async function generateDocusaurusToken(userId: string, email: string): Promise<string> {
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
  const encodedHeader = btoa(JSON.stringify(header))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
    
  const encodedPayload = btoa(JSON.stringify(payload))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
  
  // Create signature
  const signatureInput = `${encodedHeader}.${encodedPayload}`;
  const signature = await generateSignature(signatureInput, TOKEN_SECRET);
  
  // Return complete JWT
  return `${encodedHeader}.${encodedPayload}.${signature}`;
}

/**
 * Hook to get the Docusaurus auth URL with token
 */
export function useDocusaurusAuth() {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  
  // Base URL of your Docusaurus site from environment variables
  const docusaurusBaseUrl = env.DOCUSAURUS_SITE_URL;
  
  if (!isSignedIn || !user) {
    return {
      docusaurusUrl: null,
      isAuthenticated: false
    };
  }
  
  const getDocusaurusUrl = async () => {
    const token = await generateDocusaurusToken(
      user.id,
      user.emailAddresses[0]?.emailAddress || ""
    );
    
    return `${docusaurusBaseUrl}?token=${token}`;
  };
  
  return {
    getDocusaurusUrl,
    isAuthenticated: true
  };
}
