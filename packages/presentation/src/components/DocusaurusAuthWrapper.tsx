import React, { useEffect, useState } from 'react';

interface DocusaurusAuthWrapperProps {
  children: React.ReactNode;
}

const DocusaurusAuthWrapper = ({ children }: DocusaurusAuthWrapperProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get the token from URL parameters
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (!token) {
      setIsLoading(false);
      return;
    }

    // Verify the token
    try {
      // Parse the token
      const [headerB64, payloadB64] = token.split('.');
      
      // Decode the payload
      const payload = JSON.parse(atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/')));
      
      // Check if token is expired
      const currentTime = Math.floor(Date.now() / 1000);
      if (payload.exp < currentTime) {
        console.error('Token expired');
        setIsLoading(false);
        return;
      }
      
      // Token is valid
      setIsAuthenticated(true);
      
      // Store the token in localStorage for future use
      localStorage.setItem('docusaurus_auth_token', token);
      
      // Remove the token from URL to keep it clean
      const url = new URL(window.location.href);
      url.searchParams.delete('token');
      window.history.replaceState({}, document.title, url.toString());
    } catch (error) {
      console.error('Invalid token:', error);
    }
    
    setIsLoading(false);
  }, []);

  // Check for token in localStorage on initial load
  useEffect(() => {
    const storedToken = localStorage.getItem('docusaurus_auth_token');
    
    if (storedToken && !isAuthenticated) {
      try {
        // Parse the token
        const [headerB64, payloadB64] = storedToken.split('.');
        
        // Decode the payload
        const payload = JSON.parse(atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/')));
        
        // Check if token is expired
        const currentTime = Math.floor(Date.now() / 1000);
        if (payload.exp < currentTime) {
          localStorage.removeItem('docusaurus_auth_token');
        } else {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Invalid stored token:', error);
        localStorage.removeItem('docusaurus_auth_token');
      }
    }
    
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="auth-loading">
        <p>Verifying authentication...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="auth-error">
        <h1>Authentication Required</h1>
        <p>You need to be authenticated to view this documentation.</p>
        <p>Please log in through the main application to access these docs.</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default DocusaurusAuthWrapper;
