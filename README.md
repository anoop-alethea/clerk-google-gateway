
# Secured Docusaurus Documentation

This project implements a JWT token-based authentication system to secure access to a Docusaurus documentation site.

## Integration Steps for Docusaurus

To integrate this authentication system with your Docusaurus site, follow these steps:

### 1. Copy the Authentication Wrapper

Copy the `DocusaurusAuthWrapper.tsx` component to your Docusaurus project's `src/components` directory.

### 2. Wrap Your Docusaurus App

Modify your Docusaurus main app component to use the authentication wrapper. In your Docusaurus project, create or modify `src/theme/Root.js`:

```jsx
import React from 'react';
import DocusaurusAuthWrapper from '@site/src/components/DocusaurusAuthWrapper';

// Default implementation, wraps the site with the auth component
function Root({children}) {
  return (
    <DocusaurusAuthWrapper>
      {children}
    </DocusaurusAuthWrapper>
  );
}

export default Root;
```

### 3. Update Your JWT Secret

Make sure the JWT secret in your React app (in `docusaurusAuth.ts`) matches the one you'll use to verify tokens in Docusaurus.

Consider using environment variables for the JWT secret in both applications.

### 4. Add Styling for Auth Messages

Add CSS for the authentication loading and error states in your Docusaurus custom CSS file.

### 5. Configure CORS (if needed)

If your React app and Docusaurus site are on different domains, you may need to configure CORS settings.

## Production Deployment Notes

1. For production deployment, update the `docusaurusBaseUrl` in `docusaurusAuth.ts` to your actual Docusaurus site URL.
2. Use a strong random secret key for JWT signing instead of the placeholder "your-jwt-secret-key".
3. Consider storing the JWT secret in environment variables rather than in the code.
4. Use HTTPS for all communications to prevent token interception.

## Important Security Considerations

1. This implementation uses Web Crypto API, which is compatible with modern browsers.
2. The token is stored in localStorage, which provides persistence across page refreshes.
3. For additional security, implement server-side verification.
4. Set appropriate token expiry times based on your security requirements.

## Further Customization

You can customize the authentication flow by:

1. Adding role-based access control
2. Implementing different access levels for different documentation sections
3. Adding a custom login page within Docusaurus
