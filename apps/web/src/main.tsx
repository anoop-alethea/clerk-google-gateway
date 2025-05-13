
import { createRoot } from 'react-dom/client'
import { ClerkProvider } from '@clerk/clerk-react'
import App from './App.tsx'
import './index.css'
import { env } from './config/env'

// Use the environment variable from our config
const PUBLISHABLE_KEY = env.CLERK_PUBLISHABLE_KEY;

// If we're in development mode, show a helpful message
if (!PUBLISHABLE_KEY) {
  console.error('Missing Clerk publishable key. Please set VITE_CLERK_PUBLISHABLE_KEY in your .env file.');

  // Create a simple error page when there's no key available in dev mode
  if (!import.meta.env.PROD) {
    const root = document.getElementById("root");
    if (root) {
      root.innerHTML = `
        <div style="padding: 2rem; font-family: system-ui; max-width: 600px; margin: 0 auto; line-height: 1.5;">
          <h1 style="color: #e11d48;">Missing Clerk API Key</h1>
          <p>This application requires a valid Clerk publishable key to function properly.</p>
          <h2>How to fix this:</h2>
          <ol>
            <li>Create a <code>.env</code> file in the project root if it doesn't exist</li>
            <li>Add the following line to your .env file:<br>
              <code>VITE_CLERK_PUBLISHABLE_KEY=pk_test_YOUR_ACTUAL_KEY</code>
            </li>
            <li>Get your Clerk publishable key from the <a href="https://dashboard.clerk.com/last-active?path=api-keys" target="_blank">Clerk dashboard</a></li>
            <li>Restart your development server</li>
          </ol>
          <p>For testing purposes, you can create a free Clerk account at <a href="https://clerk.com" target="_blank">https://clerk.com</a></p>
        </div>
      `;
    }
    throw new Error('Missing Clerk publishable key. Set VITE_CLERK_PUBLISHABLE_KEY in your environment');
  }
}

// Provide a fallback when key is invalid for testing (empty string)
const actualKey = PUBLISHABLE_KEY.trim() ? PUBLISHABLE_KEY : null;

// Create the React root and render the app with ClerkProvider
createRoot(document.getElementById("root")!).render(
  actualKey ? (
    <ClerkProvider publishableKey={actualKey}>
      <App />
    </ClerkProvider>
  ) : (
    <div style={{padding: '2rem', fontFamily: 'system-ui', maxWidth: '600px', margin: '0 auto'}}>
      <h1>Authentication Not Configured</h1>
      <p>Please add a valid Clerk publishable key to continue.</p>
      <p>Set <code>VITE_CLERK_PUBLISHABLE_KEY</code> in your <code>.env</code> file.</p>
    </div>
  )
);
