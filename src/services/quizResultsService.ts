import { collection, addDoc, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';

export interface QuizResultRecord {
    dayNumber: number;
    score: number;
    totalQuestions: number;
    percentage: number;
    userEmail: string;
    dateAttempted: string; // ISO string
    whatsappGroup: string;
}

/**
 * Save a quiz result to Firestore under the 'quizResults' collection.
 * Document structure: { dayNumber, score, totalQuestions, percentage, userEmail, dateAttempted }
 */
export const saveQuizResult = async (result: QuizResultRecord): Promise<void> => {
    try {
        await addDoc(collection(db, 'quizResults'), result);
        console.log(`✅ Quiz result saved: Day-${result.dayNumber}, Score: ${result.score}/${result.totalQuestions}`);
    } catch (error) {
        console.error('❌ Error saving quiz result:', error);
        throw error;
    }
};

/**
 * Fetch all quiz results for a specific user (by email).
 */
export const getQuizResultsByUser = async (userEmail: string): Promise<QuizResultRecord[]> => {
    try {
        const q = query(
            collection(db, 'quizResults'),
            where('userEmail', '==', userEmail),
            orderBy('dateAttempted', 'desc')
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => doc.data() as QuizResultRecord);
    } catch (error) {
        console.error('Error fetching quiz results:', error);
        return [];
    }
};

/**
 * Check if a user has already attempted a specific day's quiz.
 * Returns the existing result if found, or null if not attempted yet.
 */
export const getUserQuizAttempt = async (
    userEmail: string,
    dayNumber: number
): Promise<QuizResultRecord | null> => {
    try {
        const q = query(
            collection(db, 'quizResults'),
            where('userEmail', '==', userEmail),
            where('dayNumber', '==', dayNumber)
        );
        const snapshot = await getDocs(q);
        if (snapshot.empty) return null;
        return snapshot.docs[0].data() as QuizResultRecord;
    } catch (error) {
        console.error('Error checking quiz attempt:', error);
        return null;
    }
};

export interface LeaderboardEntry {
    userEmail: string;
    displayName: string;
    totalScore: number;
    totalQuestions: number;
    quizzesTaken: number;
    averagePercentage: number;
}

/**
 * Fetch leaderboard: aggregate all quiz results per user, return top N users.
 * Filters by whatsappGroup and excludes the admin.
 */
export const getLeaderboard = async (topN: number = 3, groupName?: string): Promise<LeaderboardEntry[]> => {
    try {
        const adminEmail = 'kwaheedsays@gmail.com';
        let q = query(collection(db, 'quizResults'));

        if (groupName) {
            q = query(collection(db, 'quizResults'), where('whatsappGroup', '==', groupName));
        }

        const snapshot = await getDocs(q);
        const userMap: Record<string, { totalScore: number; totalQuestions: number; quizzesTaken: number }> = {};

        snapshot.docs.forEach(doc => {
            const data = doc.data() as QuizResultRecord;
            // Exclude admin
            if (data.userEmail === adminEmail) return;

            if (!userMap[data.userEmail]) {
                userMap[data.userEmail] = { totalScore: 0, totalQuestions: 0, quizzesTaken: 0 };
            }
            userMap[data.userEmail].totalScore += data.score;
            userMap[data.userEmail].totalQuestions += data.totalQuestions;
            userMap[data.userEmail].quizzesTaken += 1;
        });

        // Fetch user profiles to get real full names
        const usersSnapshot = await getDocs(collection(db, 'quizUsers'));
        const profileMap: Record<string, string> = {};
        usersSnapshot.docs.forEach(doc => {
            const data = doc.data();
            profileMap[data.email] = data.fullName || data.displayName || data.email.split('@')[0];
        });

        const entries: LeaderboardEntry[] = Object.entries(userMap).map(([email, stats]) => ({
            userEmail: email,
            displayName: profileMap[email] || email.split('@')[0],
            totalScore: stats.totalScore,
            totalQuestions: stats.totalQuestions,
            quizzesTaken: stats.quizzesTaken,
            averagePercentage: stats.totalQuestions > 0
                ? Math.round((stats.totalScore / stats.totalQuestions) * 100)
                : 0,
        }));

        // Sort by average percentage descending, then by quizzes taken descending
        entries.sort((a, b) => {
            if (b.averagePercentage !== a.averagePercentage) return b.averagePercentage - a.averagePercentage;
            return b.quizzesTaken - a.quizzesTaken;
        });

        return entries.slice(0, topN);
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        return [];
    }
};

/**
 * Fetch all quiz results for admin view.
 */
export const getAllQuizResultsForAdmin = async (groupName?: string): Promise<QuizResultRecord[]> => {
    try {
        let q = query(collection(db, 'quizResults'), orderBy('dateAttempted', 'desc'));
        if (groupName) {
            // Re-creating the query with where clause. Firestore needs a composite index if combining where we orderBy.
            // For now, let's keep it simple or filter in-memory if needed.
            q = query(
                collection(db, 'quizResults'),
                where('whatsappGroup', '==', groupName),
                orderBy('dateAttempted', 'desc')
            );
        }
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => doc.data() as QuizResultRecord);
    } catch (error) {
        console.error('Error fetching all quiz results for admin:', error);
        return [];
    }
};

