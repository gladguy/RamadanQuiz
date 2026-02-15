import { doc, updateDoc, increment, setDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export interface VerseStats {
    playCount: number;
    likeCount: number;
    memorizedCount: number;
    userLiked: boolean;
    userMemorized: boolean;
}

/**
 * Fetches stats for a specific verse and checks if the current user liked/memorized it.
 */
export const getVerseStats = async (surahNumber: number, ayahNumber: number, userId?: string): Promise<VerseStats> => {
    try {
        const verseId = `${surahNumber}_${ayahNumber}`;
        const verseRef = doc(db, 'verseStats', verseId);
        const docSnap = await getDoc(verseRef);

        let userLiked = false;
        let userMemorized = false;

        if (userId) {
            const likeRef = doc(db, 'verseStats', verseId, 'userLikes', userId);
            const memRef = doc(db, 'verseStats', verseId, 'userMemorized', userId);

            const [likeSnap, memSnap] = await Promise.all([
                getDoc(likeRef),
                getDoc(memRef)
            ]);

            userLiked = likeSnap.exists();
            userMemorized = memSnap.exists();
        }

        if (docSnap.exists()) {
            const data = docSnap.data();
            return {
                playCount: data.playCount || 0,
                likeCount: data.likeCount || 0,
                memorizedCount: data.memorizedCount || 0,
                userLiked,
                userMemorized
            };
        }

        return { playCount: 0, likeCount: 0, memorizedCount: 0, userLiked: false, userMemorized: false };
    } catch (error) {
        console.error('Error fetching verse stats:', error);
        return { playCount: 0, likeCount: 0, memorizedCount: 0, userLiked: false, userMemorized: false };
    }
};

/**
 * Atomically increments the play count for a specific verse.
 */
export const incrementVersePlayCount = async (surahNumber: number, ayahNumber: number): Promise<void> => {
    try {
        const verseId = `${surahNumber}_${ayahNumber}`;
        const verseRef = doc(db, 'verseStats', verseId);

        const docSnap = await getDoc(verseRef);

        if (!docSnap.exists()) {
            await setDoc(verseRef, {
                surahNumber,
                ayahNumber,
                playCount: 1,
                likeCount: 0,
                memorizedCount: 0,
                lastPlayed: new Date().toISOString()
            });
        } else {
            await updateDoc(verseRef, {
                playCount: increment(1),
                lastPlayed: new Date().toISOString()
            });
        }
    } catch (error) {
        console.error('Error incrementing play count:', error);
    }
};

/**
 * Toggles the like status for a verse.
 */
export const toggleVerseLike = async (surahNumber: number, ayahNumber: number, userId: string): Promise<boolean> => {
    try {
        const verseId = `${surahNumber}_${ayahNumber}`;
        const verseRef = doc(db, 'verseStats', verseId);
        const likeRef = doc(db, 'verseStats', verseId, 'userLikes', userId);

        const likeSnap = await getDoc(likeRef);
        const isLiking = !likeSnap.exists();

        const verseSnap = await getDoc(verseRef);
        if (!verseSnap.exists()) {
            await setDoc(verseRef, { surahNumber, ayahNumber, playCount: 0, likeCount: 0, memorizedCount: 0 });
        }

        if (isLiking) {
            await setDoc(likeRef, { createdAt: new Date().toISOString() });
            await updateDoc(verseRef, { likeCount: increment(1) });
        } else {
            await deleteDoc(likeRef);
            await updateDoc(verseRef, { likeCount: increment(-1) });
        }

        return isLiking;
    } catch (error) {
        console.error('Error toggling like:', error);
        throw error;
    }
};

/**
 * Toggles the memorized status for a verse.
 */
export const toggleVerseMemorized = async (surahNumber: number, ayahNumber: number, userId: string): Promise<boolean> => {
    try {
        const verseId = `${surahNumber}_${ayahNumber}`;
        const verseRef = doc(db, 'verseStats', verseId);
        const memRef = doc(db, 'verseStats', verseId, 'userMemorized', userId);

        const memSnap = await getDoc(memRef);
        const isMemorized = !memSnap.exists();

        const verseSnap = await getDoc(verseRef);
        if (!verseSnap.exists()) {
            await setDoc(verseRef, { surahNumber, ayahNumber, playCount: 0, likeCount: 0, memorizedCount: 0 });
        }

        if (isMemorized) {
            await setDoc(memRef, { createdAt: new Date().toISOString() });
            await updateDoc(verseRef, { memorizedCount: increment(1) });
        } else {
            await deleteDoc(memRef);
            await updateDoc(verseRef, { memorizedCount: increment(-1) });
        }

        return isMemorized;
    } catch (error) {
        console.error('Error toggling memorized:', error);
        throw error;
    }
};
