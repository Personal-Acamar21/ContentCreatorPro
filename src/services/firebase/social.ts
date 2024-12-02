import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import type { SocialPost } from '../../types/social';

const COLLECTION_NAME = 'social_posts';

export async function createSocialPost(post: Omit<SocialPost, 'id' | 'createdAt' | 'updatedAt'>) {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...post,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating social post:', error);
    throw error;
  }
}

export async function getSocialPost(id: string) {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as SocialPost;
    }
    return null;
  } catch (error) {
    console.error('Error getting social post:', error);
    throw error;
  }
}

export async function getAllSocialPosts() {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      orderBy('scheduledDate', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as SocialPost[];
  } catch (error) {
    console.error('Error getting social posts:', error);
    throw error;
  }
}

export async function updateSocialPost(id: string, post: Partial<SocialPost>) {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...post,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating social post:', error);
    throw error;
  }
}

export async function deleteSocialPost(id: string) {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting social post:', error);
    throw error;
  }
}

export async function getScheduledSocialPosts() {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('status', '==', 'scheduled'),
      orderBy('scheduledDate', 'asc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as SocialPost[];
  } catch (error) {
    console.error('Error getting scheduled social posts:', error);
    throw error;
  }
}