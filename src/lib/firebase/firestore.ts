import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  Timestamp,
  QueryConstraint,
  writeBatch,
} from 'firebase/firestore';
import { db } from './config';
import type { User, Order, Service, Coupon, Dispute, Message, UserRole, OrderStatus } from '@/store/useStore';

export interface Address {
  id: string;
  userId: string;
  label: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export class FirestoreService {
  // Users
  async createUser(user: User) {
    await setDoc(doc(db, 'users', user.id), {
      ...user,
      createdAt: Timestamp.now(),
    });
  }

  async getUser(userId: string): Promise<User | null> {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return userDoc.data() as User;
    }
    return null;
  }

  async getAllUsers(): Promise<User[]> {
    const usersSnapshot = await getDocs(collection(db, 'users'));
    return usersSnapshot.docs.map(doc => doc.data() as User);
  }

  async getUsersByRole(role: UserRole): Promise<User[]> {
    const q = query(collection(db, 'users'), where('role', '==', role));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as User);
  }

  async updateUser(userId: string, updates: Partial<User>) {
    await updateDoc(doc(db, 'users', userId), {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  }

  async deleteUser(userId: string) {
    await deleteDoc(doc(db, 'users', userId));
  }

  // Services
  async createService(service: Service) {
    const docRef = await addDoc(collection(db, 'services'), {
      ...service,
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  }

  async getAllServices(): Promise<Service[]> {
    const servicesSnapshot = await getDocs(collection(db, 'services'));
    return servicesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as Service));
  }

  async updateService(serviceId: string, updates: Partial<Service>) {
    await updateDoc(doc(db, 'services', serviceId), {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  }

  async deleteService(serviceId: string) {
    await deleteDoc(doc(db, 'services', serviceId));
  }

  // Orders
  async createOrder(order: Omit<Order, 'id'>) {
    const docRef = await addDoc(collection(db, 'orders'), {
      ...order,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  }

  async getOrder(orderId: string): Promise<Order | null> {
    const orderDoc = await getDoc(doc(db, 'orders', orderId));
    if (orderDoc.exists()) {
      return { id: orderDoc.id, ...orderDoc.data() } as Order;
    }
    return null;
  }

  async getAllOrders(): Promise<Order[]> {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as Order));
  }

  async getOrdersByCustomer(customerId: string): Promise<Order[]> {
    const q = query(
      collection(db, 'orders'),
      where('customerId', '==', customerId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as Order));
  }

  async getOrdersByLaunderer(laundererId: string): Promise<Order[]> {
    const q = query(
      collection(db, 'orders'),
      where('laundererId', '==', laundererId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as Order));
  }

  async getOrdersByStatus(status: OrderStatus): Promise<Order[]> {
    const q = query(
      collection(db, 'orders'),
      where('status', '==', status),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as Order));
  }

  async updateOrder(orderId: string, updates: Partial<Order>) {
    await updateDoc(doc(db, 'orders', orderId), {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  }

  async deleteOrder(orderId: string) {
    await deleteDoc(doc(db, 'orders', orderId));
  }

  // Invoice tracking
  async trackInvoiceGeneration(orderId: string) {
    const orderRef = doc(db, 'orders', orderId);
    const orderDoc = await getDoc(orderRef);
    
    if (orderDoc.exists()) {
      const currentDownloadCount = orderDoc.data().invoiceDownloadCount || 0;
      await updateDoc(orderRef, {
        invoiceGeneratedAt: orderDoc.data().invoiceGeneratedAt || Timestamp.now().toDate().toISOString(),
        invoiceDownloadCount: currentDownloadCount + 1,
        updatedAt: Timestamp.now(),
      });
    }
  }

  // Real-time order listener
  onOrdersChange(callback: (orders: Order[]) => void, constraints: QueryConstraint[] = []) {
    const q = query(
      collection(db, 'orders'),
      orderBy('createdAt', 'desc'),
      ...constraints
    );
    return onSnapshot(q, (snapshot) => {
      const orders = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as Order));
      callback(orders);
    });
  }

  // Coupons
  async createCoupon(coupon: Coupon) {
    const docRef = await addDoc(collection(db, 'coupons'), {
      ...coupon,
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  }

  async getAllCoupons(): Promise<Coupon[]> {
    const snapshot = await getDocs(collection(db, 'coupons'));
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as Coupon));
  }

  async getActiveCoupons(): Promise<Coupon[]> {
    const q = query(collection(db, 'coupons'), where('isActive', '==', true));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as Coupon));
  }

  async getCouponByCode(code: string): Promise<Coupon | null> {
    const q = query(collection(db, 'coupons'), where('code', '==', code));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      return { id: doc.id, ...doc.data() } as Coupon;
    }
    return null;
  }

  async updateCoupon(couponId: string, updates: Partial<Coupon>) {
    await updateDoc(doc(db, 'coupons', couponId), {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  }

  async deleteCoupon(couponId: string) {
    await deleteDoc(doc(db, 'coupons', couponId));
  }

  // Disputes
  async createDispute(dispute: Dispute) {
    const docRef = await addDoc(collection(db, 'disputes'), {
      ...dispute,
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  }

  async getAllDisputes(): Promise<Dispute[]> {
    const q = query(collection(db, 'disputes'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as Dispute));
  }

  async getDisputesByStatus(status: Dispute['status']): Promise<Dispute[]> {
    const q = query(
      collection(db, 'disputes'),
      where('status', '==', status),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as Dispute));
  }

  async updateDispute(disputeId: string, updates: Partial<Dispute>) {
    await updateDoc(doc(db, 'disputes', disputeId), {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  }

  async deleteDispute(disputeId: string) {
    await deleteDoc(doc(db, 'disputes', disputeId));
  }

  // Messages
  async createMessage(message: Message) {
    const docRef = await addDoc(collection(db, 'messages'), {
      ...message,
      timestamp: Timestamp.now(),
    });
    return docRef.id;
  }

  async getMessagesBetweenUsers(userId1: string, userId2: string): Promise<Message[]> {
    const q = query(
      collection(db, 'messages'),
      where('senderId', 'in', [userId1, userId2]),
      where('receiverId', 'in', [userId1, userId2]),
      orderBy('timestamp', 'asc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as Message));
  }

  async getMessagesForUser(userId: string): Promise<Message[]> {
    const q = query(
      collection(db, 'messages'),
      where('receiverId', '==', userId),
      orderBy('timestamp', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as Message));
  }

  async markMessageAsRead(messageId: string) {
    await updateDoc(doc(db, 'messages', messageId), {
      read: true,
    });
  }

  // Real-time message listener
  onMessagesChange(userId: string, callback: (messages: Message[]) => void) {
    const q = query(
      collection(db, 'messages'),
      where('receiverId', '==', userId),
      orderBy('timestamp', 'desc')
    );
    return onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as Message));
      callback(messages);
    });
  }

  // Addresses
  async getUserAddresses(userId: string): Promise<Address[]> {
    // Temporarily use single orderBy to test if basic query works
    const q = query(
      collection(db, 'users', userId, 'addresses'),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as Address));
  }

  async addAddress(userId: string, address: Omit<Address, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const addressData = {
      ...address,
      userId,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    if (address.isDefault) {
      const batch = writeBatch(db);
      const addressesRef = collection(db, 'users', userId, 'addresses');
      const existingAddresses = await getDocs(addressesRef);
      
      existingAddresses.forEach((doc) => {
        batch.update(doc.ref, { isDefault: false });
      });

      const newAddressRef = doc(addressesRef);
      batch.set(newAddressRef, addressData);
      
      await batch.commit();
      return newAddressRef.id;
    } else {
      const docRef = await addDoc(collection(db, 'users', userId, 'addresses'), addressData);
      return docRef.id;
    }
  }

  async updateAddress(userId: string, addressId: string, updates: Partial<Address>): Promise<void> {
    if (updates.isDefault) {
      const batch = writeBatch(db);
      const addressesRef = collection(db, 'users', userId, 'addresses');
      const existingAddresses = await getDocs(addressesRef);
      
      existingAddresses.forEach((doc) => {
        if (doc.id !== addressId) {
          batch.update(doc.ref, { isDefault: false });
        }
      });

      batch.update(doc(db, 'users', userId, 'addresses', addressId), {
        ...updates,
        updatedAt: Timestamp.now(),
      });
      
      await batch.commit();
    } else {
      await updateDoc(doc(db, 'users', userId, 'addresses', addressId), {
        ...updates,
        updatedAt: Timestamp.now(),
      });
    }
  }

  async deleteAddress(userId: string, addressId: string): Promise<void> {
    await deleteDoc(doc(db, 'users', userId, 'addresses', addressId));
  }

  async setDefaultAddress(userId: string, addressId: string): Promise<void> {
    const batch = writeBatch(db);
    const addressesRef = collection(db, 'users', userId, 'addresses');
    const existingAddresses = await getDocs(addressesRef);
    
    existingAddresses.forEach((doc) => {
      if (doc.id === addressId) {
        batch.update(doc.ref, { isDefault: true, updatedAt: Timestamp.now() });
      } else {
        batch.update(doc.ref, { isDefault: false });
      }
    });
    
    await batch.commit();
  }

  onAddressesChange(userId: string, callback: (addresses: Address[]) => void, onError?: (error: Error) => void) {
    // Temporarily use single orderBy to test if basic query works
    const q = query(
      collection(db, 'users', userId, 'addresses'),
      orderBy('createdAt', 'desc')
    );
    return onSnapshot(q, 
      (snapshot) => {
        const addresses = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        } as Address));
        callback(addresses);
      },
      (error: any) => {
        console.error('Address listener error:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        if (error.message) {
          console.error('Full error message:', error.message);
        }
        if (onError) {
          onError(error as Error);
        }
      }
    );
  }

  // Batch operations for seeding data
  async seedData(data: {
    users?: User[];
    services?: Service[];
    orders?: Order[];
    coupons?: Coupon[];
    disputes?: Dispute[];
  }) {
    const batch = writeBatch(db);

    if (data.users) {
      data.users.forEach((user) => {
        const ref = doc(db, 'users', user.id);
        batch.set(ref, { ...user, createdAt: Timestamp.now() });
      });
    }

    if (data.services) {
      data.services.forEach((service) => {
        const ref = doc(collection(db, 'services'));
        batch.set(ref, { ...service, createdAt: Timestamp.now() });
      });
    }

    if (data.orders) {
      data.orders.forEach((order) => {
        const ref = doc(collection(db, 'orders'));
        batch.set(ref, { ...order, createdAt: Timestamp.now(), updatedAt: Timestamp.now() });
      });
    }

    if (data.coupons) {
      data.coupons.forEach((coupon) => {
        const ref = doc(collection(db, 'coupons'));
        batch.set(ref, { ...coupon, createdAt: Timestamp.now() });
      });
    }

    if (data.disputes) {
      data.disputes.forEach((dispute) => {
        const ref = doc(collection(db, 'disputes'));
        batch.set(ref, { ...dispute, createdAt: Timestamp.now() });
      });
    }

    await batch.commit();
  }
}

export const firestoreService = new FirestoreService();
