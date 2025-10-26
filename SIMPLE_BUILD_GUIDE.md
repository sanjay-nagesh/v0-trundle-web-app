# Simple APK Build Guide

## Prerequisites
You need to install:
1. **Node.js** - Download from https://nodejs.org
2. **Android Studio** - Download from https://developer.android.com/studio
3. **Java JDK 17** - Download from https://adoptium.net

## One-Time Setup

1. Open Android Studio
2. Go to Settings → Appearance & Behavior → System Settings → Android SDK
3. Install "Android SDK Platform 33" and "Android SDK Build-Tools"
4. Note the SDK location (you'll need this)

5. Set environment variable:
   - **Mac/Linux**: Add to `~/.bashrc` or `~/.zshrc`:
     \`\`\`bash
     export ANDROID_HOME=/path/to/your/Android/sdk
     export PATH=$PATH:$ANDROID_HOME/platform-tools
     \`\`\`
   - **Windows**: Add to System Environment Variables:
     \`\`\`
     ANDROID_HOME=C:\Users\YourName\AppData\Local\Android\Sdk
     \`\`\`

## Build APK (Every Time)

### Option 1: Using the Script (Mac/Linux)
\`\`\`bash
chmod +x build-apk.sh
./build-apk.sh
\`\`\`

### Option 2: Manual Steps (All Platforms)
\`\`\`bash
# 1. Install dependencies
npm install

# 2. Build the app
npm run build

# 3. Sync with Capacitor
npx cap sync android

# 4. Build APK
cd android
./gradlew assembleDebug    # Mac/Linux
gradlew.bat assembleDebug  # Windows
cd ..

# 5. Find your APK at:
# android/app/build/outputs/apk/debug/app-debug.apk
\`\`\`

## Install on Phone

1. Copy `app-debug.apk` to your phone
2. Open the file on your phone
3. Tap "Install"
4. If prompted, enable "Install from unknown sources"
5. Done!

## Troubleshooting

**"ANDROID_HOME not set"**
- Make sure you set the environment variable and restart your terminal

**"SDK not found"**
- Install Android SDK through Android Studio

**"Gradle build failed"**
- Open the `android` folder in Android Studio
- Let it sync and download dependencies
- Try building again
