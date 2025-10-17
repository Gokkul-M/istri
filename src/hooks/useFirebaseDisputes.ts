import { useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc, updateDoc, doc, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Dispute } from '@/store/useStore';
import { useAuth } from './useFirebaseAuth';

export function useFirebaseDisputes() {
  const { user } = useAuth();
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setDisputes([]);
      setLoading(false);
      return;
    }

    let disputesQuery;

    if (user.role === 'admin') {
      // Admin sees all disputes
      disputesQuery = query(
        collection(db, 'disputes'),
        orderBy('createdAt', 'desc')
      );
    } else if (user.role === 'customer') {
      // Customer sees their own disputes
      disputesQuery = query(
        collection(db, 'disputes'),
        where('customerId', '==', user.id),
        orderBy('createdAt', 'desc')
      );
    } else if (user.role === 'launderer') {
      // Launderer sees disputes related to them
      disputesQuery = query(
        collection(db, 'disputes'),
        where('laundererId', '==', user.id),
        orderBy('createdAt', 'desc')
      );
    }

    if (!disputesQuery) {
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(disputesQuery, (snapshot) => {
      const disputesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Dispute[];
      setDisputes(disputesData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const addDispute = async (dispute: Omit<Dispute, 'id' | 'createdAt' | 'status'>) => {
    const newDispute = {
      ...dispute,
      status: 'open',
      createdAt: new Date().toISOString()
    };
    const docRef = await addDoc(collection(db, 'disputes'), newDispute);
    return docRef.id;
  };

  const updateDispute = async (id: string, updates: Partial<Dispute>) => {
    const disputeRef = doc(db, 'disputes', id);
    await updateDoc(disputeRef, updates);
  };

  return {
    disputes,
    loading,
    addDispute,
    updateDispute
  };
}
