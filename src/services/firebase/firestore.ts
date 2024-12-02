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
  serverTimestamp,
  DocumentData
} from 'firebase/firestore';
import { db } from '../../lib/firebase';

// Generic CRUD operations
export async function createDocument(collectionName: string, data: DocumentData) {
  try {
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating document:', error);
    throw error;
  }
}

export async function getDocument(collectionName: string, id: string) {
  try {
    const docRef = doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  } catch (error) {
    console.error('Error getting document:', error);
    throw error;
  }
}

export async function updateDocument(collectionName: string, id: string, data: Partial<DocumentData>) {
  try {
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating document:', error);
    throw error;
  }
}

export async function deleteDocument(collectionName: string, id: string) {
  try {
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting document:', error);
    throw error;
  }
}

export async function queryDocuments(
  collectionName: string,
  conditions: { field: string; operator: string; value: any }[],
  orderByField?: string,
  orderDirection: 'asc' | 'desc' = 'desc'
) {
  try {
    let q = collection(db, collectionName);

    // Apply conditions
    conditions.forEach(({ field, operator, value }) => {
      q = query(q, where(field, operator as any, value));
    });

    // Apply ordering if specified
    if (orderByField) {
      q = query(q, orderBy(orderByField, orderDirection));
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error querying documents:', error);
    throw error;
  }
}