# Easy APK Build Guide

## Super Simple Method (Recommended)

### Step 1: Push to GitHub
\`\`\`bash
git add .
git commit -m "Update app"
git push
\`\`\`

### Step 2: Download APK
1. Go to your GitHub repository
2. Click on "Actions" tab
3. Click on the latest workflow run
4. Scroll down to "Artifacts"
5. Download "trundle-app-debug"
6. Unzip the file to get your APK

### Step 3: Install on Phone
1. Transfer the APK to your Android phone
2. Open the APK file on your phone
3. Allow "Install from Unknown Sources" if prompted
4. Install and enjoy!

---

## Alternative: Local Build (If you have Android Studio)

### One-Time Setup
\`\`\`bash
npm install
npx cap add android
\`\`\`

### Build APK
\`\`\`bash
npm run build
npx cap sync android
npx cap open android
\`\`\`

Then in Android Studio:
1. Wait for Gradle sync to complete
2. Click "Build" → "Build Bundle(s) / APK(s)" → "Build APK(s)"
3. APK will be at: `android/app/build/outputs/apk/debug/app-debug.apk`

---

## Troubleshooting

**GitHub Actions fails?**
- Make sure you've pushed all files
- Check the Actions tab for error logs

**APK won't install?**
- Enable "Install from Unknown Sources" in Android settings
- Make sure you downloaded the debug APK

**App crashes on phone?**
- Check that location permissions are granted
- Make sure you're using Android 8.0 or higher

---

## What Gets Built

The GitHub Actions workflow automatically:
- Installs all dependencies
- Builds the Next.js app
- Syncs with Capacitor
- Compiles the Android APK
- Uploads it for download

No Android Studio or local setup required!
