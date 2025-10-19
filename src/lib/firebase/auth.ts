import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  PhoneAuthProvider,
  signInWithCredential,
  deleteUser,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth } from './config';
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from './config';
import type { User, UserRole } from '@/store/useStore';
import { generateCustomId, createUserMapping, getCustomIdFromFirebaseUid } from './idGenerator';

export class AuthService {
  private recaptchaVerifier: RecaptchaVerifier | null = null;

  initRecaptcha(containerId: string) {
    if (!this.recaptchaVerifier) {
      this.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
        size: 'invisible',
        callback: () => {
          console.log('reCAPTCHA verified');
        },
      });
    }
    return this.recaptchaVerifier;
  }

  async sendOTP(phoneNumber: string, recaptchaContainerId: string) {
    try {
      const recaptcha = this.initRecaptcha(recaptchaContainerId);
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptcha);
      return confirmationResult;
    } catch (error) {
      console.error('Error sending OTP:', error);
      throw error;
    }
  }

  async verifyOTP(verificationId: string, code: string) {
    try {
      const credential = PhoneAuthProvider.credential(verificationId, code);
      const result = await signInWithCredential(auth, credential);
      return result.user;
    } catch (error) {
      console.error('Error verifying OTP:', error);
      throw error;
    }
  }

  async signInWithEmail(email: string, password: string) {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result.user;
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  }

  async createAccount(email: string, password: string) {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      return result.user;
    } catch (error) {
      console.error('Error creating account:', error);
      throw error;
    }
  }

  async signOut() {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }

  async deleteAccount() {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('No user is currently signed in');
      }

      // Get custom ID from Firebase UID
      const customId = await getCustomIdFromFirebaseUid(user.uid);
      
      if (customId) {
        // Delete user profile from Firestore using custom ID
        await deleteDoc(doc(db, 'users', customId));
        
        // Delete mappings
        await deleteDoc(doc(db, 'userMapping', user.uid));
        await deleteDoc(doc(db, 'customIdMapping', customId));
      }

      // Delete Firebase Auth account
      await deleteUser(user);
    } catch (error) {
      console.error('Error deleting account:', error);
      throw error;
    }
  }

  onAuthChange(callback: (user: FirebaseUser | null) => void) {
    return onAuthStateChanged(auth, callback);
  }

  async getUserProfile(firebaseUid: string): Promise<User | null> {
    try {
      // Get custom ID from Firebase UID
      const customId = await getCustomIdFromFirebaseUid(firebaseUid);
      if (!customId) {
        console.log('No custom ID mapping found for Firebase UID:', firebaseUid);
        return null;
      }

      // Fetch user profile using custom ID
      const userDoc = await getDoc(doc(db, 'users', customId));
      if (userDoc.exists()) {
        return userDoc.data() as User;
      }
      return null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  }

  async createUserProfile(firebaseUid: string, userData: Omit<User, 'id'>) {
    try {
      // Generate custom ID based on role
      const customId = await generateCustomId(userData.role);

      // Create mapping between Firebase UID and custom ID
      await createUserMapping(firebaseUid, customId);

      // Create user profile with custom ID as document ID
      const user: User = {
        id: customId,
        firebaseUid: firebaseUid, // Store Firebase UID for reference
        ...userData,
      };
      await setDoc(doc(db, 'users', customId), user);
      return user;
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }
  }

  getCurrentUser() {
    return auth.currentUser;
  }
}

export const authService = new AuthService();
