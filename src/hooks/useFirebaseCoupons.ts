import { useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc, updateDoc, doc, deleteDoc, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Coupon } from '@/store/useStore';
import { useAuth } from './useFirebaseAuth';

export function useFirebaseCoupons() {
  const { user } = useAuth();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let couponsQuery;

    if (user?.role === 'admin') {
      // Admin sees all coupons
      couponsQuery = collection(db, 'coupons');
    } else if (user?.role === 'customer') {
      // Customer sees active coupons assigned to them or public coupons
      couponsQuery = query(
        collection(db, 'coupons'),
        where('isActive', '==', true)
      );
    } else {
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(couponsQuery, (snapshot) => {
      let couponsData = snapshot.docs.map(doc => {
        const data = doc.data();
        const { id: _ignoredId, ...restData } = data;
        return {
          id: doc.id,
          ...restData
        };
      }) as Coupon[];

      // Filter customer coupons
      if (user?.role === 'customer') {
        couponsData = couponsData.filter(coupon => {
          const isActive = coupon.isActive && new Date(coupon.validUntil) > new Date();
          const isAvailable = !coupon.assignedTo || 
                             coupon.assignedTo.length === 0 || 
                             coupon.assignedTo.includes(user.id);
          return isActive && isAvailable;
        });
      }

      setCoupons(couponsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const addCoupon = async (coupon: Omit<Coupon, 'id'>) => {
    const docRef = await addDoc(collection(db, 'coupons'), coupon);
    return docRef.id;
  };

  const updateCoupon = async (id: string, updates: Partial<Coupon>) => {
    const couponRef = doc(db, 'coupons', id);
    await updateDoc(couponRef, updates);
  };

  const deleteCoupon = async (id: string) => {
    await deleteDoc(doc(db, 'coupons', id));
  };

  const assignCouponToCustomer = async (couponId: string, customerId: string) => {
    const couponRef = doc(db, 'coupons', couponId);
    const coupon = coupons.find(c => c.id === couponId);
    if (!coupon) return;

    const assignedTo = coupon.assignedTo || [];
    if (!assignedTo.includes(customerId)) {
      await updateDoc(couponRef, {
        assignedTo: [...assignedTo, customerId]
      });
    }
  };

  const incrementCouponUsage = async (couponId: string) => {
    const couponRef = doc(db, 'coupons', couponId);
    const coupon = coupons.find(c => c.id === couponId);
    if (!coupon) return;

    await updateDoc(couponRef, {
      usedCount: (coupon.usedCount || 0) + 1
    });
  };

  return {
    coupons,
    loading,
    addCoupon,
    updateCoupon,
    deleteCoupon,
    assignCouponToCustomer,
    incrementCouponUsage
  };
}
