import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export interface AppConfig {
    gulfStartDate: string; // YYYY-MM-DD
}

const CONFIG_DOC_PATH = 'appConfig/ramadan';

/**
 * Fetch the global Ramadan start date for Gulf countries.
 * Defaults to 2026-02-18 if not set.
 */
export const getGulfStartDate = async (): Promise<string> => {
    try {
        const docRef = doc(db, CONFIG_DOC_PATH);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return (docSnap.data() as AppConfig).gulfStartDate;
        }
        return '2026-02-18'; // Fallback
    } catch (error) {
        console.error('Error fetching gulf start date:', error);
        return '2026-02-18';
    }
};

/**
 * Update the global Ramadan start date for Gulf countries.
 */
export const updateGulfStartDate = async (startDate: string): Promise<void> => {
    try {
        const docRef = doc(db, CONFIG_DOC_PATH);
        await setDoc(docRef, { gulfStartDate: startDate }, { merge: true });
        console.log('✅ Gulf start date updated:', startDate);
    } catch (error) {
        console.error('❌ Error updating gulf start date:', error);
        throw error;
    }
};
