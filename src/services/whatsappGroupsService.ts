import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';

export interface WhatsAppGroup {
    id: string;
    name: string;
    description?: string;
}

const COLLECTION_NAME = 'whatsappGroups';

/**
 * Fetch all available WhatsApp groups from Firestore.
 */
export const getWhatsAppGroups = async (): Promise<WhatsAppGroup[]> => {
    try {
        const snapshot = await getDocs(collection(db, COLLECTION_NAME));
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as WhatsAppGroup));
    } catch (error) {
        console.error('Error fetching WhatsApp groups:', error);
        return [];
    }
};

/**
 * Add a new WhatsApp group to Firestore.
 */
export const addWhatsAppGroup = async (name: string): Promise<string> => {
    try {
        const docRef = await addDoc(collection(db, COLLECTION_NAME), { name });
        return docRef.id;
    } catch (error) {
        console.error('Error adding WhatsApp group:', error);
        throw error;
    }
};

/**
 * Delete a WhatsApp group from Firestore.
 */
export const deleteWhatsAppGroup = async (groupId: string): Promise<void> => {
    try {
        await deleteDoc(doc(db, COLLECTION_NAME, groupId));
    } catch (error) {
        console.error('Error deleting WhatsApp group:', error);
        throw error;
    }
};
