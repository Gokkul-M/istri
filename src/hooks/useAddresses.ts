import { useState, useEffect } from 'react';
import { firestoreService, Address } from '@/lib/firebase/firestore';
import { useFirebaseAuth } from './useFirebaseAuth';

export function useAddresses() {
  const { firebaseUser } = useFirebaseAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!firebaseUser?.uid) {
      setAddresses([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = firestoreService.onAddressesChange(
      firebaseUser.uid,
      (updatedAddresses) => {
        setAddresses(updatedAddresses);
        setLoading(false);
        setError(null);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [firebaseUser?.uid]);

  const addAddress = async (address: Omit<Address, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!firebaseUser?.uid) throw new Error('User not authenticated');
    
    try {
      const addressId = await firestoreService.addAddress(firebaseUser.uid, address);
      return addressId;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const updateAddress = async (addressId: string, updates: Partial<Address>) => {
    if (!firebaseUser?.uid) throw new Error('User not authenticated');
    
    try {
      await firestoreService.updateAddress(firebaseUser.uid, addressId, updates);
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const deleteAddress = async (addressId: string) => {
    if (!firebaseUser?.uid) throw new Error('User not authenticated');
    
    try {
      await firestoreService.deleteAddress(firebaseUser.uid, addressId);
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const setDefaultAddress = async (addressId: string) => {
    if (!firebaseUser?.uid) throw new Error('User not authenticated');
    
    try {
      await firestoreService.setDefaultAddress(firebaseUser.uid, addressId);
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  return {
    addresses,
    loading,
    error,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
  };
}
