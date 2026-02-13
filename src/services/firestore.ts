import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Slide } from '../types/slide';

/**
 * Fetches all slides for a specific day from Firestore
 * @param dayNumber - The day number (1-30)
 * @returns Promise with array of slides ordered by their order field
 */
export const getSlides = async (dayNumber: number): Promise<Slide[]> => {
    try {
        const slidesRef = collection(db, 'days', `day${dayNumber}`, 'slides');
        const q = query(slidesRef, orderBy('order', 'asc'));
        const querySnapshot = await getDocs(q);

        const slides: Slide[] = [];
        querySnapshot.forEach((doc) => {
            slides.push({
                id: doc.id,
                ...doc.data()
            } as Slide);
        });

        return slides;
    } catch (error) {
        console.error('Error fetching slides:', error);
        throw new Error(`Failed to fetch slides for day ${dayNumber}`);
    }
};
