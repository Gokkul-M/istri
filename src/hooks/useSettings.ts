import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { useToast } from '@/hooks/use-toast';

export interface UserSettings {
  userId: string;
  darkMode: boolean;
  language: string;
  notifications: {
    push: boolean;
    email: boolean;
    sms: boolean;
    whatsapp: boolean;
  };
  permissions: {
    location: boolean;
    camera: boolean;
    gallery: boolean;
  };
}

const defaultSettings: Omit<UserSettings, 'userId'> = {
  darkMode: false,
  language: 'en',
  notifications: {
    push: true,
    email: true,
    sms: false,
    whatsapp: true,
  },
  permissions: {
    location: true,
    camera: true,
    gallery: true,
  },
};

export const useSettings = (userId: string | null) => {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const loadSettings = async () => {
      try {
        const settingsRef = doc(db, 'userSettings', userId);
        const settingsSnap = await getDoc(settingsRef);

        if (settingsSnap.exists()) {
          setSettings(settingsSnap.data() as UserSettings);
        } else {
          // Create default settings
          const newSettings = { ...defaultSettings, userId };
          await setDoc(settingsRef, newSettings);
          setSettings(newSettings);
        }
      } catch (error) {
        console.error('Error loading settings:', error);
        toast({
          title: 'Error',
          description: 'Failed to load settings',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [userId, toast]);

  const updateSettings = async (updates: Partial<Omit<UserSettings, 'userId'>>) => {
    if (!userId || !settings) return false;

    try {
      const settingsRef = doc(db, 'userSettings', userId);
      await updateDoc(settingsRef, updates);

      setSettings({ ...settings, ...updates });

      toast({
        title: 'Settings Updated',
        description: 'Your settings have been saved successfully.',
      });

      return true;
    } catch (error) {
      console.error('Error updating settings:', error);
      toast({
        title: 'Update Failed',
        description: 'Failed to save settings. Please try again.',
        variant: 'destructive',
      });
      return false;
    }
  };

  const toggleDarkMode = async () => {
    if (!settings) return;
    await updateSettings({ darkMode: !settings.darkMode });
  };

  const updateNotificationPreference = async (type: keyof UserSettings['notifications'], value: boolean) => {
    if (!settings) return;
    await updateSettings({
      notifications: {
        ...settings.notifications,
        [type]: value,
      },
    });
  };

  const updatePermission = async (type: keyof UserSettings['permissions'], value: boolean) => {
    if (!settings) return;
    await updateSettings({
      permissions: {
        ...settings.permissions,
        [type]: value,
      },
    });
  };

  const changeLanguage = async (language: string) => {
    if (!settings) return;
    await updateSettings({ language });
  };

  return {
    settings,
    loading,
    updateSettings,
    toggleDarkMode,
    updateNotificationPreference,
    updatePermission,
    changeLanguage,
  };
};
