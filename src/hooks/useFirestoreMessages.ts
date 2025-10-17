import { useEffect, useState } from 'react';
import { firestoreService } from '@/lib/firebase';
import type { Message } from '@/store/useStore';

export function useFirestoreMessages(userId?: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const unsubscribe = firestoreService.onMessagesChange(userId, (updatedMessages) => {
      setMessages(updatedMessages);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  return { messages, loading, error };
}
