# ShineCycle - Laundry Service Platform

## Overview

ShineCycle is a comprehensive laundry service platform designed to connect customers with laundry service providers for doorstep pickup and delivery. It offers a mobile-first experience with real-time order tracking, QR code verification, and role-based access control. The platform aims to streamline laundry operations for providers, enhance customer convenience, and capture a significant share of the on-demand laundry market. It includes business management tools for launderers and full administrative oversight.

## User Preferences

Preferred communication style: Simple, everyday language.

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