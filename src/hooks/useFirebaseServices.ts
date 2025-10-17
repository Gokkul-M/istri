import { useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Service } from '@/store/useStore';

export function useFirebaseServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'services'),
      (snapshot) => {
        const servicesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Service[];
        setServices(servicesData);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const addService = async (service: Omit<Service, 'id'>) => {
    const docRef = await addDoc(collection(db, 'services'), service);
    return docRef.id;
  };

  const updateService = async (id: string, updates: Partial<Service>) => {
    const serviceRef = doc(db, 'services', id);
    await updateDoc(serviceRef, updates);
  };

  const deleteService = async (id: string) => {
    await deleteDoc(doc(db, 'services', id));
  };

  return {
    services,
    loading,
    addService,
    updateService,
    deleteService
  };
}
