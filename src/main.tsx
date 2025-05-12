
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
          <p>You need to provide a Clerk publishable key to use authentication features.</p>
          <h2>How to fix this:</h2>
          <ol>
            <li>Create a <code>.env</code> file in the project root if it doesn't exist</li>
            <li>Add the following line to your .env file:<br>
              <code>VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key</code>
            </li>
            <li>Get your Clerk publishable key from the <a href="https://dashboard.clerk.com/last-active?path=api-keys" target="_blank">Clerk dashboard</a></li>
            <li>Restart your development server</li>
          </ol>
          <p>See <a href="https://docs.lovable.dev/user-guides/environment-variables" target="_blank">Lovable documentation</a> for more details on environment variables.</p>
        </div>
      `;
    }
    throw new Error('Missing Clerk publishable key. Set VITE_CLERK_PUBLISHABLE_KEY in your environment');
  }
}

// Create the React root and render the app with ClerkProvider
createRoot(document.getElementById("root")!).render(
  <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
    <App />
  </ClerkProvider>
);
