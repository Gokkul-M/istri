# ShineCycle - Laundry Service Platform

## Overview

ShineCycle is a comprehensive laundry service platform designed to connect customers with laundry service providers for doorstep pickup and delivery. It provides robust business management tools for launderers and full administrative oversight. The platform features a mobile-first design, real-time order tracking, QR code verification, and role-based access control. Built with React, TypeScript, and Firebase, ShineCycle aims to streamline laundry operations, enhance user experience, and capture a significant share of the on-demand laundry market.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

### Admin Coupon Management Enhancements (October 19, 2025)
- ✅ **Edit Coupon Functionality**:
  - Full edit dialog with all coupon fields (code, discount, description, valid dates, usage limit)
  - Loading states during update operations
  - Real-time updates using Firebase onSnapshot
  - Error handling with user feedback via toast notifications
- ✅ **Delete Coupon with Confirmation**:
  - AlertDialog confirmation before deletion
  - Prevents accidental coupon removal
  - Loading states during delete operations
  - Fixed controlled dialog bug for proper open/close behavior
- ✅ **Enhanced Activate/Deactivate Toggle**:
  - Async error handling for status updates
  - Improved toast messages for better user feedback
  - Real-time status changes reflected instantly
- ✅ **Real-Time CRUD Operations**:
  - All create, update, delete, and toggle operations use Firebase methods
  - Changes reflect instantly via onSnapshot listeners
  - No manual page refresh required

### Real-Time Updates & Error Handling (October 19, 2025)
- ✅ **Address Auto-Selection in NewOrder**:
  - Auto-selects default address on initial page load
  - Falls back to first address if no default exists
  - Preserves user's manual selection when default changes remotely
  - Gracefully handles deleted addresses with automatic re-selection
- ✅ **Fixed "No Address Found" Bug**:
  - Added proper error handling to AddressManagement page
  - Added error handling to NewOrder pickup address selection
  - Shows IndexMissingError component with actionable guidance
  - Prevents confusing "no address found" message when indexes are missing
- ✅ **Real-Time Update Documentation**:
  - Created `REAL_TIME_UPDATES.md` - Developer guide for real-time features
  - Created `AUTO_RELOAD_GUIDE.md` - User-friendly auto-reload explanation
  - Included testing procedures and troubleshooting guides
  - Multi-tab and cross-device testing scenarios
- ✅ **Verified Instant Updates** (Auto-Reload):
  - Addresses: Create/update/delete operations reflect instantly
  - Orders: Real-time synchronization across all user roles
  - Coupons: Instant availability updates
  - Services: Real-time price and availability changes
  - Disputes: Immediate status and response updates
- ℹ️ **No Page Refresh Needed**: All CRUD operations use Firebase real-time listeners

### Firebase Backend Setup & Testing (October 19, 2025)
- ✅ **Firebase Credentials Configured**:
  - All 6 environment variables set in Replit Secrets
  - App successfully connected to Firebase project (istri-82971)
  - Authentication, Firestore, and Storage configured
- ✅ **Backend Connectivity Verified**:
  - Login/Signup routes working correctly
  - Custom ID system integrated with authentication
  - Real-time data hooks properly implemented
- ✅ **Comprehensive Documentation Created**:
  - `FIRESTORE_INDEXES_GUIDE.md`: Step-by-step index creation (5 required indexes)
  - `SETUP_CHECKLIST.md`: Complete setup workflow for production
  - `BACKEND_CONNECTIVITY_TEST.md`: Full end-to-end testing guide
- ⚠️ **Remaining Setup Steps** (User must complete):
  - Create 5 Firestore composite indexes in Firebase Console
  - Deploy Firestore security rules from FIRESTORE_RULES.md
  - Create first admin user (ADMIN-0001) before deploying rules
  - Configure Firebase Storage rules for image uploads

### Customer Functionality Fixes (October 19, 2025)
- ✅ **Fixed Address Management**:
  - Updated `useAddresses` hook to use custom IDs instead of Firebase UIDs
  - Added error callbacks to real-time address listeners
  - Improved error handling with detailed console logging
- ✅ **Optimized Real-Time Data Fetching**:
  - Enhanced `useFirebaseOrders` with retry logic (1 retry per error)
  - Automatic retry reset on successful data fetch
  - Ref-based retry tracking to prevent infinite loops
- ✅ **Fixed Permission Toggles** (`Settings.tsx`):
  - Proper OS-level permission requests via Capacitor
  - Handles all permission states: 'granted', 'prompt', 'denied'
  - Only persists after receiving 'granted' status
  - Added loading states to all toggle switches
- ✅ **Fixed Notification Preferences**:
  - Persistent notification settings with error handling
  - Loading states for all notification toggles
- ✅ **Index Missing Error Handling**:
  - Created `IndexMissingError` component with Firebase Console link
  - Integrated in CustomerDashboard and OrderHistory pages
  - Clear user guidance when composite indexes are missing

### Custom User ID System Implementation (October 19, 2025)
- ✅ **ID Generation Service** (`src/lib/firebase/idGenerator.ts`):
  - Auto-incrementing counter system for generating unique IDs
  - Format: `CUST-0001`, `LAUN-0001`, `ADMIN-0001`
  - Thread-safe ID generation using Firestore transactions
  - Bidirectional mapping between Firebase UIDs and custom IDs
- ✅ **Updated Authentication Flow** (`src/lib/firebase/auth.ts`):
  - Modified signup to generate custom IDs automatically
  - User documents now use custom IDs as document IDs
  - Firebase UID stored as reference field (`firebaseUid`)
  - Login resolves Firebase UID to custom ID seamlessly
- ✅ **Migration System** (`src/lib/firebase/migration.ts`):
  - Comprehensive migration utility for existing users
  - Updates all related documents (orders, disputes, messages, addresses)
  - Maintains data integrity and relationships
  - Admin UI at `/admin/migration` for easy migration
- ✅ **Security Model** (`FIRESTORE_RULES.md`):
  - Prevents privilege escalation and identity forgery
  - Only admins can create ADMIN-* IDs
  - Custom ID format validation (regex-based)
  - Role must match ID prefix (CUST/LAUN/ADMIN)
  - Immutable mappings prevent identity hijacking
  - Comprehensive security rules for all collections
- ✅ **New Firestore Collections**:
  - `counters/userIdCounters`: Tracks next ID number for each role
  - `userMapping/{firebaseUid}`: Firebase UID → Custom ID lookup
  - `customIdMapping/{customId}`: Custom ID → Firebase UID reverse lookup
- ✅ **Database Schema Updates**:
  - User.id: Now contains custom ID (CUST-0001, etc.)
  - User.firebaseUid: New field storing Firebase Auth UID
  - All user references use custom IDs consistently
- ⚠️ **Required Setup**:
  - **CRITICAL**: First admin must be created manually before deploying rules (see FIRESTORE_RULES.md)
  - Firestore security rules must be updated from FIRESTORE_RULES.md
  - Migration must be run for existing users via Admin panel at `/admin/migration`
  - Composite indexes still needed (addresses, disputes, orders)

### Real-Time Order Details System (October 19, 2025)
- ✅ Customer and Launderer order details pages with real-time Firebase data
- ✅ Inline rating and feedback system for completed orders
- ✅ Dispute/support dialog integrated into order details
- ✅ QR code display and invoice download functionality

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
- Unified login and signup flows with role selection
- Firebase Auth state management with custom hooks, logout, and account deletion functionality
- 7-day authentication persistence using `browserLocalPersistence`

**Role-Based Access Control:**
- Three distinct user roles: customer, launderer, admin
- Role-specific UI and feature access, protected routes
- Profile completion flow after signup

### Data Layer

**Firebase Firestore Collections:**
- `users` (profiles, roles, business details) - **Uses custom IDs as document IDs**
- `userSettings` (preferences)
- `orders` (items, status, tracking) - References users by custom ID
- `messages` (customer-launderer communication)
- `services` (laundry service catalog, now global)
- `coupons` (promotional discount codes)
- `disputes` (complaints) - References users by custom ID
- `counters` (ID generation counters) - **NEW**
- `userMapping` (Firebase UID → Custom ID) - **NEW**
- `customIdMapping` (Custom ID → Firebase UID) - **NEW**
- Addresses subcollection (`users/{customId}/addresses`)

**Real-Time Data Synchronization:**
- Custom hooks for live updates from Firestore using `onSnapshot`
- Role-based query filters and Firestore Security Rules for data security
- Unique order IDs generated by Firestore `addDoc()`
- Critical Firestore composite indexes for efficient queries.

### File Storage

**Firebase Storage:**
- User avatar and business logo uploads in `profile-images/{userId}/{filename}`

### Mobile App Support

**Capacitor Integration:**
- Native iOS and Android app capabilities via Capacitor
- Includes Camera, Geolocation, Push, Haptics, Share, Splash plugins
- Touch-optimized UI and native QR scanning
- `base: './'` in `vite.config.ts` and `HashRouter` for Android compatibility.

### Order Management System

**Order Workflow:**
- Customer order creation (service, items, scheduling)
- Multiple service selection per order
- QR code generation for verification (format: LAUNDRY-{firestoreDocId})
- Launderer acceptance/rejection and processing via a scanner (`/launderer/scan`)
- Real-time status updates (pending → confirmed → picked_up → in_progress → ready → out_for_delivery → completed)
- Invoice generation and download (PDF using jsPDF)
- Post-completion rating and feedback with persistence.

### Admin Dashboard

**Oversight Capabilities:**
- Real-time metrics (orders, revenue, users)
- User, global service, and coupon management (CRUD operations)
- Dispute resolution with live ticket updates and reply functionality
- Order assignment to launderers
- System-wide settings and announcements
- Real revenue calculation and trend analysis from completed orders.

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