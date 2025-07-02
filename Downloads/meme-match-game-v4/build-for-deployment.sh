#!/bin/bash

# Build script for deploying Meme Match game

echo "🎮 Building Meme Match for deployment..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building project..."
npm run build

echo "✅ Build complete! Your game is ready for deployment."
echo "📁 Built files are in: dist/public/"
echo ""
echo "🚀 Next steps:"
echo "1. Upload to Vercel, Netlify, or your preferred hosting service"
echo "2. Set build command to: npm run build"
echo "3. Set output directory to: dist/public"
echo ""
echo "🌟 Your Meme Match game will be live soon!"