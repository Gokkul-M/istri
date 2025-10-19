import { useState, useEffect, useRef } from 'react';
import { collection, query, where, onSnapshot, addDoc, updateDoc, doc, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Order, OrderStatus } from '@/store/useStore';
import { useAuth } from './useFirebaseAuth';

export function useFirebaseOrders(limitCount: number = 50) {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const retryCountRef = useRef(0);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const MAX_RETRIES = 1;

  useEffect(() => {
    if (!user) {
      setOrders([]);
      setLoading(false);
      setError(null);
      return;
    }

    let ordersQuery;
    
    if (user.role === 'admin') {
      ordersQuery = query(
        collection(db, 'orders'),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
    } else if (user.role === 'customer') {
      ordersQuery = query(
        collection(db, 'orders'),
        where('customerId', '==', user.id),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
    } else if (user.role === 'launderer') {
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

    const setupListener = () => {
      const unsubscribe = onSnapshot(
        ordersQuery!,
        {
          next: (snapshot) => {
            const ordersData = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            })) as Order[];
            setOrders(ordersData);
            setLoading(false);
            setError(null);
            retryCountRef.current = 0;
          },
          error: (err) => {
            console.error('Error fetching orders:', err);
            setError(err as Error);
            setLoading(false);
            
            if (retryCountRef.current < MAX_RETRIES) {
              if (retryTimeoutRef.current) {
                clearTimeout(retryTimeoutRef.current);
              }
              retryCountRef.current += 1;
              retryTimeoutRef.current = setTimeout(() => {
                console.log('Retrying order fetch... (attempt ' + retryCountRef.current + ')');
                setLoading(true);
                if (unsubscribeRef.current) {
                  unsubscribeRef.current();
                }
                setupListener();
              }, 3000);
            }
          }
        }
      );
      
      unsubscribeRef.current = unsubscribe;
    };

    setupListener();

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
      retryCountRef.current = 0;
    };
  }, [user?.id, user?.role, limitCount]);

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
    error,
    createOrder,
    updateOrderStatus,
    updateOrder,
    assignLaunderer
  };
}
