
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import App from './App.tsx'
import './index.css'
import { env } from './config/env'

// Use the environment variable from our config
const PUBLISHABLE_KEY = env.CLERK_PUBLISHABLE_KEY;

// Show a helpful error message if the key is missing
if (!PUBLISHABLE_KEY) {
  console.error('Missing Clerk publishable key. Set VITE_CLERK_PUBLISHABLE_KEY in your environment');
}

createRoot(document.getElementById("root")!).render(
  <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
    <App />
  </ClerkProvider>
);
