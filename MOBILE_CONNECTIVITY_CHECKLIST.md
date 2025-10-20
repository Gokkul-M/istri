# 📡 ShineCycle Mobile App - Connectivity & Testing Checklist

Complete checklist to ensure all features work perfectly on Android and iOS mobile devices.

---

## ✅ **Network Connectivity Tests**

### **Firebase Connection** 🔥

#### **Authentication**
- [ ] User can sign up with email/password
- [ ] User can log in with valid credentials
- [ ] User stays logged in after app restart (persistence)
- [ ] Logout works correctly
- [ ] Password reset email received
- [ ] Session persists across app restarts

#### **Firestore Database**
- [ ] Can read data from Firestore collections
- [ ] Can write data to Firestore
- [ ] Real-time updates work (onSnapshot)
- [ ] Queries filter correctly by user role
- [ ] Offline persistence works (data cached)
- [ ] Data syncs when back online

#### **Firebase Storage**
- [ ] Profile photos upload successfully
- [ ] Photos display after upload
- [ ] Progress indicator shows during upload
- [ ] File size limits enforced
- [ ] Supported formats: JPG, PNG, WEBP

### **API Connectivity**
- [ ] App works on WiFi
- [ ] App works on 4G/5G mobile data
- [ ] App works on slow networks (3G)
- [ ] Handles network switching (WiFi ↔ Mobile)
- [ ] Shows offline indicator when disconnected
- [ ] Queues actions for when network returns

---

## 📱 **Native Plugin Tests**

### **Camera Plugin** 📷
**Location:** Settings > Edit Profile > Change Avatar

- [ ] Camera permission requested on first use
- [ ] Camera opens successfully
- [ ] Can take photo with camera
- [ ] Can select photo from gallery
- [ ] Photo quality is acceptable (90% quality)
- [ ] Photo uploads to Firebase Storage
- [ ] Uploaded photo displays immediately
- [ ] Works on both front and rear cameras

**Test Cases:**
1. Deny camera permission → Shows error message
2. Take photo → Uploads successfully
3. Cancel camera → Returns to settings without crash

### **Geolocation Plugin** 📍
**Location:** Settings > Permissions, Order Tracking

- [ ] Location permission requested on first use
- [ ] Can get current location coordinates
- [ ] Location accuracy is high (enableHighAccuracy: true)
- [ ] Timeout works correctly (10 seconds)
- [ ] Shows user location on map (if applicable)
- [ ] Real-time tracking updates position
- [ ] Works with GPS disabled (shows error)

**Test Cases:**
1. Deny location permission → Shows error message
2. Enable location → Gets coordinates successfully
3. Move device → Updates location in real-time
4. Disable GPS → Shows appropriate error

### **Push Notifications** 🔔
**Setup Required:** Firebase Cloud Messaging (FCM)

- [ ] Notification permission requested
- [ ] Device receives test notification
- [ ] Notification appears in notification tray
- [ ] Tapping notification opens app
- [ ] Notification shows correct title & message
- [ ] Badge count updates on app icon
- [ ] Works when app is in background
- [ ] Works when app is closed
- [ ] Works when app is in foreground

**Test Notifications:**
1. Order status update
2. Dispute resolution
3. New feedback received
4. Delivery approaching

### **Splash Screen** 🎨
- [ ] Splash screen displays on app launch
- [ ] Shows for 2 seconds (configured duration)
- [ ] Uses correct background color (#1E293B)
- [ ] Transitions smoothly to main app
- [ ] No white flash between splash and app
- [ ] Full screen on all devices
- [ ] Immersive mode (hides status/nav bars)

### **Haptic Feedback** 📳
- [ ] Vibrates on button press (if enabled)
- [ ] Vibrates on important actions
- [ ] Respects device settings
- [ ] Doesn't vibrate in silent mode

### **Share Plugin** 📤
**Location:** Order details, Invoice pages

- [ ] Share dialog opens
- [ ] Can share via WhatsApp
- [ ] Can share via Email
- [ ] Can share via SMS
- [ ] Shares correct content (order details, invoice)
- [ ] PDF invoices share correctly
- [ ] Images share correctly

---

## 🎨 **UI/UX Mobile Tests**

### **Responsive Design**
- [ ] App looks good on small phones (5" screens)
- [ ] App looks good on medium phones (6" screens)
- [ ] App looks good on large phones (6.5"+ screens)
- [ ] App looks good on tablets
- [ ] No horizontal scrolling
- [ ] Text is readable (not too small)
- [ ] Buttons are tap-friendly (min 44px)
- [ ] No content cut off at edges

### **Navigation**
- [ ] Bottom navigation works on all pages
- [ ] Back button works correctly
- [ ] Drawer/sidebar opens smoothly
- [ ] Navigation transitions are smooth
- [ ] Can navigate to all sections
- [ ] No navigation dead-ends

### **Touch Interactions**
- [ ] All buttons respond to taps
- [ ] Scroll works smoothly
- [ ] Swipe gestures work (where applicable)
- [ ] Double-tap prevented on buttons
- [ ] No accidental taps due to spacing
- [ ] Pull-to-refresh works (where implemented)

### **Forms & Input**
- [ ] Keyboard appears for text inputs
- [ ] Keyboard type correct (email, number, text)
- [ ] Can scroll form when keyboard open
- [ ] Form validation works
- [ ] Error messages display correctly
- [ ] Submit buttons work

---

## 🔐 **Security & Permissions**

### **Android Permissions**
- [ ] Internet access works
- [ ] Camera permission requested & works
- [ ] Location permission requested & works
- [ ] Storage permission requested & works
- [ ] Notification permission requested & works
- [ ] All permissions can be revoked in settings
- [ ] App handles revoked permissions gracefully

### **iOS Permissions** (when iOS is built)
- [ ] Camera permission requested with description
- [ ] Location permission requested with description
- [ ] Photo library permission requested
- [ ] Notification permission requested
- [ ] All permission dialogs show custom messages
- [ ] App respects denied permissions

### **Data Security**
- [ ] Passwords not visible when typing
- [ ] API keys not exposed in app
- [ ] HTTPS used for all connections
- [ ] User data encrypted in transit
- [ ] Session tokens secured
- [ ] No sensitive data in logs

---

## 📊 **Role-Based Testing**

### **Customer Role** 👤

#### **Dashboard**
- [ ] Order summary displays correctly
- [ ] Active orders show real-time status
- [ ] Service cards display properly
- [ ] Bottom navigation works

#### **Create Order**
- [ ] Can select service type
- [ ] Can add items to order
- [ ] Can schedule pickup
- [ ] Can select delivery address
- [ ] Can apply coupons
- [ ] Order creates successfully
- [ ] Receives order confirmation

#### **Track Order**
- [ ] QR code displays for verification
- [ ] Timeline shows order status
- [ ] Real-time updates work
- [ ] Can see launderer details
- [ ] Map shows location (if applicable)

#### **Rate Order**
- [ ] Star rating works
- [ ] Can submit feedback text
- [ ] Feedback saves to Firestore
- [ ] Confirmation shown

### **Launderer Role** 🧺

#### **Dashboard**
- [ ] Pending orders display
- [ ] Statistics update in real-time
- [ ] Can accept/reject orders
- [ ] Active orders tracked

#### **QR Scanner**
- [ ] Camera opens for scanning
- [ ] Scans QR codes successfully
- [ ] Validates order codes
- [ ] Updates order status
- [ ] Shows success/error messages

#### **Disputes Page** ✅
- [ ] Disputes list displays
- [ ] **"Live" indicator shows (pulsing green dot)**
- [ ] Real-time updates work
- [ ] Status badges color-coded
- [ ] Priority levels display
- [ ] Resolution details show
- [ ] Admin notes visible

#### **Customer Feedback Page** ✅
- [ ] Feedback list displays
- [ ] **"Live" indicator shows (pulsing green dot)**
- [ ] Real-time updates work
- [ ] Star ratings display correctly
- [ ] Statistics update (total reviews, avg rating)
- [ ] Newest feedback appears first
- [ ] Admin notes visible

#### **Business Profile**
- [ ] Statistics display correctly
- [ ] Member since date accurate
- [ ] Average rating calculates correctly
- [ ] Total revenue shows in ₹
- [ ] Real-time updates work

### **Admin Role** 👨‍💼

#### **Dashboard**
- [ ] All orders visible
- [ ] User management works
- [ ] Service management works
- [ ] Coupon management works
- [ ] Analytics display correctly

#### **Dispute Management**
- [ ] Can view all disputes
- [ ] Can update dispute status
- [ ] Can add resolution notes
- [ ] Notifications sent on resolution
- [ ] Real-time updates work

#### **Feedback Management**
- [ ] Can view all feedback
- [ ] Can mark as reviewed
- [ ] Can add admin notes
- [ ] Filters work correctly

---

## 🌐 **Offline Functionality**

### **With Internet**
- [ ] All features work normally
- [ ] Data loads quickly
- [ ] Real-time updates instant

### **Without Internet**
- [ ] App doesn't crash
- [ ] Shows offline indicator
- [ ] Cached data still visible
- [ ] Forms can be filled (queued)
- [ ] Error messages helpful
- [ ] Reconnects automatically

### **Intermittent Connection**
- [ ] App handles connection drops
- [ ] Retries failed requests
- [ ] Doesn't duplicate data
- [ ] Syncs queued actions

---

## 🔄 **Performance Tests**

### **App Launch**
- [ ] Launches in < 3 seconds
- [ ] Splash screen smooth
- [ ] No white screen flash
- [ ] Auto-login works (if enabled)

### **Page Load Times**
- [ ] Dashboard loads < 2 seconds
- [ ] Order list loads < 2 seconds
- [ ] Profile loads < 1 second
- [ ] Images load progressively

### **Memory Usage**
- [ ] App uses < 200MB RAM
- [ ] No memory leaks
- [ ] Doesn't slow down over time
- [ ] Doesn't drain battery excessively

### **Data Usage**
- [ ] Reasonable data consumption
- [ ] Images optimized
- [ ] Caches frequently used data
- [ ] Option to restrict data usage

---

## 🐛 **Error Handling**

### **Network Errors**
- [ ] Shows user-friendly error messages
- [ ] Retry button available
- [ ] Doesn't crash app
- [ ] Logs errors for debugging

### **Firebase Errors**
- [ ] Permission denied handled gracefully
- [ ] Invalid data handled
- [ ] Quota exceeded shown clearly
- [ ] Authentication errors clear

### **Form Validation**
- [ ] Required fields marked
- [ ] Invalid input highlighted
- [ ] Error messages specific
- [ ] Prevents submission with errors

---

## 📋 **Final Pre-Release Checklist**

### **Before Building APK/AAB**
- [ ] All environment variables set correctly
- [ ] Firebase config updated (google-services.json)
- [ ] Version number updated
- [ ] App name correct (ShineCycle)
- [ ] App icon set (all sizes)
- [ ] Splash screens created (all orientations)
- [ ] Release build tests passed
- [ ] ProGuard rules configured (if using)
- [ ] No test/debug code in production

### **Before App Store Submission**
- [ ] Privacy policy page created
- [ ] Terms of service page created
- [ ] About page with app version
- [ ] Contact support method available
- [ ] Screenshots prepared (required sizes)
- [ ] App description written
- [ ] Keywords optimized for search
- [ ] Promotional graphics created

---

## ✅ **Sign-Off**

**Tested By:** ________________  
**Date:** ________________  
**Platform:** Android / iOS  
**Device:** ________________  
**OS Version:** ________________  

**Overall Status:** ☐ Pass  ☐ Fail  ☐ Needs Fixes

**Notes:**
___________________________________________________________________
___________________________________________________________________
___________________________________________________________________

---

## 🎯 **Known Issues & Limitations**

### **Current Blockers:**
1. ⚠️ **Firebase Security Rules** - Need update for feedback collection
2. ⚠️ **Push Notifications** - FCM setup required
3. ⏳ **iOS Platform** - Requires macOS with Xcode for first build

### **Future Enhancements:**
- Deep linking for order tracking
- Biometric authentication (fingerprint/face)
- In-app chat support
- Multi-language support (currently English)
- Dark mode improvements

---

**Last Updated:** October 20, 2025  
**Document Version:** 1.0  
**App Version:** 1.0.0
