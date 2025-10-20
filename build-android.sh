#!/bin/bash

# ========================================
# ShineCycle Android APK Build Script
# ========================================
# This script builds a release APK for Android
# Usage: ./build-android.sh

set -e  # Exit on error

echo "🚀 Building ShineCycle Android App..."
echo "======================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Clean previous builds
echo -e "${BLUE}📦 Step 1/5: Cleaning previous builds...${NC}"
cd android
./gradlew clean
cd ..
echo -e "${GREEN}✓ Clean complete${NC}"
echo ""

# Step 2: Build web app
echo -e "${BLUE}🔨 Step 2/5: Building optimized web app...${NC}"
npm run build
echo -e "${GREEN}✓ Web build complete${NC}"
echo ""

# Step 3: Sync with Capacitor
echo -e "${BLUE}🔄 Step 3/5: Syncing with Capacitor...${NC}"
npx cap sync android
echo -e "${GREEN}✓ Capacitor sync complete${NC}"
echo ""

# Step 4: Check for keystore
echo -e "${BLUE}🔐 Step 4/5: Checking signing configuration...${NC}"
if [ -f "android/app/keystore.properties" ]; then
    echo -e "${GREEN}✓ Keystore configuration found${NC}"
    BUILD_TYPE="signed release"
else
    echo -e "${YELLOW}⚠ No keystore.properties found - building unsigned APK${NC}"
    echo -e "${YELLOW}  For production, create android/app/keystore.properties${NC}"
    BUILD_TYPE="unsigned release"
fi
echo ""

# Step 5: Build APK
echo -e "${BLUE}📱 Step 5/5: Building Android APK ($BUILD_TYPE)...${NC}"
cd android
./gradlew assembleRelease
cd ..
echo -e "${GREEN}✓ APK build complete!${NC}"
echo ""

# Show output location
echo "======================================"
echo -e "${GREEN}🎉 Build Successful!${NC}"
echo "======================================"
echo ""
echo -e "📦 APK Location:"
if [ -f "android/app/build/outputs/apk/release/app-release.apk" ]; then
    APK_SIZE=$(du -h android/app/build/outputs/apk/release/app-release.apk | cut -f1)
    echo -e "   ${BLUE}android/app/build/outputs/apk/release/app-release.apk${NC}"
    echo -e "   Size: ${YELLOW}$APK_SIZE${NC}"
else
    echo -e "   ${RED}APK not found at expected location${NC}"
    exit 1
fi
echo ""

# Installation instructions
echo -e "${BLUE}📲 To install on your device:${NC}"
echo "   1. Connect your Android device via USB"
echo "   2. Enable Developer Mode and USB Debugging"
echo "   3. Run: adb install android/app/build/outputs/apk/release/app-release.apk"
echo ""
echo -e "${BLUE}🌐 Or upload to:${NC}"
echo "   - Google Play Console (for Play Store)"
echo "   - Firebase App Distribution (for beta testing)"
echo "   - Send APK file directly to users"
echo ""

echo -e "${GREEN}✅ Build process complete!${NC}"
