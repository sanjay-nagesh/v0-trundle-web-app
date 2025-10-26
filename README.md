# Trundle - AI Storytelling Road Trip App

*Automatically synced with your [v0.app](https://v0.app) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/sanjayn-4810s-projects/v0-trundle-web-app)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/projects/o2fuqdZl9JO)

## Overview

Trundle is a frontend-only React/Next.js application that provides an immersive storytelling experience during road trips. The app uses real-time location tracking to generate contextual stories and plays them automatically as you drive.

**This is a frontend-only application.** The backend API is being developed separately. See [BACKEND_INTEGRATION.md](./BACKEND_INTEGRATION.md) for integration details.

## Features

- **Live Location Tracking**: Real-time GPS tracking using browser Geolocation API
- **Automatic Story Playback**: Stories play automatically as you travel
- **Interactive Map**: Visual journey tracking with animated location markers
- **Text-to-Speech**: Browser-based audio narration of stories
- **Journey Stats**: Track distance traveled and stories heard
- **Progressive Web App**: Installable on Android devices

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **UI Library**: React 19 with TypeScript
- **Styling**: Tailwind CSS v4
- **Components**: shadcn/ui
- **Animations**: Framer Motion
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

\`\`\`bash
# Clone the repository
git clone https://github.com/sanjayn-4810s-projects/v0-trundle-web-app.git

# Navigate to project directory
cd v0-trundle-web-app

# Install dependencies
npm install

# Run development server
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Building for Production

\`\`\`bash
# Create production build
npm run build

# Start production server
npm start
\`\`\`

## Project Structure

\`\`\`
app/
├── page.tsx              # Onboarding/Login screen
├── home/page.tsx         # Dashboard with journey stats
├── journey/page.tsx      # Live journey tracking with map
├── now-playing/page.tsx  # Story player interface
├── map/page.tsx          # Journey history map
├── library/page.tsx      # Story library
├── profile/page.tsx      # User profile settings
└── globals.css           # Global styles and design tokens

components/
└── bottom-nav.tsx        # Bottom navigation component

public/
├── manifest.json         # PWA manifest
├── icon-192.jpg          # App icon (192x192)
└── icon-512.jpg          # App icon (512x512)
\`\`\`

## Current Implementation

The app currently uses:

- **Browser Geolocation API** for location tracking
- **Browser SpeechSynthesis API** for text-to-speech
- **Local story library** with 8 pre-written stories
- **Mock data** for user stats and authentication

## Backend Integration

This frontend is ready to integrate with your backend API. See [BACKEND_INTEGRATION.md](./BACKEND_INTEGRATION.md) for:

- Required API endpoints
- Request/response formats
- Authentication flow
- Integration examples
- Testing guidelines

## Building for Android

The app can be converted to a native Android APK using Capacitor. See [BUILD_ANDROID_APK.md](./BUILD_ANDROID_APK.md) for detailed instructions.

Quick start:
\`\`\`bash
npm run build
npx cap add android
npx cap sync
npx cap open android
\`\`\`

## Deployment

Your project is live at:

**[https://vercel.com/sanjayn-4810s-projects/v0-trundle-web-app](https://vercel.com/sanjayn-4810s-projects/v0-trundle-web-app)**

### Deploy to Vercel

\`\`\`bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
\`\`\`

## Development

Continue building your app on:

**[https://v0.app/chat/projects/o2fuqdZl9JO](https://v0.app/chat/projects/o2fuqdZl9JO)**

## How It Works

1. Create and modify your project using [v0.app](https://v0.app)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository

## License

MIT
