import { db } from './config';
import { doc, getDoc, setDoc, updateDoc, runTransaction } from 'firebase/firestore';

export type UserRole = 'customer' | 'launderer' | 'admin';

interface IdCounter {
  customer: number;
  launderer: number;
  admin: number;
}

const COUNTER_DOC_ID = 'userIdCounters';

/**
 * Get the prefix for a user role
 */
const getRolePrefix = (role: UserRole): string => {
  switch (role) {
    case 'customer':
      return 'CUST';
    case 'launderer':
      return 'LAUN';
    case 'admin':
      return 'ADMIN';
  }
};

/**
 * Format a number with leading zeros (e.g., 1 -> 0001)
 */
const formatNumber = (num: number): string => {
  return num.toString().padStart(4, '0');
};

/**
 * Initialize the counter document if it doesn't exist
 */
export const initializeCounters = async (): Promise<void> => {
  const counterRef = doc(db, 'counters', COUNTER_DOC_ID);
  const counterDoc = await getDoc(counterRef);

  if (!counterDoc.exists()) {
    await setDoc(counterRef, {
      customer: 0,
      launderer: 0,
      admin: 0,
    });
  }
};

/**
 * Generate a new custom ID for a user based on their role
 * Uses a transaction to ensure atomicity and prevent duplicate IDs
 */
export const generateCustomId = async (role: UserRole): Promise<string> => {
  const counterRef = doc(db, 'counters', COUNTER_DOC_ID);

  try {
    const customId = await runTransaction(db, async (transaction) => {
      const counterDoc = await transaction.get(counterRef);

      if (!counterDoc.exists()) {
        // Initialize counters if they don't exist
        transaction.set(counterRef, {
          customer: 0,
          launderer: 0,
          admin: 0,
        });
      }

      const currentCounters = counterDoc.data() as IdCounter || {
        customer: 0,
        launderer: 0,
        admin: 0,
      };

      // Increment the counter for this role
      const newCount = (currentCounters[role] || 0) + 1;
      
      // Update the counter
      transaction.update(counterRef, {
        [role]: newCount,
      });

      // Generate the custom ID
      const prefix = getRolePrefix(role);
      return `${prefix}-${formatNumber(newCount)}`;
    });

    return customId;
  } catch (error) {
    console.error('Error generating custom ID:', error);
    throw new Error('Failed to generate custom ID');
  }
};

/**
 * Create a mapping between Firebase UID and custom ID
 */
export const createUserMapping = async (
  firebaseUid: string,
  customId: string
): Promise<void> => {
  try {
    // Store mapping: firebaseUID -> customId
    await setDoc(doc(db, 'userMapping', firebaseUid), {
      customId,
      createdAt: new Date().toISOString(),
    });

    // Store reverse mapping: customId -> firebaseUID (for quick lookups)
    await setDoc(doc(db, 'customIdMapping', customId), {
      firebaseUid,
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error creating user mapping:', error);
    throw error;
  }
};

/**
 * Get custom ID from Firebase UID
 */
export const getCustomIdFromFirebaseUid = async (
  firebaseUid: string
): Promise<string | null> => {
  try {
    const mappingDoc = await getDoc(doc(db, 'userMapping', firebaseUid));
    if (mappingDoc.exists()) {
      return mappingDoc.data().customId;
    }
    return null;
  } catch (error) {
    console.error('Error getting custom ID:', error);
    return null;
  }
};

/**
 * Get Firebase UID from custom ID
 */
export const getFirebaseUidFromCustomId = async (
  customId: string
): Promise<string | null> => {
  try {
    const mappingDoc = await getDoc(doc(db, 'customIdMapping', customId));
    if (mappingDoc.exists()) {
      return mappingDoc.data().firebaseUid;
    }
    return null;
  } catch (error) {
    console.error('Error getting Firebase UID:', error);
    return null;
  }
};
