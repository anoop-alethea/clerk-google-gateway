
# Deployment Guidelines

This document outlines how to deploy this application to production.

## Environment Setup

1. Create a `.env` file for local development based on `.env.example`
2. For production, set the following environment variables on your hosting platform:

```
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_DOCUSAURUS_SITE_URL=https://your-production-docusaurus-site.com
VITE_DOCUSAURUS_JWT_SECRET=your_secure_production_jwt_secret
```

## Production Security Considerations

1. **JWT Secret**: Generate a strong, random secret for `VITE_DOCUSAURUS_JWT_SECRET` in production
2. **CORS Settings**: Ensure your Docusaurus site has proper CORS settings to accept authentication tokens
3. **HTTPS**: Both the main app and Docusaurus site should use HTTPS

## Deployment Options

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add the environment variables in the Vercel project settings
3. Deploy the project

### Netlify

1. Connect your GitHub repository to Netlify
2. Add the environment variables in the Netlify project settings 
3. Deploy the project

### Traditional Hosting

1. Build the app with `npm run build`
2. Deploy the contents of the `dist` folder to your web server
3. Configure your web server to serve `index.html` for all routes (for SPA routing)
4. Ensure environment variables are set on your server

## Production Checklist

- [ ] Set proper environment variables
- [ ] Generate a secure JWT secret
- [ ] Test authentication flows
- [ ] Verify Docusaurus integration
- [ ] Configure proper CORS settings
- [ ] Enable HTTPS
- [ ] Set up monitoring and logging
