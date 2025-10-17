import { useEffect, useState } from 'react';
import { firestoreService } from '@/lib/firebase';
import { where } from 'firebase/firestore';
import type { Order, OrderStatus } from '@/store/useStore';

export function useFirestoreOrders(userId?: string, role?: 'customer' | 'launderer' | 'admin') {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId || !role) {
      setLoading(false);
      return;
    }

    setLoading(true);
    
    const constraints = [];
    
    if (role === 'customer') {
      constraints.push(where('customerId', '==', userId));
    } else if (role === 'launderer') {
      constraints.push(where('laundererId', '==', userId));
    }

    const unsubscribe = firestoreService.onOrdersChange(
      (updatedOrders) => {
        setOrders(updatedOrders);
        setLoading(false);
      },
      constraints
    );

    return () => unsubscribe();
  }, [userId, role]);

  return { orders, loading, error };
}

export function useOrder(orderId: string) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        setLoading(true);
        const data = await firestoreService.getOrder(orderId);
        setOrder(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  return { order, loading, error };
}
