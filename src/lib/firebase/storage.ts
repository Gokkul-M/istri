import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  uploadBytesResumable,
  UploadTask,
} from 'firebase/storage';
import { storage } from './config';

export class StorageService {
  async uploadFile(
    path: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<string> {
    const storageRef = ref(storage, path);
    
    if (onProgress) {
      const uploadTask = uploadBytesResumable(storageRef, file);
      
      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            onProgress(progress);
          },
          (error) => {
            reject(error);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          }
        );
      });
    } else {
      await uploadBytes(storageRef, file);
      return await getDownloadURL(storageRef);
    }
  }

  async uploadUserAvatar(userId: string, file: File): Promise<string> {
    const path = `avatars/${userId}/${Date.now()}_${file.name}`;
    return this.uploadFile(path, file);
  }

  async uploadBusinessLogo(businessId: string, file: File): Promise<string> {
    const path = `logos/${businessId}/${Date.now()}_${file.name}`;
    return this.uploadFile(path, file);
  }

  async deleteFile(url: string) {
    try {
      const fileRef = ref(storage, url);
      await deleteObject(fileRef);
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  }

  async getFileURL(path: string): Promise<string> {
    const fileRef = ref(storage, path);
    return await getDownloadURL(fileRef);
  }
}

export const storageService = new StorageService();
