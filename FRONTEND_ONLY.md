# Trundle - Frontend Only

This is a **frontend-only** React application. All backend functionality will be integrated separately.

## Current Features

### Pages
- **Onboarding** (`/`) - Sign up/login screen
- **Home** (`/home`) - Dashboard with journey stats
- **Journey** (`/journey`) - Live location tracking with map and audio playback
- **Now Playing** (`/now-playing`) - Current story display
- **Map** (`/map`) - Journey history map
- **Library** (`/library`) - Story collection
- **Profile** (`/profile`) - User settings

### Frontend Functionality
- Browser-based geolocation tracking
- Browser-based text-to-speech (Web Speech API)
- Built-in story library (8 stories)
- Responsive mobile-first design
- Smooth animations with Framer Motion

## Tech Stack
- Next.js 15 (static export)
- React 19
- TypeScript
- Tailwind CSS v4
- Framer Motion
- Lucide React icons

## Development

\`\`\`bash
npm install
npm run dev
\`\`\`

Visit http://localhost:3000

## Building for Android

This app is configured for static export and can be built as an Android APK using Capacitor.

See `BUILD_ANDROID_APK.md` for detailed instructions.

## Backend Integration

The backend team will integrate:
- User authentication API
- Story generation API
- Text-to-speech API
- User data persistence

All frontend components are ready for backend integration with clearly defined data structures.
