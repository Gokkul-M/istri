# ShineCycle - Laundry Service Platform

## Overview

ShineCycle is a comprehensive laundry service platform designed to connect customers with laundry service providers for doorstep pickup and delivery. It offers a mobile-first experience with real-time order tracking, QR code verification, and role-based access control. The platform aims to streamline laundry operations for providers, enhance customer convenience, and capture a significant share of the on-demand laundry market. It includes business management tools for launderers and full administrative oversight.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

**October 20, 2025 - Mobile App Connectivity Verification**

Completed comprehensive mobile app setup verification for Android and iOS:

*Mobile Platform Status:*
- ✅ Android platform 100% production-ready
- ✅ iOS setup guide and configuration templates created
- ✅ All Capacitor plugins installed and configured (v7.4.3)
- ✅ Build process tested and working (vite build successful)
- ✅ Firebase mobile configuration verified
- ✅ Comprehensive documentation created

*Android Configuration Verified:*
- All permissions in AndroidManifest.xml (Camera, Location, Notifications, Storage, Network)
- Firebase google-services.json configured
- Release build signing setup via keystore.properties
- ProGuard rules configured for optimization
- MainActivity extends BridgeActivity correctly

*iOS Configuration Created:*
- Info.plist.template with all required permissions and descriptions
- Background modes for notifications and location
- Network security configured for Firebase services
- Capacitor scheme configuration
- Ready for first-time setup on macOS with Xcode

*Native Plugins Configured:*
- Camera (profile photos, QR scanning) - @capacitor/camera v7.0.2
- Geolocation (delivery tracking) - @capacitor/geolocation v7.1.5
- Push Notifications - @capacitor/push-notifications v7.0.3
- Splash Screen - @capacitor/splash-screen v7.0.3
- Haptics - @capacitor/haptics v7.0.2
- Share - @capacitor/share v7.0.2

*Documentation Created:*
- MOBILE_SETUP_GUIDE.md - Complete build and deployment guide
- MOBILE_CONNECTIVITY_CHECKLIST.md - Comprehensive testing checklist
- ios-setup/Info.plist.template - iOS permissions template

**October 20, 2025 - Launderer Disputes & Feedback Pages with Live Indicators**

Added two new pages with real-time data indicators:

*Disputes Page (`/launderer/disputes`):*
- Real-time dispute tracking with pulsing "Live" indicator badge
- Filters by launderer using `useFirebaseDisputes` hook
- Color-coded status badges and priority indicators
- Shows resolution details and admin notes

*Customer Feedback Page (`/launderer/feedback`):*
- Real-time feedback with pulsing "Live" indicator badge
- Statistics cards (total reviews, average rating)
- 5-star rating display with chronological sorting
- Admin notes visibility

*Navigation: Support section added to LaundererDashboard sidebar*

**October 20, 2025 - Launderer Profile Pages Real-Time Data**

Updated Profile page and BusinessProfile page with real-time Firebase data:

*Profile Page (Profile.tsx):*
- Updated Business Statistics card with real-time Firebase data
- Member Since date with proper Firestore Timestamp handling
- Rating displays real-time average from completed orders (filters by launderer ID)
- All data auto-updates when new orders/ratings are added
- Uses `useFirebaseOrders` hook with `useMemo` for efficient recalculation
- Premium gradient card styling with pulsing indicator

*BusinessProfile Page (BusinessProfile.tsx):*
- Added Profile Information card displaying Member Since, Role, and Active status
- Enhanced Business Statistics card with real-time updates (Total Orders, Completed Orders, Total Revenue in ₹, Average Rating with review count)
- Stats filter orders by current launderer ID
- All statistics update in real-time using `useFirebaseOrders` hook
- Premium UI styling with gradient cards and rounded corners
- No duplicate information between cards

## System Architecture

### Frontend Architecture

**Core Technology Stack:** React 18 with TypeScript and Vite, mobile-first responsive design using Tailwind CSS, and shadcn/ui for consistent UI components.

**State Management:** Zustand for global state, React Query for server state, and custom Firebase hooks for real-time data synchronization.

**Navigation & Routing:** React Router for client-side routing with role-based protection, supporting distinct user portals for Customer, Launderer, and Admin.

**UI/UX Design Patterns:** A gradient-based design system (dark navy, lavender, coral, teal), enhanced Switch components, Framer Motion for animations, responsive bottom navigation, QR code generation/scanning, real-time order status timelines with skeleton loading states, gradient card backgrounds with glass-morphism effects, consistent 2rem border-radius, and hover effects for interactive elements. Mobile-optimized spacing is maintained.

### Authentication & Authorization

**Authentication Service:** Firebase Authentication with email/password, unified login/signup with role selection, and profile completion.

**Authorization:** Role-based access control for Customer, Launderer, and Admin roles, with a custom ID system (e.g., CUST-0001) mapped to Firebase UIDs.

### Data Layer

**Firebase Firestore Collections:** `users` (profiles, roles, business details using custom IDs), `userSettings`, `orders`, `messages`, `services`, `coupons`, `disputes`, `feedback`, `notifications`, `counters`, `userMapping`, `customIdMapping`, and `addresses` as a subcollection.

**Real-Time Data Synchronization:** Custom hooks leverage `onSnapshot` for live updates, with role-based query filters and Firestore Security Rules ensuring data security. Critical Firestore composite indexes are used for efficient queries.

### File Storage

**Firebase Storage:** Used for user avatar and business logo uploads, organized in `profile-images/{userId}/{filename}`. Avatar upload is integrated into the customer Settings page with file type validation.

### Mobile App Support

**Capacitor Integration:** Provides native iOS and Android app capabilities using Capacitor plugins (Camera, Geolocation, Push), featuring touch-optimized UI and native QR scanning.

### Order Management System

**Order Workflow:** Includes customer order creation (service, items, scheduling), QR code generation for verification, launderer acceptance/rejection and processing via scanner, real-time status updates, invoice generation (PDF), and post-completion rating and feedback.

### Admin Dashboard

**Oversight Capabilities:** Enables real-time metrics, CRUD operations for user, service, and coupon management, dispute resolution, order assignment, and system-wide settings/announcements. Features a redesigned Complaints & Feedback page with tabs for disputes and customer feedback, allowing admins to mark feedback as "reviewed" and add notes.

### System Design Choices

**Real-time Data:** Extensive use of real-time Firebase data through custom hooks across all portals for order management, statistics, notifications, and feedback.
**Feedback System:** Implemented a `feedback` collection in Firestore for persistent storage, with CRUD operations and security rules.
**Notification System:** `notifications` collection in Firestore for persistent storage, integrated with `useNotifications` hook for real-time updates and automatic triggers on events like dispute resolution.
**Password Management:** Real password change functionality using Firebase reauthentication and `updatePassword` API, including validation and error handling.

## External Dependencies

### Firebase Services
- **Firebase Authentication**: User authentication.
- **Cloud Firestore**: NoSQL database.
- **Firebase Storage**: File uploads.
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