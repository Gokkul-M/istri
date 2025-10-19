import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Order } from '@/store/useStore';

export function useFirebaseOrder(orderId: string | undefined) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      setError('No order ID provided');
      return;
    }

    const orderRef = doc(db, 'orders', orderId);

    const unsubscribe = onSnapshot(
      orderRef,
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          setOrder({ id: docSnapshot.id, ...docSnapshot.data() } as Order);
          setError(null);
        } else {
          setOrder(null);
          setError('Order not found');
        }
        setLoading(false);
      },
      (err) => {
        console.error('Error fetching order:', err);
        setError('Failed to fetch order');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [orderId]);

  return { order, loading, error };
}
