import { firestoreService } from './firestore';
import type { User, Service, Order, Coupon, Dispute } from '@/store/useStore';

const mockServices: Service[] = [
  { id: '1', name: 'Wash & Fold', icon: 'Waves', price: 120, description: 'Complete wash, dry, and fold service' },
  { id: '2', name: 'Dry Cleaning', icon: 'Sparkles', price: 200, description: 'Professional dry cleaning for delicate items' },
  { id: '3', name: 'Ironing', icon: 'Zap', price: 80, description: 'Steam ironing and pressing' },
  { id: '4', name: 'Stain Removal', icon: 'Droplet', price: 150, description: 'Advanced stain treatment' },
  { id: '5', name: 'Shoe Cleaning', icon: 'ShoppingBag', price: 100, description: 'Deep cleaning for all footwear' },
  { id: '6', name: 'Carpet Cleaning', icon: 'Home', price: 300, description: 'Professional carpet deep clean' },
];

const mockLaunderers: User[] = [
  {
    id: 'L1',
    role: 'launderer',
    name: 'Rajesh Kumar',
    email: 'rajesh@cleanwash.com',
    phone: '+919876543210',
    address: '45, MG Road, Bangalore',
    pinCode: '560001',
    businessName: 'CleanWash Pro',
    businessDescription: 'Premium laundry services with 15+ years of experience',
    pricePerKg: 50,
    rating: 4.8,
    distance: 1.2,
    verified: true,
    verificationDate: '2024-01-10T10:00:00Z',
  },
  {
    id: 'L2',
    role: 'launderer',
    name: 'Priya Sharma',
    email: 'priya@sparklelaundry.com',
    phone: '+919876543211',
    address: '12, Brigade Road, Bangalore',
    pinCode: '560001',
    businessName: 'Sparkle Laundry',
    businessDescription: 'Eco-friendly cleaning solutions',
    pricePerKg: 45,
    rating: 4.6,
    distance: 2.5,
    verified: true,
    verificationDate: '2024-01-15T14:30:00Z',
  },
  {
    id: 'L3',
    role: 'launderer',
    name: 'Amit Patel',
    email: 'amit@freshclean.com',
    phone: '+919876543212',
    address: '78, Indiranagar, Bangalore',
    pinCode: '560038',
    businessName: 'Fresh & Clean',
    businessDescription: 'Express laundry with same-day delivery',
    pricePerKg: 55,
    rating: 4.9,
    distance: 0.8,
    verified: true,
    verificationDate: '2024-01-05T09:15:00Z',
  },
];

const mockCustomers: User[] = [
  {
    id: 'C1',
    role: 'customer',
    name: 'Arjun Mehta',
    email: 'arjun@email.com',
    phone: '+919123456780',
    address: '101, Lavelle Road, Bangalore',
    pinCode: '560001',
    isActive: true,
    assignedLaundererId: 'L1',
  },
  {
    id: 'C2',
    role: 'customer',
    name: 'Neha Kapoor',
    email: 'neha@email.com',
    phone: '+919123456781',
    address: '45, Residency Road, Bangalore',
    pinCode: '560001',
    isActive: true,
    assignedLaundererId: 'L2',
  },
];

const mockOrders: Order[] = [
  {
    id: 'ORD001',
    customerId: 'C1',
    customerName: 'Arjun Mehta',
    customerPhone: '+919123456780',
    customerAddress: '101, Lavelle Road, Bangalore',
    laundererId: 'L1',
    laundererName: 'CleanWash Pro',
    laundererPhone: '+919876543210',
    items: [
      { serviceId: '1', serviceName: 'Wash & Fold', quantity: 3, price: 120 },
      { serviceId: '3', serviceName: 'Ironing', quantity: 2, price: 80 },
    ],
    totalAmount: 520,
    status: 'completed',
    pickupTime: '2024-01-20T10:00:00Z',
    deliveryTime: '2024-01-21T18:00:00Z',
    qrCode: 'QR-ORD001',
    createdAt: '2024-01-19T08:30:00Z',
    updatedAt: '2024-01-21T18:00:00Z',
    rating: 5,
    feedback: 'Excellent service!',
  },
  {
    id: 'ORD002',
    customerId: 'C2',
    customerName: 'Neha Kapoor',
    customerPhone: '+919123456781',
    customerAddress: '45, Residency Road, Bangalore',
    laundererId: 'L2',
    laundererName: 'Sparkle Laundry',
    laundererPhone: '+919876543211',
    items: [
      { serviceId: '2', serviceName: 'Dry Cleaning', quantity: 1, price: 200 },
    ],
    totalAmount: 200,
    status: 'in_progress',
    pickupTime: '2024-01-22T09:00:00Z',
    deliveryTime: '2024-01-23T17:00:00Z',
    qrCode: 'QR-ORD002',
    createdAt: '2024-01-21T14:20:00Z',
    updatedAt: '2024-01-23T15:30:00Z',
  },
];

const mockCoupons: Coupon[] = [
  {
    id: 'CPN001',
    code: 'SAVE20',
    discount: 20,
    description: 'Get 20% off on all services',
    validFrom: '2024-01-01',
    validUntil: '2024-06-30',
    usageLimit: 100,
    usedCount: 15,
    isActive: true,
    createdBy: 'ADMIN',
    assignedTo: ['C1', 'C2'],
  },
  {
    id: 'CPN002',
    code: 'FIRST50',
    discount: 50,
    description: 'First order special - 50% off',
    validFrom: '2024-01-01',
    validUntil: '2024-12-31',
    usageLimit: 200,
    usedCount: 45,
    isActive: true,
    createdBy: 'ADMIN',
  },
];

const mockDisputes: Dispute[] = [
  {
    id: 'DSP001',
    orderId: 'ORD001',
    customerId: 'C1',
    laundererId: 'L1',
    subject: 'Damaged clothing item',
    description: 'My shirt was damaged during the cleaning process',
    status: 'resolved',
    priority: 'high',
    createdAt: '2024-01-21T10:00:00Z',
    resolvedAt: '2024-01-22T16:00:00Z',
    adminNotes: 'Investigated the issue, launderer compensated customer',
    resolution: 'Full refund provided to customer. Launderer warned about quality control.',
  },
];

export async function seedFirebaseData() {
  try {
    console.log('Starting to seed Firebase data...');
    
    await firestoreService.seedData({
      users: [...mockLaunderers, ...mockCustomers],
      services: mockServices,
      orders: mockOrders,
      coupons: mockCoupons,
      disputes: mockDisputes,
    });
    
    console.log('Firebase data seeded successfully!');
    return true;
  } catch (error) {
    console.error('Error seeding Firebase data:', error);
    throw error;
  }
}
