import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, addDoc, updateDoc, doc, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Order, OrderStatus } from '@/store/useStore';
import { useAuth } from './useFirebaseAuth';

export function useFirebaseOrders(limitCount: number = 50) {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setOrders([]);
      setLoading(false);
      return;
    }

    let ordersQuery;
    
    if (user.role === 'admin') {
      // Admin sees all orders, limited to recent ones for performance
      ordersQuery = query(
        collection(db, 'orders'),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
    } else if (user.role === 'customer') {
      // Customer sees their own orders, limited to recent ones
      ordersQuery = query(
        collection(db, 'orders'),
        where('customerId', '==', user.id),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
    } else if (user.role === 'launderer') {
      // Launderer sees assigned orders, limited to recent ones
      ordersQuery = query(
        collection(db, 'orders'),
        where('laundererId', '==', user.id),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
    }

    if (!ordersQuery) {
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(ordersQuery, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Order[];
      setOrders(ordersData);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching orders:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, limitCount]);

  const createOrder = async (orderData: Omit<Order, 'id'>) => {
    const docRef = await addDoc(collection(db, 'orders'), orderData);
    return docRef.id;
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, {
      status,
      updatedAt: new Date().toISOString()
    });
  };

  const updateOrder = async (orderId: string, updates: Partial<Order>) => {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, {
      ...updates,
      updatedAt: new Date().toISOString()
    });
  };

  const assignLaunderer = async (orderId: string, laundererId: string, laundererData: { name: string; phone: string }) => {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, {
      laundererId,
      laundererName: laundererData.name,
      laundererPhone: laundererData.phone,
      status: 'confirmed',
      updatedAt: new Date().toISOString()
    });
  };

  return {
    orders,
    loading,
    createOrder,
    updateOrderStatus,
    updateOrder,
    assignLaunderer
  };
}
