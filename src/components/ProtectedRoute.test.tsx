
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ProtectedRoute from './ProtectedRoute';
import { useAuth } from '@/infrastructure/contexts/AuthContext';

// Mock the useAuth hook
vi.mock('@/infrastructure/contexts/AuthContext', () => ({
  useAuth: vi.fn()
}));

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading state when authentication is loading', () => {
    (useAuth as any).mockReturnValue({
      user: null,
      isLoading: true
    });
    
    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );
    
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('redirects to login when user is not authenticated', () => {
    (useAuth as any).mockReturnValue({
      user: null,
      isLoading: false
    });
    
    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );
    
    expect(screen.getByText(/navigate to: \/login/i)).toBeInTheDocument();
  });

  it('renders children when user is authenticated', () => {
    (useAuth as any).mockReturnValue({
      user: { id: '123', email: 'test@example.com' },
      isLoading: false
    });
    
    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );
    
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });
});
