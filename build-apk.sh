#!/bin/bash

echo "🚀 Building Trundle Android APK..."
echo ""

# Step 1: Install dependencies
echo "📦 Installing dependencies..."
npm install

# Step 2: Build Next.js app
echo "🔨 Building Next.js app..."
npm run build

# Step 3: Copy to Capacitor
echo "📱 Setting up Capacitor..."
npx cap sync android

# Step 4: Build APK
echo "🏗️  Building APK..."
cd android
./gradlew assembleDebug
cd ..

# Step 5: Copy APK to root
echo "✅ Copying APK to project root..."
cp android/app/build/outputs/apk/debug/app-debug.apk ./trundle.apk

echo ""
echo "✨ Done! Your APK is ready: trundle.apk"
echo "📲 Transfer this file to your Android phone and install it!"
