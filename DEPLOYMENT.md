# Trundle - Deployment Guide

## 🚀 Quick Start

Your Trundle app is ready to deploy! Here's how to get it running on your phone.

## Option 1: Progressive Web App (PWA) - Recommended ✨

This is the **easiest way** to use Trundle on your Android phone like a native app.

### Steps:

1. **Deploy to Vercel** (Already done! ✅)
   - Your app is live at: https://vercel.com/sanjayn-4810s-projects/v0-trundle-web-app

2. **Install on Android:**
   - Open Chrome on your Android phone
   - Visit your deployed URL
   - Tap the menu (⋮) → "Add to Home screen"
   - Tap "Add" → The app icon will appear on your home screen
   - Open it like any other app!

### PWA Features:
- ✅ Works offline
- ✅ Full-screen experience
- ✅ App icon on home screen
- ✅ Push notifications (future)
- ✅ Background audio playback
- ✅ GPS location tracking

## Option 2: Native Android App (APK)

If you want a true native Android app, you can use Capacitor to wrap the web app.

### Prerequisites:
- Node.js installed
- Android Studio installed
- Java JDK installed

### Steps:

1. **Install Capacitor:**
\`\`\`bash
npm install @capacitor/core @capacitor/cli
npm install @capacitor/android
npx cap init
\`\`\`

2. **Configure Capacitor:**
Edit `capacitor.config.json`:
\`\`\`json
{
  "appId": "com.trundle.app",
  "appName": "Trundle",
  "webDir": "out",
  "bundledWebRuntime": false
}
\`\`\`

3. **Build the Next.js app:**
\`\`\`bash
npm run build
npx next export
\`\`\`

4. **Add Android platform:**
\`\`\`bash
npx cap add android
npx cap sync
\`\`\`

5. **Open in Android Studio:**
\`\`\`bash
npx cap open android
\`\`\`

6. **Build APK:**
- In Android Studio: Build → Build Bundle(s) / APK(s) → Build APK(s)
- APK will be in: `android/app/build/outputs/apk/debug/app-debug.apk`

7. **Install on phone:**
- Transfer the APK to your phone
- Enable "Install from unknown sources" in Settings
- Tap the APK to install

## 🎯 Current Features

### ✅ Working Features:
- Location-based storytelling
- Real-time GPS tracking
- Automatic story generation
- Text-to-speech audio playback
- Journey tracking (distance, stories played)
- Beautiful UI with animations
- Offline support (PWA)

### 🔧 Backend:
- `/api/generate-story` - Generates location-based stories using GPT-4
- `/api/text-to-speech` - Converts text to speech using OpenAI TTS
- Fallback stories when API is unavailable
- Browser TTS fallback when OpenAI TTS unavailable

## 📱 Testing on Phone

1. **Grant Permissions:**
   - Location: Required for GPS tracking
   - Audio: Required for story playback

2. **Start Journey:**
   - Tap "Start Journey" on home screen
   - Allow location access
   - Stories will auto-play as you drive

3. **Controls:**
   - Play/Pause button
   - Mute/Unmute button
   - End Journey button

## 🔑 Optional: Add OpenAI API Key

For better story generation and voice quality:

1. Get API key from: https://platform.openai.com/api-keys
2. Add to Vercel environment variables:
   - Go to your Vercel project settings
   - Add `OPENAI_API_KEY` with your key
   - Redeploy

Without API key, the app uses:
- Fallback stories (pre-written)
- Browser text-to-speech (works but lower quality)

## 🎨 Customization

### Colors:
Edit `app/globals.css` to change the color scheme:
- `--color-primary`: Main green color (#5a6f4e)
- `--color-secondary`: Brown accent (#8b5e3c)
- `--color-background`: Beige background (#f6f0e8)

### Fonts:
Edit `app/layout.tsx` to change fonts:
- Currently using Playfair Display (headings) and Inter (body)

## 🐛 Troubleshooting

### Location not working:
- Make sure you're using HTTPS (required for geolocation)
- Check browser permissions
- Try on actual device (not emulator)

### Audio not playing:
- Check device volume
- Unmute the app
- Try browser TTS fallback

### App not installing (PWA):
- Make sure you're using Chrome/Edge
- Check that manifest.json is accessible
- Clear browser cache and try again

## 📦 What's Included

\`\`\`
trundle-web-app/
├── app/
│   ├── page.tsx              # Onboarding screen
│   ├── home/page.tsx         # Home dashboard
│   ├── journey/page.tsx      # Active journey screen
│   ├── map/page.tsx          # Journey map view
│   ├── library/page.tsx      # Story library
│   ├── profile/page.tsx      # User profile
│   ├── api/
│   │   ├── generate-story/   # Story generation API
│   │   └── text-to-speech/   # TTS API
│   ├── layout.tsx            # Root layout
│   ├── globals.css           # Global styles
│   ├── sw.ts                 # Service worker
│   └── register-sw.tsx       # SW registration
├── components/
│   ├── bottom-nav.tsx        # Bottom navigation
│   └── ui/                   # shadcn components
├── public/
│   ├── manifest.json         # PWA manifest
│   ├── icon-192.png          # App icon (192x192)
│   └── icon-512.png          # App icon (512x512)
└── next.config.mjs           # Next.js config
\`\`\`

## 🎉 You're Done!

Your Trundle app is now ready to use! Just deploy it and install it on your phone as a PWA. Happy road tripping! 🚗✨
