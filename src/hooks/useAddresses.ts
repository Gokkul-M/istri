import { useState, useEffect, useMemo } from 'react';
import { firestoreService, Address } from '@/lib/firebase/firestore';
import { useAuth } from './useFirebaseAuth';

export function useAddresses() {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user?.id) {
      setAddresses([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = firestoreService.onAddressesChange(
      user.id,
      (updatedAddresses) => {
        setAddresses(updatedAddresses);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Address fetch error:', err);
        setError(err as Error);
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [user?.id]);

  // Memoize default address for better performance
  const defaultAddress = useMemo(() => {
    return addresses.find(addr => addr.isDefault);
  }, [addresses]);

  const addAddress = async (address: Omit<Address, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!user?.id) throw new Error('User not authenticated');
    
    try {
      const addressId = await firestoreService.addAddress(user.id, address);
      return addressId;
    } catch (err) {
      console.error('Error adding address:', err);
      setError(err as Error);
      throw err;
    }
  };

  const updateAddress = async (addressId: string, updates: Partial<Address>) => {
    if (!user?.id) throw new Error('User not authenticated');
    
    try {
      await firestoreService.updateAddress(user.id, addressId, updates);
    } catch (err) {
      console.error('Error updating address:', err);
      setError(err as Error);
      throw err;
    }
  };

  const deleteAddress = async (addressId: string) => {
    if (!user?.id) throw new Error('User not authenticated');
    
    try {
      await firestoreService.deleteAddress(user.id, addressId);
    } catch (err) {
      console.error('Error deleting address:', err);
      setError(err as Error);
      throw err;
    }
  };

  const setDefaultAddress = async (addressId: string) => {
    if (!user?.id) throw new Error('User not authenticated');
    
    try {
      await firestoreService.setDefaultAddress(user.id, addressId);
    } catch (err) {
      console.error('Error setting default address:', err);
      setError(err as Error);
      throw err;
    }
  };

  return {
    addresses,
    defaultAddress,
    loading,
    error,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
  };
}
