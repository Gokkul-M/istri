# ShineCycle - Laundry Service Platform

## Overview

ShineCycle is a comprehensive laundry service platform connecting customers with laundry service providers for doorstep pickup and delivery. It offers business management tools for launderers and full administrative oversight. Key features include a mobile-first design, real-time order tracking, QR code verification, and role-based access control. The platform aims to streamline laundry operations, enhance user experience, and capture a significant share of the on-demand laundry market.

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