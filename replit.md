# ShineCycle - Laundry Service Platform

## Overview

ShineCycle is a comprehensive laundry service platform connecting customers with laundry service providers for doorstep pickup and delivery. It offers business management tools for launderers and full administrative oversight. Key features include a mobile-first design, real-time order tracking, QR code verification, and role-based access control. The platform aims to streamline laundry operations, enhance user experience, and capture a significant share of the on-demand laundry market.

## Recent Changes

**October 20, 2025 - Settings & Sidebar Premium Enhancements**

*Customer Portal:*
- Completely redesigned Settings page with modern gradient cards and improved organization
  - Implemented sections: Profile & Account, App Preferences, Orders, Privacy & Security
  - Enhanced all dialogs (Password, Notifications, Permissions, Language) with premium styling
  - Added real password change functionality using Firebase reauthentication and updatePassword API
  - Password change includes validation, loading states, and comprehensive error handling
  - All settings functionalities verified working: notifications, permissions, language, profile picture, delete account, logout
  - Consistent 2rem border-radius, gradient backgrounds, and glass-morphism effects throughout
- Completely redesigned sidebar with premium modern styling
  - Enhanced profile section with larger avatar, online status indicator, and better stat cards
  - Added gradient backgrounds and glass-morphism effects throughout
  - Implemented section headers ("Main Menu" and "More") for better organization
  - Added notification badge to sidebar navigation item showing unread count
  - Enhanced navigation items with gradient icon backgrounds and smooth hover effects
  - Added visual separator between main navigation and secondary options
  - Improved logout button styling with gradient background
  - Better spacing, typography, and rounded corners (1.25rem) for all elements
  - Added subtle border and backdrop blur for premium feel

*Launderer Portal:*
- Enhanced sidebar with premium styling matching customer sidebar design
  - Larger avatar (16x16) with online status indicator and glass-morphism backdrop
  - Reorganized navigation into "Main Menu" and "More" sections
  - Gradient icon backgrounds (11x11) with 1rem border-radius for all navigation items
  - Enhanced stat cards showing weekly orders and rating with better styling
  - Added visual separator between navigation sections
  - Improved logout button with gradient background and bold styling
  - Consistent spacing and overflow handling for better mobile experience

*Admin Portal:*
- Enhanced sidebar with premium styling and better organization
  - Profile section with larger avatar, online status indicator, and stat cards (Total Users, Revenue)
  - Reorganized navigation into "Main Menu" (Dashboard, Customers, Launderers, Orders) and "More" sections
  - Gradient icon backgrounds for all navigation items with consistent 1rem border-radius
  - Active state highlighting with enhanced gradient backgrounds
  - Visual separator between main and secondary navigation
  - Improved logout button styling matching other portals
  - Better spacing, typography, and rounded corners throughout

*Authentication:*
- Added `changePassword` method to AuthService with Firebase reauthentication
  - Uses EmailAuthProvider.credential for reauthentication
  - Calls updatePassword with proper error handling
  - Custom error messages for wrong-password, weak-password, and requires-recent-login errors
  - Imported updatePassword, EmailAuthProvider, and reauthenticateWithCredential from Firebase Auth

**October 19, 2025 - UI/UX Enhancements & Notification System Implementation**

*Customer Portal:*
- Fixed Order Again card navigation in Customer Dashboard (corrected route from `/customer/orders/:id` to `/customer/order/:id`)
- Added profile picture upload functionality to Settings page with file validation and toast notifications
- Enhanced OrderHistory page styling with gradient cards, improved spacing, and better mobile responsiveness
- Enhanced OrderDetails page styling with consistent card design, better visual hierarchy, and improved mobile padding
- Implemented real-time notification system displaying dispute resolutions with admin notes and resolution details
- Added unread notification count to dashboard activity card with red badge indicator

*Launderer Portal:*
- Completely rebuilt OrderManagement page with real-time Firebase data integration
- Removed all dummy data and connected to live order feeds filtered by launderer assignment
- Implemented modern gradient card design with glass-morphism effects
- Added clickable order cards that navigate to detailed order view
- Included customer information (name, address) on order cards
- Added real-time search functionality for customer names and order IDs
- Implemented stat cards showing pending, active, ready, and completed order counts
- Organized orders into tabs: All, Pending, Active, and Ready
- Added empty states for each tab with contextual messaging
- Enhanced order cards with pickup time, item count, and relative timestamps
- All order data is real-time synced with Firebase using `useFirebaseOrders` hook
- Updated LaundererDashboard to show only orders assigned to the logged-in launderer
- Enhanced "Assigned Orders" section with clickable cards linking to order details
- Enhanced "Recently Completed" section with real-time completed orders and customer ratings
- Made order cards clickable while keeping Accept/Reject buttons functional
- Added "View All" buttons when there are more than 3 orders in a section
- Updated stat cards to show real-time counts for Total Orders, Revenue, and Active Orders

*Admin Portal:*
- Completely redesigned Dispute Resolution page with modern gradient cards and glass-morphism effects
- Enhanced stats cards with color-coded gradients (yellow/open, blue/in-progress, green/resolved) and hover effects
- Improved search input with better placeholder text and larger touch targets
- Redesigned dispute cards with better visual hierarchy, separators, and enhanced information display
- Added empty states for all tabs with contextual icons and messaging
- Enhanced dialog modals with better spacing, rounded corners, and improved button layouts
- Color-coded resolution/notes sections for better visual distinction
- Automatic notification creation when disputes are resolved, sending admin notes and resolution to customers

*System Architecture:*
- Created notifications collection in Firestore for persistent notification storage
- Implemented `useNotifications` hook for real-time notification updates
- Added notification CRUD operations to FirestoreService
- Integrated automatic notification trigger on dispute resolution
- Updated FIRESTORE_RULES.md with notification security rules (requires manual deployment)

All changes use real-time Firebase data through custom hooks

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Core Technology Stack:**
- React 18 with TypeScript and Vite
- Mobile-first responsive design using Tailwind CSS
- shadcn/ui component library for consistent UI

**State Management:**
- Zustand for global state, React Query for server state
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
- Gradient card backgrounds with backdrop blur for modern glass-morphism effect
- Consistent rounded corners (2rem border-radius) across all cards
- Hover effects (shadow-soft to shadow-medium transitions) for interactive elements
- Mobile-optimized spacing (pb-20 for bottom navigation clearance)

### Authentication & Authorization

**Authentication Service:**
- Firebase Authentication with email/password
- Unified login/signup with role selection and profile completion flow
- Role-based access control for Customer, Launderer, and Admin roles
- Custom ID system (e.g., CUST-0001, LAUN-0001, ADMIN-0001) for users, with Firebase UID mapping.

### Data Layer

**Firebase Firestore Collections:**
- `users` (profiles, roles, business details - uses custom IDs as document IDs)
- `userSettings`, `orders`, `messages`, `services`, `coupons`, `disputes`
- `counters`, `userMapping`, `customIdMapping` (for custom ID system)
- Addresses subcollection (`users/{customId}/addresses`)

**Real-Time Data Synchronization:**
- Custom hooks for live updates from Firestore using `onSnapshot`
- Role-based query filters and Firestore Security Rules for data security
- Critical Firestore composite indexes for efficient queries.

### File Storage

**Firebase Storage:**
- User avatar and business logo uploads in `profile-images/{userId}/{filename}`
- Avatar upload integrated in customer Settings page with file type validation
- Real-time profile picture updates via `useProfile` hook's `uploadProfileImage` function

### Mobile App Support

**Capacitor Integration:**
- Native iOS and Android app capabilities using Capacitor plugins (Camera, Geolocation, Push, etc.)
- Touch-optimized UI and native QR scanning.

### Order Management System

**Order Workflow:**
- Customer order creation (service, items, scheduling)
- QR code generation for verification
- Launderer acceptance/rejection and processing via scanner
- Real-time status updates and invoice generation (PDF)
- Post-completion rating and feedback.

### Admin Dashboard

**Oversight Capabilities:**
- Real-time metrics, user, service, and coupon management (CRUD)
- Dispute resolution, order assignment
- System-wide settings and announcements.

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