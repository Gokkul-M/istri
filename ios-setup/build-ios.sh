#!/bin/bash

# ========================================
# ShineCycle iOS IPA Build Script
# ========================================
# This script builds a release IPA for iOS
# Usage: ./build-ios.sh
# Requirements: macOS with Xcode installed

set -e  # Exit on error

echo "🍎 Building ShineCycle iOS App..."
echo "======================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if running on macOS
if [[ "$OSTYPE" != "darwin"* ]]; then
    echo -e "${RED}❌ Error: iOS apps can only be built on macOS${NC}"
    echo "Please use a Mac with Xcode installed to build iOS apps."
    exit 1
fi

# Check if Xcode is installed
if ! command -v xcodebuild &> /dev/null; then
    echo -e "${RED}❌ Error: Xcode is not installed${NC}"
    echo "Please install Xcode from the App Store."
    exit 1
fi

# Check if ios folder exists
if [ ! -d "ios" ]; then
    echo -e "${YELLOW}⚠ iOS platform not initialized${NC}"
    echo -e "${BLUE}Initializing iOS platform...${NC}"
    npx cap add ios
    echo -e "${GREEN}✓ iOS platform initialized${NC}"
    echo ""
fi

# Step 1: Build web app
echo -e "${BLUE}🔨 Step 1/6: Building optimized web app...${NC}"
npm run build
echo -e "${GREEN}✓ Web build complete${NC}"
echo ""

# Step 2: Sync with Capacitor
echo -e "${BLUE}🔄 Step 2/6: Syncing with Capacitor...${NC}"
npx cap sync ios
echo -e "${GREEN}✓ Capacitor sync complete${NC}"
echo ""

# Step 3: Install CocoaPods dependencies
echo -e "${BLUE}📦 Step 3/6: Installing iOS dependencies (CocoaPods)...${NC}"
cd ios/App
pod install
cd ../..
echo -e "${GREEN}✓ Dependencies installed${NC}"
echo ""

# Step 4: Set build configuration
echo -e "${BLUE}⚙️  Step 4/6: Configuring build settings...${NC}"
SCHEME="App"
WORKSPACE="ios/App/App.xcworkspace"
CONFIGURATION="Release"
ARCHIVE_PATH="ios/App/build/App.xcarchive"
EXPORT_PATH="ios/App/build"
echo -e "${GREEN}✓ Configuration set${NC}"
echo ""

# Step 5: Build and Archive
echo -e "${BLUE}🏗️  Step 5/6: Building and archiving iOS app...${NC}"
echo "   This may take several minutes..."
echo "   Make sure your signing certificate and provisioning profile are configured in Xcode."
xcodebuild -workspace "$WORKSPACE" \
           -scheme "$SCHEME" \
           -configuration "$CONFIGURATION" \
           -archivePath "$ARCHIVE_PATH" \
           clean archive
echo -e "${GREEN}✓ Archive created${NC}"
echo ""

# Step 6: Export IPA
echo -e "${BLUE}📱 Step 6/6: Exporting IPA file...${NC}"
if [ -f "ios-setup/exportOptions.plist" ]; then
    # Copy exportOptions to ios/App for easy reference
    cp ios-setup/exportOptions.plist ios/App/exportOptions.plist
    
    echo "   Using export options from ios-setup/exportOptions.plist"
    echo -e "${YELLOW}   ⚠ Make sure you've updated YOUR_TEAM_ID_HERE in exportOptions.plist${NC}"
    
    xcodebuild -exportArchive \
               -archivePath "$ARCHIVE_PATH" \
               -exportPath "$EXPORT_PATH" \
               -exportOptionsPlist "ios/App/exportOptions.plist"
    echo -e "${GREEN}✓ IPA export complete${NC}"
else
    echo -e "${YELLOW}⚠ No exportOptions.plist found - please configure signing first${NC}"
    echo -e "${YELLOW}   Copy ios-setup/exportOptions.plist.example to ios-setup/exportOptions.plist${NC}"
    echo -e "${YELLOW}   Update with your Apple Team ID and provisioning profile${NC}"
    echo ""
    echo -e "${BLUE}   To export manually:${NC}"
    echo "   1. Open Xcode: npx cap open ios"
    echo "   2. Product > Archive"
    echo "   3. Distribute App > Choose method"
    exit 1
fi
echo ""

# Show output location
echo "======================================"
echo -e "${GREEN}🎉 Build Successful!${NC}"
echo "======================================"
echo ""
echo -e "📦 Output Location:"
echo -e "   Archive: ${BLUE}$ARCHIVE_PATH${NC}"
if [ -d "$EXPORT_PATH" ]; then
    echo -e "   Export:  ${BLUE}$EXPORT_PATH${NC}"
    # Find IPA file
    IPA_FILE=$(find "$EXPORT_PATH" -name "*.ipa" -type f | head -n 1)
    if [ -n "$IPA_FILE" ]; then
        IPA_SIZE=$(du -h "$IPA_FILE" | cut -f1)
        echo -e "   IPA:     ${BLUE}$IPA_FILE${NC}"
        echo -e "   Size:    ${YELLOW}$IPA_SIZE${NC}"
    fi
fi
echo ""

# Next steps
echo -e "${BLUE}📲 Next Steps:${NC}"
echo "   1. Open Xcode: npx cap open ios"
echo "   2. Configure signing in Xcode (Signing & Capabilities)"
echo "   3. Select your development team"
echo "   4. Archive for distribution: Product > Archive"
echo "   5. Distribute to App Store or TestFlight"
echo ""
echo -e "${BLUE}🧪 For Testing:${NC}"
echo "   - Install on connected device via Xcode"
echo "   - Use TestFlight for beta testing"
echo "   - Use ad-hoc distribution for limited devices"
echo ""

echo -e "${GREEN}✅ Build process complete!${NC}"
