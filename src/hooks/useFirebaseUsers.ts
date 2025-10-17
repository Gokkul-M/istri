import { useState, useEffect } from 'react';
import { collection, onSnapshot, updateDoc, doc, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { User } from '@/store/useStore';
import { useAuth } from './useFirebaseAuth';

export function useFirebaseUsers() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      setUsers([]);
      setLoading(false);
      return;
    }

    // Only admin can see all users
    if (currentUser.role !== 'admin') {
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      collection(db, 'users'),
      (snapshot) => {
        const usersData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as User[];
        setUsers(usersData);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  const updateUser = async (id: string, updates: Partial<User>) => {
    const userRef = doc(db, 'users', id);
    await updateDoc(userRef, updates);
  };

  const verifyLaunderer = async (id: string, verified: boolean) => {
    const userRef = doc(db, 'users', id);
    await updateDoc(userRef, {
      verified,
      verificationDate: verified ? new Date().toISOString() : null
    });
  };

  const assignLaundererToCustomer = async (customerId: string, laundererId: string) => {
    const customerRef = doc(db, 'users', customerId);
    await updateDoc(customerRef, {
      assignedLaundererId: laundererId
    });
  };

  const getLaunderers = () => users.filter(u => u.role === 'launderer');
  const getCustomers = () => users.filter(u => u.role === 'customer');

  return {
    users,
    loading,
    updateUser,
    verifyLaunderer,
    assignLaundererToCustomer,
    getLaunderers,
    getCustomers
  };
}
