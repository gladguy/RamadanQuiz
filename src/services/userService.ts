import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { User } from 'firebase/auth';

export interface UserProfile {
    uid: string;
    email: string;
    displayName: string;
    fullName: string;
    lastSeen: string;
    region?: string;
    lastMulkDay?: number;
}

/**
 * Update user profile with partial data.
 */
export const updateUserProfile = async (uid: string, updates: Partial<UserProfile>): Promise<void> => {
    try {
        const userDocRef = doc(db, 'quizUsers', uid);
        await setDoc(userDocRef, updates, { merge: true });
        console.log(`✅ User profile updated for ${uid}`);
    } catch (error) {
        console.error('❌ Error updating user profile:', error);
        throw error;
    }
};

/**
 * Sync user profile to Firestore. 
 * If the user document doesn't exist, create it with the Google displayName as fullName.
 */
export const syncUserProfile = async (user: User): Promise<void> => {
    try {
        const userDocRef = doc(db, 'quizUsers', user.uid);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
            const profile: UserProfile = {
                uid: user.uid,
                email: user.email || '',
                displayName: user.displayName || '',
                fullName: user.displayName || '', // Store full name from Google initially
                lastSeen: new Date().toISOString()
            };
            await setDoc(userDocRef, profile);
            console.log('✨ New user profile created in Firestore');
        } else {
            const existingData = userDoc.data() as UserProfile;
            const updates: any = { lastSeen: new Date().toISOString() };

            // If fullName is missing but Google has it, populate it
            if (!existingData.fullName && user.displayName) {
                updates.fullName = user.displayName;
                console.log('📝 Updating missing fullName from Google profile');
            }

            await setDoc(userDocRef, updates, { merge: true });
        }
    } catch (error) {
        console.error('❌ Error syncing user profile:', error);
    }
};

/**
 * Fetch a user profile by UID or Email.
 */
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
    try {
        const userDoc = await getDoc(doc(db, 'quizUsers', uid));
        if (userDoc.exists()) {
            return userDoc.data() as UserProfile;
        }
        return null;
    } catch (error) {
        console.error('Error fetching user profile:', error);
        return null;
    }
};
