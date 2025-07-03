# Deployment Guide - Meme Match Game

## Option 1: Vercel (Recommended - Free)

### Step 1: Prepare for Deployment
1. Download your project ZIP file from Replit
2. Extract it to your local machine
3. Make sure you have a GitHub account

### Step 2: Push to GitHub
1. Create a new repository on GitHub
2. Upload your project files to the repository
3. Make sure all files are committed

### Step 3: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com) and sign up with GitHub
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will automatically detect it's a Vite project
5. Deploy settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist/public`
   - **Install Command**: `npm install`

### Step 4: Configure Build
The `vercel.json` file is already configured for static deployment.

---

## Option 2: Netlify (Free Alternative)

### Step 1: Prepare
1. Download project ZIP from Replit
2. Extract locally

### Step 2: Deploy
1. Go to [netlify.com](https://netlify.com)
2. Drag and drop your project folder OR connect via GitHub
3. Build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist/public`

---

## Option 3: GitHub Pages (Free)

### Step 1: Modify for GitHub Pages
1. Add to package.json scripts: `"deploy": "npm run build && gh-pages -d dist/public"`
2. Install gh-pages: `npm install --save-dev gh-pages`

### Step 2: Deploy
1. Push code to GitHub
2. Run `npm run deploy`
3. Enable GitHub Pages in repository settings

---

## Important Notes

- **No Backend Required**: Your game runs entirely in the browser with local storage for game state
- **No Database Needed**: All game logic is client-side
- **Static Hosting**: Perfect for free hosting platforms
- **Fast Loading**: Optimized build with modern web technologies

## Troubleshooting

If build fails:
1. Make sure Node.js version is 18 or higher
2. Run `npm install` before building
3. Check that all dependencies are installed

Your game will be available at a public URL once deployed!