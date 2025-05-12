
import { render } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ProtectedRoute from './ProtectedRoute';

// Mock the Clerk useAuth hook
vi.mock('@clerk/clerk-react', () => ({
  useAuth: vi.fn()
}));

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading state when authentication is loading', () => {
    // Mock the useAuth hook to return isLoaded: false
    const useAuthMock = vi.spyOn(require('@clerk/clerk-react'), 'useAuth');
    useAuthMock.mockReturnValue({
      isLoaded: false,
      isSignedIn: false
    });
    
    const { getByText } = render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );
    
    expect(getByText(/loading/i)).toBeInTheDocument();
  });

  it('redirects to login when user is not authenticated', () => {
    // Mock the useAuth hook to return isSignedIn: false
    const useAuthMock = vi.spyOn(require('@clerk/clerk-react'), 'useAuth');
    useAuthMock.mockReturnValue({
      isLoaded: true,
      isSignedIn: false
    });
    
    const { getByText } = render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );
    
    expect(getByText(/navigate to: \/login/i)).toBeInTheDocument();
  });

  it('renders children when user is authenticated', () => {
    // Mock the useAuth hook to return isSignedIn: true
    const useAuthMock = vi.spyOn(require('@clerk/clerk-react'), 'useAuth');
    useAuthMock.mockReturnValue({
      isLoaded: true,
      isSignedIn: true
    });
    
    const { getByText } = render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );
    
    expect(getByText('Protected Content')).toBeInTheDocument();
  });
});
