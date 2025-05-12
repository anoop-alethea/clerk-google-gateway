
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import App from './App.tsx'
import './index.css'

// Use a default publishable key for development
// In production, this should be set as an environment variable
// Get a key from https://clerk.com
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || 
  "pk_test_c3RhYmxlLWxpemFyZC04Ny5jbGVyay5hY2NvdW50cy5kZXYk";

createRoot(document.getElementById("root")!).render(
  <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
    <App />
  </ClerkProvider>
);
