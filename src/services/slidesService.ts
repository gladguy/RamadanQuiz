import { Slide } from '../types/slide';
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
 * Service to fetch slides for a specific day.
 * This can be updated to use dynamic imports or a remote API in the future.
 */
export const fetchSlidesByDay = (dayNumber: number): Slide[] => {
    switch (dayNumber) {
        case 1: return getMockSlidesForDay1();
        case 2: return getMockSlidesForDay2();
        case 3: return getMockSlidesForDay3();
        case 4: return getMockSlidesForDay4();
        case 5: return getMockSlidesForDay5();
        case 6: return getMockSlidesForDay6();
        case 7: return getMockSlidesForDay7();
        case 8: return getMockSlidesForDay8();
        case 9: return getMockSlidesForDay9();
        case 10: return getMockSlidesForDay10();
        case 11: return getMockSlidesForDay11();
        case 12: return getMockSlidesForDay12();
        case 13: return getMockSlidesForDay13();
        case 14: return getMockSlidesForDay14();
        case 15: return getMockSlidesForDay15();
        case 16: return getMockSlidesForDay16();
        case 17: return getMockSlidesForDay17();
        case 18: return getMockSlidesForDay18();
        case 19: return getMockSlidesForDay19();
        case 20: return getMockSlidesForDay20();
        case 21: return getMockSlidesForDay21();
        case 22: return getMockSlidesForDay22();
        case 23: return getMockSlidesForDay23();
        case 24: return getMockSlidesForDay24();
        case 25: return getMockSlidesForDay25();
        case 26: return getMockSlidesForDay26();
        case 27: return getMockSlidesForDay27();
        case 28: return getMockSlidesForDay28();
        case 29: return getMockSlidesForDay29();
        case 30: return getMockSlidesForDay30();
        default: return [];
    }
};
