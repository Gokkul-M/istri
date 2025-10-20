@echo off
REM ========================================
REM ShineCycle Android APK Build Script (Windows)
REM ========================================
REM This script builds a release APK for Android on Windows
REM Usage: build-android.bat

echo.
echo ========================================
echo Building ShineCycle Android App...
echo ========================================
echo.

REM Step 1: Clean previous builds
echo [Step 1/5] Cleaning previous builds...
cd android
call gradlew.bat clean
cd ..
echo [OK] Clean complete
echo.

REM Step 2: Build web app
echo [Step 2/5] Building optimized web app...
call npm run build
echo [OK] Web build complete
echo.

REM Step 3: Sync with Capacitor
echo [Step 3/5] Syncing with Capacitor...
call npx cap sync android
echo [OK] Capacitor sync complete
echo.

REM Step 4: Check for keystore
echo [Step 4/5] Checking signing configuration...
if exist "android\app\keystore.properties" (
    echo [OK] Keystore configuration found
    set BUILD_TYPE=signed release
) else (
    echo [WARNING] No keystore.properties found - building unsigned APK
    echo           For production, create android\app\keystore.properties
    set BUILD_TYPE=unsigned release
)
echo.

REM Step 5: Build APK
echo [Step 5/5] Building Android APK (%BUILD_TYPE%)...
cd android
call gradlew.bat assembleRelease
cd ..
echo [OK] APK build complete!
echo.

REM Show output location
echo ========================================
echo Build Successful!
echo ========================================
echo.
echo APK Location:
if exist "android\app\build\outputs\apk\release\app-release.apk" (
    echo    android\app\build\outputs\apk\release\app-release.apk
) else (
    echo    [ERROR] APK not found at expected location
    exit /b 1
)
echo.

REM Installation instructions
echo To install on your device:
echo    1. Connect your Android device via USB
echo    2. Enable Developer Mode and USB Debugging
echo    3. Run: adb install android\app\build\outputs\apk\release\app-release.apk
echo.
echo Or upload to:
echo    - Google Play Console (for Play Store)
echo    - Firebase App Distribution (for beta testing)
echo    - Send APK file directly to users
echo.

echo Build process complete!
pause
