# Build Trundle Android APK

This guide will help you build a native Android APK from your Trundle app.

## Prerequisites

1. **Node.js** (v18 or higher)
2. **Android Studio** (latest version)
3. **Java JDK** (v17 or higher)
4. **Git** (to clone your repository)

## Step 1: Install Dependencies

\`\`\`bash
npm install
\`\`\`

## Step 2: Build the Next.js App

\`\`\`bash
npm run export
\`\`\`

This creates a static export in the `out` folder.

## Step 3: Initialize Capacitor (First Time Only)

\`\`\`bash
npx cap init
\`\`\`

When prompted:
- App name: `Trundle`
- App ID: `com.trundle.app`
- Web directory: `out`

## Step 4: Add Android Platform (First Time Only)

\`\`\`bash
npx cap add android
\`\`\`

## Step 5: Sync Your Code to Android

Every time you make changes to your web code:

\`\`\`bash
npm run android:sync
\`\`\`

Or use the combined command:

\`\`\`bash
npm run android:build
\`\`\`

This will:
1. Build your Next.js app
2. Sync to Android
3. Open Android Studio

## Step 6: Build APK in Android Studio

1. **Android Studio will open automatically**
2. Wait for Gradle sync to complete (first time takes 5-10 minutes)
3. Click **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
4. Wait for build to complete
5. Click **locate** in the notification to find your APK

Your APK will be at:
\`\`\`
android/app/build/outputs/apk/debug/app-debug.apk
\`\`\`

## Step 7: Install on Your Phone

### Option A: Direct Install via USB
1. Enable **Developer Options** on your Android phone
2. Enable **USB Debugging**
3. Connect phone to computer
4. In Android Studio, click the **Run** button (green play icon)
5. Select your device
6. App will install and launch automatically

### Option B: Transfer APK File
1. Copy `app-debug.apk` to your phone
2. Open the file on your phone
3. Allow installation from unknown sources if prompted
4. Install and enjoy!

## Troubleshooting

### Gradle Build Failed
- Make sure you have Java JDK 17 installed
- Set JAVA_HOME environment variable
- Run `./gradlew clean` in the android folder

### App Crashes on Launch
- Check Android Studio Logcat for errors
- Make sure all permissions are granted in AndroidManifest.xml

### Location Not Working
- Grant location permissions when app asks
- Enable GPS on your device
- Check that location permissions are in AndroidManifest.xml

## Building Release APK (For Production)

1. Generate a keystore:
\`\`\`bash
keytool -genkey -v -keystore trundle-release.keystore -alias trundle -keyalg RSA -keysize 2048 -validity 10000
\`\`\`

2. Update `capacitor.config.json` with keystore path

3. In Android Studio:
   - **Build** → **Generate Signed Bundle / APK**
   - Select **APK**
   - Choose your keystore
   - Build release APK

4. Your release APK will be at:
\`\`\`
android/app/build/outputs/apk/release/app-release.apk
\`\`\`

## Quick Commands Reference

\`\`\`bash
# Development
npm run dev                 # Run Next.js dev server
npm run build              # Build Next.js app
npm run export             # Export static files

# Android
npm run android:sync       # Sync code to Android
npm run android:build      # Build and open Android Studio
npx cap open android       # Open Android Studio
npx cap sync android       # Sync without building

# Full rebuild
npm run export && npx cap sync android && npx cap open android
\`\`\`

## File Structure

\`\`\`
trundle-app/
├── out/                   # Static export (generated)
├── android/              # Android native project (generated)
├── app/                  # Next.js app code
├── components/           # React components
├── public/              # Static assets
├── capacitor.config.json # Capacitor configuration
└── next.config.mjs      # Next.js configuration
\`\`\`

## Next Steps

1. Test the app thoroughly on your device
2. Add app icon and splash screen
3. Configure permissions in AndroidManifest.xml
4. Build release APK for distribution
5. Publish to Google Play Store (optional)

Enjoy your Trundle Android app!
