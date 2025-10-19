import { db } from './config';
import { collection, getDocs, doc, setDoc, updateDoc, writeBatch } from 'firebase/firestore';
import { generateCustomId, createUserMapping } from './idGenerator';
import type { User } from '@/store/useStore';

interface MigrationResult {
  success: boolean;
  migratedCount: number;
  errors: string[];
  mappings: { oldId: string; newId: string; role: string }[];
}

/**
 * Migrate existing users from Firebase UID to custom ID system
 * This will:
 * 1. Scan all existing users
 * 2. Generate custom IDs for each user based on their role
 * 3. Create new user documents with custom IDs
 * 4. Create mapping between Firebase UID and custom ID
 * 5. Update all related documents (orders, addresses, disputes, messages)
 * 6. Delete old user documents
 */
export const migrateUsersToCustomIds = async (): Promise<MigrationResult> => {
  const result: MigrationResult = {
    success: true,
    migratedCount: 0,
    errors: [],
    mappings: [],
  };

  try {
    console.log('Starting user migration to custom IDs...');

    // Step 1: Get all existing users
    const usersSnapshot = await getDocs(collection(db, 'users'));
    const users: Array<{ firebaseUid: string; data: User }> = [];

    usersSnapshot.forEach((doc) => {
      const userData = doc.data() as User;
      // Only migrate users that don't have firebaseUid field (old users)
      if (!userData.firebaseUid && doc.id.length > 10) { // Firebase UIDs are long
        users.push({
          firebaseUid: doc.id,
          data: userData,
        });
      }
    });

    console.log(`Found ${users.length} users to migrate`);

    if (users.length === 0) {
      console.log('No users need migration');
      return result;
    }

    // Step 2: Generate custom IDs and create mappings
    for (const user of users) {
      try {
        const { firebaseUid, data } = user;

        // Generate custom ID based on role
        const customId = await generateCustomId(data.role);
        console.log(`Generated ${customId} for user ${data.name} (${data.role})`);

        // Create mapping
        await createUserMapping(firebaseUid, customId);

        // Create new user document with custom ID
        const newUserData: User = {
          ...data,
          id: customId,
          firebaseUid: firebaseUid,
        };
        await setDoc(doc(db, 'users', customId), newUserData);

        // Track migration
        result.mappings.push({
          oldId: firebaseUid,
          newId: customId,
          role: data.role,
        });

        result.migratedCount++;
      } catch (error) {
        const errorMsg = `Failed to migrate user ${user.data.name}: ${error}`;
        console.error(errorMsg);
        result.errors.push(errorMsg);
        result.success = false;
      }
    }

    // Step 3: Update all related documents
    console.log('Updating related documents...');
    await updateRelatedDocuments(result.mappings);

    // Step 4: Delete old user documents (optional - comment out if you want to keep them)
    console.log('Cleaning up old user documents...');
    const batch = writeBatch(db);
    for (const mapping of result.mappings) {
      batch.delete(doc(db, 'users', mapping.oldId));
    }
    await batch.commit();

    console.log(`Migration complete! Migrated ${result.migratedCount} users`);
    return result;
  } catch (error) {
    console.error('Migration failed:', error);
    result.success = false;
    result.errors.push(`Migration failed: ${error}`);
    return result;
  }
};

/**
 * Update all related documents with new custom IDs
 */
async function updateRelatedDocuments(mappings: { oldId: string; newId: string; role: string }[]) {
  const idMap = new Map(mappings.map(m => [m.oldId, m.newId]));

  // Update orders
  const ordersSnapshot = await getDocs(collection(db, 'orders'));
  const orderBatch = writeBatch(db);
  let orderUpdateCount = 0;

  ordersSnapshot.forEach((orderDoc) => {
    const order = orderDoc.data();
    let updated = false;
    const updates: any = {};

    if (order.customerId && idMap.has(order.customerId)) {
      updates.customerId = idMap.get(order.customerId);
      updated = true;
    }

    if (order.laundererId && idMap.has(order.laundererId)) {
      updates.laundererId = idMap.get(order.laundererId);
      updated = true;
    }

    if (updated) {
      orderBatch.update(doc(db, 'orders', orderDoc.id), updates);
      orderUpdateCount++;
    }
  });

  if (orderUpdateCount > 0) {
    await orderBatch.commit();
    console.log(`Updated ${orderUpdateCount} orders`);
  }

  // Update disputes
  const disputesSnapshot = await getDocs(collection(db, 'disputes'));
  const disputeBatch = writeBatch(db);
  let disputeUpdateCount = 0;

  disputesSnapshot.forEach((disputeDoc) => {
    const dispute = disputeDoc.data();
    let updated = false;
    const updates: any = {};

    if (dispute.customerId && idMap.has(dispute.customerId)) {
      updates.customerId = idMap.get(dispute.customerId);
      updated = true;
    }

    if (dispute.laundererId && idMap.has(dispute.laundererId)) {
      updates.laundererId = idMap.get(dispute.laundererId);
      updated = true;
    }

    if (updated) {
      disputeBatch.update(doc(db, 'disputes', disputeDoc.id), updates);
      disputeUpdateCount++;
    }
  });

  if (disputeUpdateCount > 0) {
    await disputeBatch.commit();
    console.log(`Updated ${disputeUpdateCount} disputes`);
  }

  // Update messages
  const messagesSnapshot = await getDocs(collection(db, 'messages'));
  const messageBatch = writeBatch(db);
  let messageUpdateCount = 0;

  messagesSnapshot.forEach((messageDoc) => {
    const message = messageDoc.data();
    let updated = false;
    const updates: any = {};

    if (message.senderId && idMap.has(message.senderId)) {
      updates.senderId = idMap.get(message.senderId);
      updated = true;
    }

    if (message.receiverId && idMap.has(message.receiverId)) {
      updates.receiverId = idMap.get(message.receiverId);
      updated = true;
    }

    if (updated) {
      messageBatch.update(doc(db, 'messages', messageDoc.id), updates);
      messageUpdateCount++;
    }
  });

  if (messageUpdateCount > 0) {
    await messageBatch.commit();
    console.log(`Updated ${messageUpdateCount} messages`);
  }

  // Update addresses subcollections
  for (const mapping of mappings) {
    try {
      const addressesSnapshot = await getDocs(
        collection(db, 'users', mapping.oldId, 'addresses')
      );

      if (!addressesSnapshot.empty) {
        const addressBatch = writeBatch(db);
        addressesSnapshot.forEach((addressDoc) => {
          // Copy address to new user's subcollection
          addressBatch.set(
            doc(db, 'users', mapping.newId, 'addresses', addressDoc.id),
            addressDoc.data()
          );
          // Delete old address
          addressBatch.delete(doc(db, 'users', mapping.oldId, 'addresses', addressDoc.id));
        });
        await addressBatch.commit();
        console.log(`Migrated ${addressesSnapshot.size} addresses for ${mapping.newId}`);
      }
    } catch (error) {
      console.error(`Error migrating addresses for ${mapping.oldId}:`, error);
    }
  }

  console.log('Related documents updated successfully');
}

/**
 * Get migration status - check if migration is needed
 */
export const checkMigrationStatus = async (): Promise<{
  needsMigration: boolean;
  oldFormatUsers: number;
  newFormatUsers: number;
}> => {
  const usersSnapshot = await getDocs(collection(db, 'users'));
  let oldFormat = 0;
  let newFormat = 0;

  usersSnapshot.forEach((doc) => {
    const userData = doc.data();
    if (userData.firebaseUid || doc.id.length <= 10) {
      // New format (has firebaseUid or short custom ID)
      newFormat++;
    } else {
      // Old format (Firebase UID as document ID)
      oldFormat++;
    }
  });

  return {
    needsMigration: oldFormat > 0,
    oldFormatUsers: oldFormat,
    newFormatUsers: newFormat,
  };
};
