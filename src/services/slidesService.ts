import { Slide } from '../types/slide';
import { getMockSlidesForDay100 } from './TrailSlides';
import { getMockSlidesForDay1 } from './Day1Slides';
import { getMockSlidesForDay2 } from './Day2Slides';
import { getMockSlidesForDay3 } from './Day3Slides';
import { getMockSlidesForDay4 } from './Day4Slides';
import { getMockSlidesForDay5 } from './Day5Slides';
import { getMockSlidesForDay6 } from './Day6Slides';
import { getMockSlidesForDay7 } from './Day7Slides';
import { getMockSlidesForDay8 } from './Day8Slides';
import { getMockSlidesForDay9 } from './Day9Slides';
import { getMockSlidesForDay10 } from './Day10Slides';
import { getMockSlidesForDay11 } from './Day11Slides';
import { getMockSlidesForDay12 } from './Day12Slides';
import { getMockSlidesForDay13 } from './Day13Slides';
import { getMockSlidesForDay14 } from './Day14Slides';
import { getMockSlidesForDay15 } from './Day15Slides';
import { getMockSlidesForDay16 } from './Day16Slides';
import { getMockSlidesForDay17 } from './Day17Slides';
import { getMockSlidesForDay18 } from './Day18Slides';
import { getMockSlidesForDay19 } from './Day19Slides';
import { getMockSlidesForDay20 } from './Day20Slides';
import { getMockSlidesForDay21 } from './Day21Slides';
import { getMockSlidesForDay22 } from './Day22Slides';
import { getMockSlidesForDay23 } from './Day23Slides';
import { getMockSlidesForDay24 } from './Day24Slides';
import { getMockSlidesForDay25 } from './Day25Slides';
import { getMockSlidesForDay26 } from './Day26Slides';
import { getMockSlidesForDay27 } from './Day27Slides';
import { getMockSlidesForDay28 } from './Day28Slides';
import { getMockSlidesForDay29 } from './Day29Slides';
import { getMockSlidesForDay30 } from './Day30Slides';

/**
 * Strip quiz/MCQ content from slide text.
 * The quiz data in DayXSlides is embedded at the end of the last slide's content,
 * marked by "Quiz \(MCQ\)" or "Quiz \(MCQ\)".
 * Since quizzes are now served separately via Quiz-X.ts files, we remove
 * everything from the quiz marker onwards.
 */
const stripQuizContent = (slides: Slide[]): Slide[] => {
    return slides.map((slide, index) => {
        // Only process the last slide (where quiz content is appended)
        if (index !== slides.length - 1) return slide;

        const content = slide.content;
        // Match both quiz marker patterns (escaped parentheses in template literals)
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

/**
 * Service to fetch slides for a specific day and language.
 * This can be updated to use dynamic imports or a remote API in the future.
 */
export const fetchSlidesByDay = (dayNumber: number, language: string = 'ta'): Slide[] => {
    let slides: Slide[];
    switch (dayNumber) {
        case 0: slides = getMockSlidesForDay100(); break;
        case 1: slides = getMockSlidesForDay1(); break;
        case 2: slides = getMockSlidesForDay2(); break;
        case 3: slides = getMockSlidesForDay3(); break;
        case 4: slides = getMockSlidesForDay4(); break;
        case 5: slides = getMockSlidesForDay5(); break;
        case 6: slides = getMockSlidesForDay6(); break;
        case 7: slides = getMockSlidesForDay7(); break;
        case 8: slides = getMockSlidesForDay8(); break;
        case 9: slides = getMockSlidesForDay9(); break;
        case 10: slides = getMockSlidesForDay10(); break;
        case 11: slides = getMockSlidesForDay11(); break;
        case 12: slides = getMockSlidesForDay12(); break;
        case 13: slides = getMockSlidesForDay13(); break;
        case 14: slides = getMockSlidesForDay14(); break;
        case 15: slides = getMockSlidesForDay15(); break;
        case 16: slides = getMockSlidesForDay16(); break;
        case 17: slides = getMockSlidesForDay17(); break;
        case 18: slides = getMockSlidesForDay18(); break;
        case 19: slides = getMockSlidesForDay19(); break;
        case 20: slides = getMockSlidesForDay20(); break;
        case 21: slides = getMockSlidesForDay21(); break;
        case 22: slides = getMockSlidesForDay22(); break;
        case 23: slides = getMockSlidesForDay23(); break;
        case 24: slides = getMockSlidesForDay24(); break;
        case 25: slides = getMockSlidesForDay25(); break;
        case 26: slides = getMockSlidesForDay26(); break;
        case 27: slides = getMockSlidesForDay27(); break;
        case 28: slides = getMockSlidesForDay28(); break;
        case 29: slides = getMockSlidesForDay29(); break;
        case 30: slides = getMockSlidesForDay30(); break;
        default: slides = [];
    }
    return stripQuizContent(slides);
};

