# 🚀 Deployment Guide - Vapi AI Phone App

## GitHub Setup

1. **Initialize Git Repository** (if not already done)
   ```bash
   git init
   git add .
   git commit -m \"Initial commit: Vapi AI Phone App\"
   ```

2. **Create GitHub Repository**
   - Go to [GitHub](https://github.com/new)
   - Repository name: `vapi-phone-app`
   - Description: \"Modern AI phone interface using Vapi SDK\"
   - Set to Public or Private
   - Don't initialize with README (we already have one)

3. **Push to GitHub**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/vapi-phone-app.git
   git branch -M main
   git push -u origin main
   ```

## Vercel Deployment

### Option 1: One-Click Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/vapi-phone-app)

### Option 2: Manual Deployment

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```
   
   Follow the prompts:
   - Link to existing project? `N`
   - Project name: `vapi-phone-app` (or your preferred name)
   - Directory: `./` (current directory)

4. **Set Environment Variables**
   After deployment, go to your Vercel dashboard:
   - Navigate to your project
   - Go to Settings → Environment Variables
   - Add: `VAPI_PUBLIC_KEY` with your Vapi public key

5. **Redeploy** (after setting env vars)
   ```bash
   vercel --prod
   ```

## Environment Variables Needed

```
VAPI_PUBLIC_KEY=your_vapi_public_key_here
```

## Post-Deployment Checklist

- [ ] App loads correctly
- [ ] Smartphone interface displays properly
- [ ] Call button is functional
- [ ] Vapi connection works
- [ ] Audio permissions work in browser
- [ ] Mobile responsive design works
- [ ] HTTPS enabled (automatic with Vercel)

## Custom Domain (Optional)

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your custom domain
3. Configure DNS according to Vercel instructions

## Troubleshooting

### Common Issues:

**Build Errors:**
- Check that all dependencies are in package.json
- Verify TypeScript compilation: `npm run type-check`

**Vapi Connection Issues:**
- Verify `VAPI_PUBLIC_KEY` is set correctly
- Check browser console for errors
- Ensure HTTPS is enabled (required for microphone access)

**Mobile Issues:**
- Test on actual devices
- Check browser compatibility
- Verify touch interactions work

## Security Notes

- Never commit `.env.local` to Git
- Use Vercel environment variables for production secrets
- Vapi public key is safe to use client-side
- Consider implementing rate limiting for production use

## Performance Optimization

- Images are optimized automatically by Next.js
- Static assets cached by Vercel CDN
- Turbopack enabled for faster builds
- Consider adding analytics (Vercel Analytics)

---

Your app should now be live and accessible worldwide! 🎉