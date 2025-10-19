import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'customer' | 'launderer' | 'admin';

export type OrderStatus = 'pending' | 'confirmed' | 'picked_up' | 'in_progress' | 'ready' | 'out_for_delivery' | 'completed' | 'cancelled';

export interface User {
  id: string; // Custom ID (CUST-0001, LAUN-0001, etc.)
  firebaseUid?: string; // Firebase Auth UID (stored for reference)
  role: UserRole;
  name: string;
  email: string;
  phone: string;
  address: string;
  pinCode: string;
  avatar?: string;
  isActive?: boolean;
  assignedLaundererId?: string; // for customers - admin assigned launderer
  assignedCoupons?: string[]; // customer assigned coupons
  // Launderer specific
  businessName?: string;
  businessDescription?: string;
  logo?: string;
  pricePerKg?: number;
  rating?: number;
  distance?: number;
  verified?: boolean; // Launderer verification status
  verificationDate?: string;
}

export interface Service {
  id: string;
  name: string;
  icon: string;
  price: number;
  description: string;
}

export interface OrderItem {
  serviceId: string;
  serviceName: string;
  quantity: number;
  price: number;
}

export interface Coupon {
  id: string;
  code: string;
  discount: number; // percentage
  description: string;
  validFrom: string;
  validUntil: string;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
  createdBy: string; // admin id
  assignedTo?: string[]; // customer ids
}

export interface Dispute {
  id: string;
  orderId: string;
  customerId: string;
  laundererId: string;
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'rejected';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  resolvedAt?: string;
  adminNotes?: string;
  resolution?: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
  type: 'admin_to_launderer' | 'launderer_to_admin' | 'system';
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  laundererId?: string;
  laundererName?: string;
  laundererPhone?: string;
  items: OrderItem[];
  totalAmount: number;
  discount?: number;
  couponCode?: string;
  finalAmount?: number;
  status: OrderStatus;
  pickupTime: string;
  deliveryTime: string;
  qrCode: string;
  createdAt: string;
  updatedAt: string;
  notes?: string;
  weight?: number;
  rating?: number;
  feedback?: string;
  invoiceGeneratedAt?: string;
  invoiceDownloadCount?: number;
}

interface LaundryStore {
  // Current user (managed by Firebase Auth)
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  
  // Availability
  availablePinCodes: string[];
  checkAvailability: (pinCode: string) => boolean;
  
  // Reset
  reset: () => void;
}

const initialState = {
  currentUser: null,
  availablePinCodes: ['560001', '560002', '560038', '560095', '110001', '560011', '560066', '560100'],
};

export const useStore = create<LaundryStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      setCurrentUser: (user) => set({ currentUser: user }),
      
      checkAvailability: (pinCode) => {
        return get().availablePinCodes.includes(pinCode);
      },
      
      reset: () => set(initialState),
    }),
    {
      name: 'laundry-store',
    }
  )
);
