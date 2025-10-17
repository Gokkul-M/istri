# 🌟 ShineCycle - Laundry Service Platform

<div align="center">

![ShineCycle](https://img.shields.io/badge/ShineCycle-Laundry%20Service-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)
![Firebase](https://img.shields.io/badge/Firebase-12.0-FFCA28?style=for-the-badge&logo=firebase)

**A comprehensive laundry service platform connecting customers with service providers for doorstep pickup and delivery**

[Local Setup Guide](./LOCAL_SETUP.md) • [Live Demo](#) • [Documentation](#)

</div>

---

## 📖 Overview

ShineCycle (previously known as Istri) is a mobile-first laundry service platform that streamlines laundry operations and enhances user experience. Part of the **My Apt Partner** multi-service apartment app suite, it connects customers with professional laundry service providers.

### ✨ Key Features

#### For Customers 🛍️
- **Multi-Service Selection** - Choose multiple services (Ironing ₹12, Washing ₹20, Dry Cleaning ₹30)
- **Smart Pricing** - Total calculated as (sum of selected services) × clothes count
- **Doorstep Pickup & Delivery** - Convenient scheduling
- **Real-Time Tracking** - Track order status live
- **QR Code Verification** - Secure order handoff
- **Promotional Offers** - Automatic coupon application
- **Order History** - View all past orders

#### For Launderers 💼
- **Order Management** - Accept/reject orders
- **QR Scanner** - Quick order verification
- **Status Updates** - Update order progress in real-time
- **Business Dashboard** - Track earnings and performance
- **Customer Communication** - In-app messaging

#### For Admins 👨‍💼
- **Dashboard Analytics** - Real-time metrics (orders, revenue, users)
- **User Management** - CRUD operations for all users
- **Service & Coupon Management** - Add/edit/delete services and promotions
- **Order Assignment** - Assign orders to launderers
- **Dispute Resolution** - Handle customer complaints
- **System Settings** - Configure platform settings

---

## 🚀 Quick Start

### For Local Development (VS Code)

**📚 [Complete Local Setup Guide →](./LOCAL_SETUP.md)**

Quick commands:

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd shinecycle

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your Firebase credentials

# 4. Start development server
npm run dev
```

**Open http://localhost:5000** 🎉

---

## 🏗️ Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **React Router** - Routing
- **React Query** - Server state
- **Zustand** - Global state
- **Framer Motion** - Animations

### Backend & Services
- **Firebase Authentication** - User authentication
- **Cloud Firestore** - NoSQL database
- **Firebase Storage** - File storage
- **Firebase Analytics** - Usage analytics

### Mobile
- **Capacitor** - Native iOS/Android capabilities
- Camera, Geolocation, Push Notifications, Haptics

### Additional Libraries
- **qrcode.react** - QR code generation
- **html5-qrcode** - QR scanning
- **jsPDF** - Invoice generation
- **date-fns** - Date utilities
- **Zod** - Schema validation
- **React Hook Form** - Form management

---

## 📁 Project Structure

```
shinecycle/
├── src/
│   ├── components/          # Reusable UI components
│   │   └── ui/             # shadcn/ui components
│   ├── hooks/              # Custom React hooks
│   │   ├── useFirebaseAuth.ts
│   │   ├── useFirebaseOrders.ts
│   │   └── useFirebaseServices.ts
│   ├── lib/                # Utility functions
│   │   ├── firebase/       # Firebase configuration
│   │   └── utils.ts        # Helper functions
│   ├── pages/              # Page components
│   │   ├── customer/       # Customer dashboard & pages
│   │   ├── launderer/      # Launderer dashboard & pages
│   │   └── admin/          # Admin dashboard & pages
│   ├── App.tsx             # Main app with routing
│   └── main.tsx            # Entry point
├── .env.example            # Environment template
├── LOCAL_SETUP.md          # Local setup guide
├── package.json            # Dependencies
└── vite.config.ts          # Vite configuration
```

---

## 🔐 Authentication & Roles

### User Roles

1. **Customer** - Place orders, track deliveries, manage addresses
2. **Launderer** - Accept orders, scan QR codes, update status
3. **Admin** - Full system control and management

### Authentication Features
- Email/Password authentication via Firebase
- 7-day session persistence (browser local storage)
- Locked email/name fields after signup
- Role-based access control
- Secure logout and account deletion

---

## 💰 Service Pricing

| Service | Price (₹) | Description |
|---------|-----------|-------------|
| **Ironing** | ₹12/piece | Professional ironing service |
| **Washing** | ₹20/piece | Complete washing with premium detergents |
| **Dry Cleaning** | ₹30/piece | Professional dry cleaning for delicates |

**Multiple Service Calculation:**
- Single service: Price × Clothes count
- Multiple services: (Price₁ + Price₂ + ...) × Clothes count
- Example: Ironing + Washing with 10 clothes = (₹12 + ₹20) × 10 = **₹320**

---

## 📱 Order Workflow

```
Customer Creates Order → Select Services → Add Clothes Count → Apply Coupon (Optional) 
→ Confirm Order → QR Code Generated → Launderer Accepts → Pickup via QR Scan 
→ Processing → Ready for Delivery → Out for Delivery → Delivered & Completed 
→ Customer Reviews
```

**Order Statuses:**
- Pending → Confirmed → Picked Up → In Progress → Ready → Out for Delivery → Completed

---

## 🛠️ Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (port 5000) |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

---

## 🔧 Configuration

### Environment Variables

All environment variables must be prefixed with `VITE_` to be accessible in the frontend.

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### Firebase Configuration

1. **Authentication** - Email/Password enabled
2. **Firestore** - Collections: users, orders, services, coupons, messages, disputes
3. **Storage** - Profile images stored in `profile-images/{userId}/`
4. **Security Rules** - Role-based access control

---

## 🎨 Design System

### Colors
- **Primary** - Purple gradient (#8B5CF6 to #6366F1)
- **Secondary** - Blue gradient (#3B82F6 to #2563EB)
- **Accent** - Coral gradient (#F97316 to #EF4444)
- **Tertiary** - Teal gradient (#14B8A6 to #0891B2)

### UI Components
- Mobile-first responsive design
- Gradient-based design system
- Enhanced Switch components
- Framer Motion animations
- Bottom navigation for mobile
- QR code generation/scanning
- Skeleton loading states

---

## 📊 Firebase Collections

### Core Collections

#### `users`
- User profiles (name, email, phone, role)
- Business details for launderers
- Subcollection: `addresses`

#### `orders`
- Order details (items, services, status)
- Customer & launderer IDs
- Total amount, QR code
- Tracking information

#### `services`
- Service name, price, description, icon
- Active/inactive status

#### `coupons`
- Coupon code, discount percentage
- Service type, validity, min order
- Active/inactive status

#### `messages`
- Customer-launderer communication
- Order-specific messaging

#### `disputes`
- Customer complaints
- Resolution tracking

---

## 🔒 Security

### Best Practices
- ✅ Environment variables for sensitive data
- ✅ Firebase Security Rules for data access
- ✅ Role-based authorization
- ✅ Secure password authentication
- ✅ XSS protection via React
- ✅ HTTPS only in production

### Security Rules
- Users can only access their own data
- Admins have full access
- Orders visible to customer, launderer, and admin
- Services and coupons managed by admin only

---

## 🚀 Deployment

### Replit Deployment
1. Push code to Replit
2. Environment variables auto-configured from Secrets
3. Click **Deploy** button
4. App published with custom domain

### Local Production Build
```bash
npm run build
npm run preview
```

### Mobile App Build (Capacitor)
```bash
# Build web assets
npm run build

# Sync with Capacitor
npx cap sync

# Open in Android Studio or Xcode
npx cap open android
npx cap open ios
```

---

## 🧪 Testing Accounts

Create test accounts for each role:

| Role | Email | Password | Purpose |
|------|-------|----------|---------|
| Customer | customer@test.com | Test@123 | Place orders |
| Launderer | launderer@test.com | Test@123 | Process orders |
| Admin | admin@test.com | Test@123 | Manage system |

---

## 📚 Documentation

- **[Local Setup Guide](./LOCAL_SETUP.md)** - Complete guide for local development
- **[Firebase Setup](#)** - Firebase configuration details
- **[API Documentation](#)** - Firebase API reference
- **[User Guide](#)** - End-user documentation

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is part of **My Apt Partner** multi-service apartment app suite.

---

## 🆘 Support

For issues and questions:
- Check [Local Setup Guide](./LOCAL_SETUP.md)
- Review browser console for errors
- Verify Firebase configuration
- Check Firestore security rules

---

## 🎯 Roadmap

- [ ] Payment gateway integration (Razorpay/Stripe)
- [ ] Push notifications for order updates
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Subscription plans
- [ ] Referral system
- [ ] Live chat support

---

<div align="center">

**Built with ❤️ for apartment communities**

[Report Bug](../../issues) · [Request Feature](../../issues) · [Documentation](./LOCAL_SETUP.md)

</div>
