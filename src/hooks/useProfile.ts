import { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase/config';
import { useToast } from '@/hooks/use-toast';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  role: 'customer' | 'launderer' | 'admin';
  createdAt?: Date;
  businessName?: string;
  businessLogo?: string;
  businessDescription?: string;
  businessAddress?: string;
  businessHours?: string;
}

export const useProfile = (userId: string | null) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const userRef = doc(db, 'users', userId);

    // Real-time listener for profile updates
    const unsubscribe = onSnapshot(
      userRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          setProfile({
            id: snapshot.id,
            ...data,
            createdAt: data.createdAt?.toDate(),
          } as UserProfile);
        } else {
          setProfile(null);
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching profile:', error);
        toast({
          title: 'Error',
          description: 'Failed to load profile',
          variant: 'destructive',
        });
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId, toast]);

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!userId) return;

    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        ...updates,
        updatedAt: new Date(),
      });

      toast({
        title: 'Profile Updated',
        description: 'Your profile has been updated successfully.',
      });

      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Update Failed',
        description: 'Failed to update profile. Please try again.',
        variant: 'destructive',
      });
      return false;
    }
  };

  const uploadProfileImage = async (file: File, type: 'avatar' | 'businessLogo' = 'avatar') => {
    if (!userId) return null;

    try {
      setUploading(true);

      // Create a unique filename
      const filename = `${type}_${userId}_${Date.now()}.${file.name.split('.').pop()}`;
      const storageRef = ref(storage, `profile-images/${userId}/${filename}`);

      // Upload the file
      await uploadBytes(storageRef, file);

      // Get the download URL
      const downloadURL = await getDownloadURL(storageRef);

      // Update the profile with the new image URL
      await updateProfile({
        [type]: downloadURL,
      });

      toast({
        title: 'Image Uploaded',
        description: 'Your image has been uploaded successfully.',
      });

      return downloadURL;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: 'Upload Failed',
        description: 'Failed to upload image. Please try again.',
        variant: 'destructive',
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  return {
    profile,
    loading,
    uploading,
    updateProfile,
    uploadProfileImage,
  };
};
