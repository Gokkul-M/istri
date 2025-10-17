# ShineCycle - Laundry Service Platform

## Overview

ShineCycle is a comprehensive laundry service platform connecting customers with laundry service providers for doorstep pickup and delivery. It offers business management tools for launderers and full administrative oversight. The platform features a mobile-first design, real-time order tracking, QR code verification, and role-based access control. Built with React, TypeScript, and Firebase, ShineCycle aims to streamline laundry operations and enhance user experience, capturing a significant share of the on-demand laundry market.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

### Android Mobile App Configuration (October 17, 2025)
- ✅ **Capacitor Android Setup**: Complete configuration for Play Store deployment
  - Updated capacitor.config.ts with optimized Android settings
  - Configured Camera, Geolocation, SplashScreen, and PushNotifications plugins
  - Min WebView version set to 55 for better compatibility
- ✅ **Build Scripts**: Added comprehensive NPM scripts for Android development
  - `npm run android:sync` - Build web app and sync to Android platform
  - `npm run android:open` - Open project in Android Studio
  - `npm run android:run` - Complete build, sync, and open workflow
  - `npm run android:build` - Generate release APK for testing
  - `npm run android:bundle` - Generate AAB for Google Play Store submission
- ✅ **Android Build Configuration**: Production-ready Gradle setup
  - Enabled minification and resource shrinking for release builds
  - ProGuard optimization configured
  - Signing configuration template added (ready for keystore)
  - Debug and release build variants configured
- ✅ **Comprehensive Documentation**: Three detailed guides created
  - **ANDROID_DEPLOYMENT.md**: Complete Play Store deployment guide
    - Firebase Android setup instructions
    - Signing key generation process
    - Play Store listing requirements
    - Version management and updates
  - **ANDROID_APP_ICONS.md**: Icon and branding configuration
    - All density requirements and specifications
    - Adaptive icon setup for Android 8.0+
    - Splash screen customization guide
    - Play Store asset requirements (feature graphic, screenshots)
  - **ANDROID_QUICK_START.md**: Developer quick reference
    - Android Studio setup steps
    - Firebase integration walkthrough
    - Build and test workflow
    - Troubleshooting common issues
- ✅ **Android Platform**: Already initialized with proper structure
  - AndroidManifest.xml with all required permissions (Camera, Location, Notifications)
  - Build configuration with Firebase support
  - FileProvider configured for image handling
  - google-services.json.example template provided

### Data & UI Improvements (October 17, 2025)
- ✅ **Customer Dashboard Enhancement**: Added total spent calculation
  - Now displays total amount spent from completed orders only
  - Shows both total orders count and total spent side-by-side in profile section
  - Real-time calculation from Firebase order data
- ✅ **Admin Service Management Redesign**: Converted to global service management
  - **BREAKING CHANGE**: Services are now global, not launderer-specific
  - Admin can create, edit, and delete services that appear in all new orders
  - Full CRUD operations with Firebase integration
  - Modern UI with service cards, search functionality
  - Services include: name, price, description, and icon
- ✅ **Admin Complaints Page**: Removed all dummy data
  - Now 100% Firebase real-time data from `disputes` collection
  - Live ticket updates with status tracking (pending, in_progress, resolved)
  - Reply functionality with timestamp tracking
  - Empty state when no complaints exist
  - Stats cards show real counts (total, pending, active, resolved)
- ✅ **Admin Payments/Revenue Page**: Removed dummy data
  - All percentage indicators and fake trends removed
  - Real revenue calculation from completed orders
  - Pending orders count now shows actual pending orders (not fake amount)
  - Charts populated with real Firebase order data
  - Monthly revenue trend based on actual order dates
- ✅ **Admin Order Management**: Enhanced mobile-first design
  - Modern gradient cards with improved spacing and shadows
  - Better visual hierarchy with icons and badges
  - Customer info displayed in highlighted cards
  - Order items shown in clean grid layout
  - Enhanced launderer selection with star ratings
  - Loading states with skeleton components
  - Improved status badges with better colors

### Local Development Setup & Firestore Index Fix (October 17, 2025)
- ✅ **Environment Configuration**: Created centralized `.env` setup for local development
  - Added `.env.example` with all Firebase variables template
  - Updated `.gitignore` to exclude `.env` files from version control
  - All environment variables use `VITE_` prefix for Vite compatibility
- ✅ **Comprehensive Documentation**: Created detailed local setup guide
  - `LOCAL_SETUP.md` with step-by-step instructions for VS Code setup
  - Firebase service configuration guide (Auth, Firestore, Storage)
  - Firestore & Storage security rules included
  - **CRITICAL: Firestore composite indexes setup** (required for queries to work)
  - Initial data setup instructions (services, coupons)
  - Test account creation guide
  - Troubleshooting section for common issues
- ✅ **Firebase Indexes Guide**: Created `FIREBASE_INDEXES.md`
  - **Fixes "Request contains an invalid argument" error**
  - Step-by-step index creation instructions
  - Direct links to auto-create indexes in Firebase Console
  - Required indexes: orders(customerId+createdAt), orders(laundererId+createdAt)
  - Quick fix using error links from browser console
- ✅ **Updated README**: Professional project overview
  - Complete tech stack documentation
  - Architecture and features overview
  - Deployment instructions for local, Replit, and mobile
  - Quick start guide with npm commands
  - Project structure visualization
- ✅ **Vite Configuration**: Already configured for local development
  - Port 5000 with strict port binding
  - Host set to 0.0.0.0 for accessibility
  - Path aliases configured (@/ for src/)

## System Architecture

### Frontend Architecture

**Core Technology Stack:**
- React 18 with TypeScript
- Vite for fast development
- Mobile-first responsive design using Tailwind CSS
- shadcn/ui component library for consistent UI

**State Management:**
- Zustand for global state management
- React Query for server state
- Custom Firebase hooks for real-time data synchronization

**Navigation & Routing:**
- React Router for client-side routing with role-based protection
- Distinct user portals for Customer, Launderer, and Admin dashboards

**UI/UX Design Patterns:**
- Gradient-based design system (dark navy, lavender, coral, teal)
- Enhanced Switch components, Framer Motion for animations
- Responsive bottom navigation for mobile
- QR code generation/scanning for order verification
- Real-time order status timeline with skeleton loading states

### Authentication & Authorization

**Authentication Service:**
- Firebase Authentication with email/password for all users (customers, launderers, admins)
- Unified login flow (`/login`) and signup (`/signup`) with role selection
- Firebase Auth state management with custom hooks, logout, and account deletion functionality
- 7-day authentication persistence using `browserLocalPersistence`

**Role-Based Access Control:**
- Three distinct user roles: customer, launderer, admin
- Role-specific UI and feature access, protected routes
- Profile completion flow after signup

### Data Layer

**Firebase Firestore Collections:**
- `users` (profiles, roles, business details)
- `userSettings` (preferences)
- `orders` (items, status, tracking)
- `messages` (customer-launderer communication)
- `services` (laundry service catalog)
- `coupons` (promotional discount codes)
- `disputes` (complaints)
- Addresses subcollection (`users/{userId}/addresses`)

**Real-Time Data Synchronization:**
- Custom hooks for live updates from Firestore using `onSnapshot`
- Role-based query filters and Firestore Security Rules for data security
- Unique order IDs generated by Firestore `addDoc()`

### File Storage

**Firebase Storage:**
- User avatar and business logo uploads in `profile-images/{userId}/{filename}`

### Mobile App Support

**Capacitor Integration:**
- Native iOS and Android app capabilities via Capacitor
- Includes Camera, Geolocation, Push, Haptics, Share, Splash plugins
- Touch-optimized UI and native QR scanning

### Order Management System

**Order Workflow:**
- Customer order creation (service, items, scheduling)
- Multiple service selection per order
- QR code generation for verification (format: LAUNDRY-{firestoreDocId})
- Launderer acceptance/rejection and processing via a scanner (`/launderer/scan`)
- Real-time status updates (pending → confirmed → picked_up → in_progress → ready → out_for_delivery → completed)
- Invoice generation and download (PDF using jsPDF)
- Post-completion rating and feedback

### Admin Dashboard

**Oversight Capabilities:**
- Real-time metrics (orders, revenue, users)
- User, service, and coupon management (CRUD operations)
- Dispute resolution
- Order assignment to launderers
- System-wide settings and announcements

## External Dependencies

### Firebase Services
- **Firebase Authentication**: User authentication (email/password).
- **Cloud Firestore**: NoSQL database for real-time data.
- **Firebase Storage**: File uploads (avatars, logos).
- **Firebase Project ID**: `istri-82971`.

### Third-Party Libraries
- **Radix UI**: Accessible component primitives.
- **React Hook Form**: Form state management with Zod validation.
- **date-fns**: Date manipulation.
- **qrcode.react**: QR code generation.
- **Embla Carousel**: Touch-friendly carousel.
- **Lucide React**: Icon library.
- **Sonner**: Toast notification system.
- **jsPDF**: PDF invoice generation.
- **html5-qrcode**: QR scanning.

### Environment Configuration
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`