# 📱 Android App Icons & Branding Guide

Complete guide to configure app icons, splash screens, and branding for ShineCycle Android app.

## Quick Reference

| Asset Type | Recommended Size | Required | Location |
|------------|------------------|----------|----------|
| App Icon | 512x512 PNG | ✅ Yes | Generate all densities |
| Adaptive Icon Foreground | 432x432 PNG | ✅ Yes | Transparent background |
| Adaptive Icon Background | 432x432 PNG | ⚠️ Optional | Solid color or image |
| Splash Screen | 2732x2732 PNG | ⚠️ Optional | Center-focused logo |
| Feature Graphic (Play Store) | 1024x500 PNG | ✅ Yes | For store listing |
| Screenshots | 1080x1920 PNG | ✅ Yes | Minimum 2 required |

---

## App Icon Setup

### Method 1: Using Android Studio (Recommended)

1. **Open Android Project**:
   ```bash
   npm run android:open
   ```

2. **Launch Image Asset Studio**:
   - Right-click `res` folder
   - New → Image Asset
   - Select "Launcher Icons (Adaptive and Legacy)"

3. **Configure Icon**:
   - **Foreground Layer**:
     - Upload 512x512 PNG with transparency
     - This is your main logo
     - Keep 20% padding from edges
   
   - **Background Layer**:
     - Choose solid color: `#1E293B` (ShineCycle navy blue)
     - Or upload 512x512 background image
   
   - **Options**:
     - ✅ Yes → Trim
     - ✅ Yes → Resize
     - Shape: Circle, Square, Rounded Square (choose one)

4. **Generate**:
   - Click "Next" → "Finish"
   - Icons will be auto-generated in all required densities

### Method 2: Using Online Tools

**Option A: AppIcon.co**
1. Visit [appicon.co](https://www.appicon.co/)
2. Upload 1024x1024 PNG icon (transparent background)
3. Select "Android" platform
4. Download zip file
5. Extract to: `android/app/src/main/res/`

**Option B: Android Asset Studio**
1. Visit [romannurik.github.io/AndroidAssetStudio](https://romannurik.github.io/AndroidAssetStudio/icons-launcher.html)
2. Upload source image
3. Configure padding, background color
4. Download generated assets
5. Replace files in `android/app/src/main/res/mipmap-*/`

### Method 3: Manual Icon Creation

**Required Densities**:

| Density | App Icon | Adaptive Foreground | Adaptive Background |
|---------|----------|---------------------|---------------------|
| mdpi | 48x48 | 108x108 | 108x108 |
| hdpi | 72x72 | 162x162 | 162x162 |
| xhdpi | 96x96 | 216x216 | 216x216 |
| xxhdpi | 144x144 | 324x324 | 324x324 |
| xxxhdpi | 192x192 | 432x432 | 432x432 |

**File Locations**:
```
android/app/src/main/res/
├── mipmap-mdpi/
│   ├── ic_launcher.png (48x48)
│   └── ic_launcher_round.png (48x48)
├── mipmap-hdpi/
│   ├── ic_launcher.png (72x72)
│   └── ic_launcher_round.png (72x72)
├── mipmap-xhdpi/
│   ├── ic_launcher.png (96x96)
│   └── ic_launcher_round.png (96x96)
├── mipmap-xxhdpi/
│   ├── ic_launcher.png (144x144)
│   └── ic_launcher_round.png (144x144)
├── mipmap-xxxhdpi/
│   ├── ic_launcher.png (192x192)
│   └── ic_launcher_round.png (192x192)
└── mipmap-anydpi-v26/
    ├── ic_launcher.xml
    └── ic_launcher_round.xml
```

---

## Adaptive Icons (Android 8.0+)

### What are Adaptive Icons?

Adaptive icons use two layers:
- **Foreground**: Your logo/icon (with transparency)
- **Background**: Solid color or image

System can apply different masks (circle, squircle, rounded square) based on device.

### Create Adaptive Icon XML

**File**: `android/app/src/main/res/mipmap-anydpi-v26/ic_launcher.xml`

```xml
<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/ic_launcher_background"/>
    <foreground android:drawable="@mipmap/ic_launcher_foreground"/>
</adaptive-icon>
```

**File**: `android/app/src/main/res/values/colors.xml`

```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="ic_launcher_background">#1E293B</color>
</resources>
```

---

## Splash Screen

### Current Configuration

Already configured in `capacitor.config.ts`:
```typescript
SplashScreen: {
  launchShowDuration: 2000,        // 2 seconds
  backgroundColor: "#1E293B",       // ShineCycle dark navy
  showSpinner: false,               // No loading spinner
  splashFullScreen: true,           // Full screen
  splashImmersive: true            // Hide system UI
}
```

### Add Custom Splash Image

1. **Create Splash Images**:
   - Base size: 2732x2732 PNG
   - Center your logo in middle 1200x1200 area
   - Transparent or solid background
   - Save as: `splash.png`

2. **Generate Densities**:

| Density | Size | Folder |
|---------|------|--------|
| ldpi | 320x320 | drawable-ldpi |
| mdpi | 480x480 | drawable-mdpi |
| hdpi | 720x720 | drawable-hdpi |
| xhdpi | 960x960 | drawable-xhdpi |
| xxhdpi | 1440x1440 | drawable-xxhdpi |
| xxxhdpi | 1920x1920 | drawable-xxxhdpi |

3. **Place Files**:
```
android/app/src/main/res/
├── drawable-ldpi/splash.png
├── drawable-mdpi/splash.png
├── drawable-hdpi/splash.png
├── drawable-xhdpi/splash.png
├── drawable-xxhdpi/splash.png
└── drawable-xxxhdpi/splash.png
```

4. **Sync Changes**:
```bash
npm run android:sync
```

### Landscape Splash (Optional)

For landscape mode support, add to:
```
android/app/src/main/res/
├── drawable-land-hdpi/splash.png
├── drawable-land-mdpi/splash.png
├── drawable-land-xhdpi/splash.png
├── drawable-land-xxhdpi/splash.png
└── drawable-land-xxxhdpi/splash.png
```

---

## Google Play Store Assets

### App Icon (Required)

**Size**: 512x512 PNG (32-bit with transparency)
- High-quality version of your app icon
- Upload in Play Console → Store listing

### Feature Graphic (Required)

**Size**: 1024x500 PNG
- Showcases your app at top of store listing
- No transparency allowed
- Use ShineCycle branding colors
- Include app name/logo
- Avoid too much text

**Design Tips**:
- Gradient background (#1E293B → #9b87f5)
- ShineCycle logo centered or left-aligned
- Tagline: "Doorstep Laundry Service"
- Clean, minimalist design

### Screenshots (Required)

**Phone Screenshots**: Minimum 2, maximum 8
- **Size**: 1080x1920 or 1080x2340 (9:16 or taller)
- **Format**: PNG or JPEG (24-bit RGB)

**Recommended Screenshots**:
1. **Home/Dashboard**: Show main interface
2. **Order Creation**: New order flow
3. **Tracking**: Real-time order tracking
4. **Services**: Available laundry services
5. **Profile**: User profile/settings
6. **QR Scanner**: For launderers (optional)

**Tablet Screenshots** (Optional but recommended):
- **Size**: 1920x1080 or 2560x1440
- Minimum 1, maximum 8

### Promo Video (Optional)

- **YouTube video** showcasing app features
- 30 seconds to 2 minutes long
- Include in Play Console → Store listing

---

## App Branding Colors

### ShineCycle Color Palette

```xml
<!-- android/app/src/main/res/values/colors.xml -->
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <!-- Primary Colors -->
    <color name="colorPrimary">#1E293B</color>
    <color name="colorPrimaryDark">#0F172A</color>
    <color name="colorAccent">#9b87f5</color>
    
    <!-- Secondary Colors -->
    <color name="colorSecondary">#F97316</color>
    <color name="colorTertiary">#14B8A6</color>
    
    <!-- UI Colors -->
    <color name="backgroundColor">#FFFFFF</color>
    <color name="textPrimary">#1E293B</color>
    <color name="textSecondary">#64748B</color>
    
    <!-- Splash Screen -->
    <color name="splashBackground">#1E293B</color>
    <color name="ic_launcher_background">#1E293B</color>
</resources>
```

---

## Testing Your Icons

### Preview in Android Studio

1. Open `res/mipmap-xxxhdpi/ic_launcher.png`
2. View all densities in Project view
3. Check adaptive icon preview

### Test on Device

```bash
# Build and run
npm run android:run

# Check app drawer icon
# Check notification icon
# Check recent apps icon
```

### Test Different Shapes

Android devices use different icon shapes:
- Circle (Google Pixel)
- Squircle (Samsung)
- Rounded square (OnePlus)
- Teardrop (Realme)

Your adaptive icon will adjust to all shapes automatically.

---

## Icon Design Best Practices

### Do's ✅

- **Use simple, recognizable symbols**
- **Keep padding**: 20% from edges for adaptive icons
- **High contrast**: Ensure visibility on all backgrounds
- **Test on real devices**: Check all densities
- **Follow Material Design**: Google's design guidelines
- **Use vector graphics**: Scale without quality loss

### Don'ts ❌

- ❌ Don't use photos as icons
- ❌ Don't include text in icon (too small to read)
- ❌ Don't use gradients excessively
- ❌ Don't make it too complex
- ❌ Don't ignore safe zone (outer 20%)
- ❌ Don't use low-resolution images

---

## Icon Generation Tools

### Recommended Tools

1. **Figma** (Free):
   - Design at 1024x1024
   - Export at different sizes
   - Use plugins for Android asset export

2. **Adobe Illustrator**:
   - Vector-based (scales perfectly)
   - Export as PNG at required sizes

3. **Sketch** (macOS):
   - Built-in Android asset export
   - Auto-generate all densities

4. **Online Tools**:
   - [appicon.co](https://www.appicon.co/)
   - [makeappicon.com](https://makeappicon.com/)
   - [easyappicon.com](https://easyappicon.com/)

### ShineCycle Icon Ideas

**Option 1: Washing Machine Symbol**
- Simple washing machine outline
- Laundry basket with clothes
- Bubbles/foam effect

**Option 2: Abstract Design**
- Circular arrow (cycle/refresh)
- Water droplet with sparkle
- Folded shirt/clothing icon

**Option 3: Letter Mark**
- Stylized "S" for ShineCycle
- "SC" monogram
- Clean typography

---

## Troubleshooting

### Issue: Icons Not Updating

**Solution**:
```bash
# Clean and rebuild
cd android
./gradlew clean
cd ..
npm run android:sync
```

### Issue: Adaptive Icon Not Showing

**Check**:
- `mipmap-anydpi-v26/ic_launcher.xml` exists
- Foreground/background files are present
- Running on Android 8.0+ device

### Issue: Splash Screen Not Appearing

**Fix**:
1. Check `capacitor.config.ts` has SplashScreen config
2. Ensure splash images are in correct folders
3. Verify `launchShowDuration` > 0
4. Rebuild: `npm run android:sync`

### Issue: Play Store Rejects Icon

**Common Reasons**:
- Icon is blurry (too low resolution)
- Transparency not supported (feature graphic)
- Violates design policies (misleading imagery)
- Contains text that's unreadable

**Fix**: Create 512x512 high-quality PNG with no text

---

## Checklist

Before Play Store submission:

**App Icons**:
- [ ] All densities generated (mdpi to xxxhdpi)
- [ ] Adaptive icon configured (foreground + background)
- [ ] Round icon variant created
- [ ] Icons look good on all device shapes

**Splash Screen**:
- [ ] Custom splash images added (optional)
- [ ] Background color set in config
- [ ] Duration configured (2-3 seconds)
- [ ] Tested on real device

**Play Store Assets**:
- [ ] 512x512 app icon (high-res)
- [ ] 1024x500 feature graphic
- [ ] 2-8 screenshots (phone)
- [ ] 1-8 screenshots (tablet, optional)
- [ ] Promo video (optional)

**Testing**:
- [ ] Icons display correctly in app drawer
- [ ] Adaptive icons work on different shapes
- [ ] Splash screen shows on launch
- [ ] Branding colors consistent
- [ ] Tested on multiple devices/Android versions

---

## Resources

### Official Guidelines
- [Android App Icon Guidelines](https://developer.android.com/google-play/resources/icon-design-specifications)
- [Adaptive Icons](https://developer.android.com/develop/ui/views/launch/icon_design_adaptive)
- [Material Design Icons](https://m3.material.io/styles/icons)

### Design Inspiration
- [Dribbble - App Icons](https://dribbble.com/tags/app_icon)
- [Behance - Mobile App Icons](https://www.behance.net/search/projects?search=mobile+app+icons)
- [Google Play - Top Apps](https://play.google.com/store/apps/top) (check competitor icons)

### Color Tools
- [Coolors.co](https://coolors.co/) - Color palette generator
- [Adobe Color](https://color.adobe.com/) - Color wheel
- [Material Design Colors](https://materialui.co/colors) - Material palette

---

**Next Step**: After configuring icons, proceed to [ANDROID_DEPLOYMENT.md](./ANDROID_DEPLOYMENT.md) for full deployment guide.
