
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import React from 'react';

// Mock Supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({ 
        data: { session: null },
        error: null 
      }),
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      signInWithOAuth: vi.fn(),
      onAuthStateChange: vi.fn().mockReturnValue({ 
        data: { subscription: { unsubscribe: vi.fn() } }
      })
    }
  }
}));

// Mock Clerk
vi.mock('@clerk/clerk-react', () => ({
  useAuth: vi.fn().mockReturnValue({
    isLoaded: true,
    isSignedIn: false
  }),
  useSignIn: vi.fn().mockReturnValue({
    isLoaded: true,
    signIn: {
      create: vi.fn()
    },
    setActive: vi.fn()
  }),
  useSignUp: vi.fn().mockReturnValue({
    isLoaded: true,
    signUp: {
      create: vi.fn(),
      prepareEmailAddressVerification: vi.fn()
    }
  })
}));

// Mock router
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    Navigate: ({ to }: { to: string }) => {
      return React.createElement('div', null, `Navigate to: ${to}`);
    }
  };
});

// Mock sonner toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}));
