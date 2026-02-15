import { Slide } from '../types/slide';

/**
 * Strip quiz/MCQ content from slide text.
 */
const stripQuizContent = (slides: Slide[]): Slide[] => {
    return slides.map((slide, index) => {
        if (index !== slides.length - 1) return slide;

        const content = slide.content;
        const quizMarkers = [
            'Quiz \\(MCQ\\)',
            'Quiz (MCQ)',
            'பயிற்சி வினாக்கள் \\(MCQ\\)',
            'பயிற்சி வினாக்கள் (MCQ)',
        ];

        let trimIndex = -1;
        for (const marker of quizMarkers) {
            const idx = content.indexOf(marker);
            if (idx !== -1 && (trimIndex === -1 || idx < trimIndex)) {
                trimIndex = idx;
            }
        }

        if (trimIndex === -1) return slide;
        return {
            ...slide,
            content: content.substring(0, trimIndex).trim(),
        };
    });
};

// Eagerly load all slide files from the content directory
const slideFiles = import.meta.glob('../content/*/slides/Day*.ts', { eager: true });

/**
 * Service to fetch slides for a specific day and language.
 */
export const fetchSlidesByDay = (dayNumber: number, language: string = 'ta'): Slide[] => {
    try {
        // Construct the expected path inside the glob map
        // Note: The path must match a key in the slideFiles object
        const path = `../content/${language}/slides/Day${dayNumber}.ts`;
        const module = slideFiles[path] as any;

        if (!module) {
            console.warn(`Slide content not found for Day ${dayNumber} (${language}) at ${path}`);
            return [];
        }

        // Handle different export names if necessary
        const slides = module[`getMockSlidesForDay${dayNumber}`] ||
            module[`getQuestionsForDay${dayNumber}`] ||
            module.default || [];

        return stripQuizContent(typeof slides === 'function' ? slides() : slides);
    } catch (error) {
        console.error(`Error loading slides for Day ${dayNumber} (${language}):`, error);
        return [];
    }
};

