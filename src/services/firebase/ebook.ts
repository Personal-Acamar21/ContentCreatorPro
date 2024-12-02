import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import type { Ebook } from '../../types/ebook';

const COLLECTION_NAME = 'ebooks';

export async function createEbook(ebook: Omit<Ebook, 'id' | 'createdAt' | 'updatedAt'>) {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...ebook,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating ebook:', error);
    throw error;
  }
}

export async function getEbook(id: string) {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Ebook;
    }
    return null;
  } catch (error) {
    console.error('Error getting ebook:', error);
    throw error;
  }
}

export async function getAllEbooks() {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Ebook[];
  } catch (error) {
    console.error('Error getting ebooks:', error);
    throw error;
  }
}

export async function updateEbook(id: string, ebook: Partial<Ebook>) {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...ebook,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating ebook:', error);
    throw error;
  }
}

export async function deleteEbook(id: string) {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting ebook:', error);
    throw error;
  }
}