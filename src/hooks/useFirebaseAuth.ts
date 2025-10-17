import { useEffect, useState } from 'react';
import { authService } from '@/lib/firebase';
import { useStore } from '@/store/useStore';
import type { User as FirebaseUser } from 'firebase/auth';
import type { User } from '@/store/useStore';

export function useFirebaseAuth() {
  const [loading, setLoading] = useState(true);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const { setCurrentUser } = useStore();

  useEffect(() => {
    const unsubscribe = authService.onAuthChange(async (user) => {
      setFirebaseUser(user);
      
      if (user) {
        try {
          const userProfile = await authService.getUserProfile(user.uid);
          setCurrentUser(userProfile);
        } catch (error) {
          console.error('Error fetching user profile:', error);
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setCurrentUser]);

  return { firebaseUser, loading };
}

export function useAuth() {
  const { currentUser } = useStore();
  const { firebaseUser, loading } = useFirebaseAuth();

  const signOut = async () => {
    try {
      await authService.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  return {
    user: currentUser,
    firebaseUser,
    loading,
    signOut,
    isAuthenticated: !!currentUser,
  };
}
