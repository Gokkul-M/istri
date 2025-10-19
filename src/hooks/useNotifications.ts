import { useState, useEffect } from 'react';
import { firestoreService } from '@/lib/firebase/firestore';
import type { Notification } from '@/store/useStore';

export const useNotifications = (userId: string | null) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      setNotifications([]);
      return;
    }

    const unsubscribe = firestoreService.onNotificationsChange(userId, (updatedNotifications) => {
      setNotifications(updatedNotifications);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  const markAsRead = async (notificationId: string) => {
    try {
      await firestoreService.markNotificationAsRead(notificationId);
    } catch (err) {
      setError(err as Error);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      await firestoreService.deleteNotification(notificationId);
    } catch (err) {
      setError(err as Error);
    }
  };

  return { notifications, loading, error, markAsRead, deleteNotification };
};
