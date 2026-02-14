import { Question } from '../types/quiz';
import { getMockQuizForDay0 } from './Quiz/Quiz-0';
import { getMockQuizForDay1 } from './Quiz/Quiz-1';
import { getMockQuizForDay2 } from './Quiz/Quiz-2';
import { getMockQuizForDay3 } from './Quiz/Quiz-3';
import { getMockQuizForDay4 } from './Quiz/Quiz-4';
import { getMockQuizForDay5 } from './Quiz/Quiz-5';
import { getMockQuizForDay6 } from './Quiz/Quiz-6';
import { getMockQuizForDay7 } from './Quiz/Quiz-7';
import { getMockQuizForDay8 } from './Quiz/Quiz-8';
import { getMockQuizForDay9 } from './Quiz/Quiz-9';
import { getMockQuizForDay10 } from './Quiz/Quiz-10';
import { getMockQuizForDay11 } from './Quiz/Quiz-11';
import { getMockQuizForDay12 } from './Quiz/Quiz-12';
import { getMockQuizForDay13 } from './Quiz/Quiz-13';
import { getMockQuizForDay14 } from './Quiz/Quiz-14';
import { getMockQuizForDay15 } from './Quiz/Quiz-15';
import { getMockQuizForDay16 } from './Quiz/Quiz-16';
import { getMockQuizForDay17 } from './Quiz/Quiz-17';
import { getMockQuizForDay18 } from './Quiz/Quiz-18';
import { getMockQuizForDay19 } from './Quiz/Quiz-19';
import { getMockQuizForDay20 } from './Quiz/Quiz-20';
import { getMockQuizForDay21 } from './Quiz/Quiz-21';
import { getMockQuizForDay22 } from './Quiz/Quiz-22';
import { getMockQuizForDay23 } from './Quiz/Quiz-23';
import { getMockQuizForDay24 } from './Quiz/Quiz-24';
import { getMockQuizForDay25 } from './Quiz/Quiz-25';
import { getMockQuizForDay26 } from './Quiz/Quiz-26';
import { getMockQuizForDay27 } from './Quiz/Quiz-27';
import { getMockQuizForDay28 } from './Quiz/Quiz-28';
import { getMockQuizForDay29 } from './Quiz/Quiz-29';
import { getMockQuizForDay30 } from './Quiz/Quiz-30';

/**
 * Explicit answer key for all 30 days (Juz 1–30).
 * Each day maps question number (1–5) to the correct option label (A/B/C/D).
 * Answers determined by careful analysis of the slide content in each Quiz file.
 */
const QUIZ_ANSWER_KEY: Record<number, Record<number, string>> = {
    // Day 0 – Pre-Ramadan Trial: Al-Fatiha & Al-Baqarah
    0: { 1: 'B', 2: 'C', 3: 'B', 4: 'B', 5: 'C' },
    // Day 1 – Juz 1: Al-Fatiha & Al-Baqarah
    1: { 1: 'B', 2: 'C', 3: 'B', 4: 'B', 5: 'B' },
    // Day 2 – Juz 2: Al-Baqarah (cont.)
    2: { 1: 'B', 2: 'C', 3: 'C', 4: 'B', 5: 'C' },
    // Day 3 – Juz 3: Al-Baqarah & Aal-Imran
    3: { 1: 'B', 2: 'D', 3: 'B', 4: 'C', 5: 'B' },
    // Day 4 – Juz 4: Aal-Imran & An-Nisa
    4: { 1: 'C', 2: 'C', 3: 'A', 4: 'B', 5: 'C' },
    // Day 5 – Juz 5: An-Nisa & Al-Ma'idah
    5: { 1: 'C', 2: 'C', 3: 'B', 4: 'C', 5: 'B' },
    // Day 6 – Juz 6: An-Nisa & Al-Ma'idah (cont.)
    6: { 1: 'B', 2: 'B', 3: 'C', 4: 'B', 5: 'B' },
    // Day 7 – Juz 7: Al-Ma'idah & Al-An'am
    7: { 1: 'B', 2: 'B', 3: 'B', 4: 'C', 5: 'A' },
    // Day 8 – Juz 8: Al-An'am & Al-A'raf
    8: { 1: 'C', 2: 'B', 3: 'C', 4: 'C', 5: 'A' },
    // Day 9 – Juz 9: Al-A'raf & Al-Anfal
    9: { 1: 'C', 2: 'B', 3: 'B', 4: 'B', 5: 'C' },
    // Day 10 – Juz 10: Al-Anfal & At-Tawbah
    10: { 1: 'B', 2: 'B', 3: 'B', 4: 'B', 5: 'B' },
    // Day 11 – Juz 11: At-Tawbah & Hud
    11: { 1: 'B', 2: 'B', 3: 'B', 4: 'B', 5: 'B' },
    // Day 12 – Juz 12: Hud & Yusuf
    12: { 1: 'C', 2: 'B', 3: 'B', 4: 'D', 5: 'C' },
    // Day 13 – Juz 13: Yusuf, Ar-Ra'd & Ibrahim
    13: { 1: 'C', 2: 'B', 3: 'C', 4: 'C', 5: 'B' },
    // Day 14 – Juz 14: Al-Hijr & An-Nahl
    14: { 1: 'C', 2: 'B', 3: 'B', 4: 'B', 5: 'B' },
    // Day 15 – Juz 15: Al-Isra & Al-Kahf
    15: { 1: 'B', 2: 'B', 3: 'C', 4: 'B', 5: 'B' },
    // Day 16 – Juz 16: Al-Kahf, Maryam & Taha
    16: { 1: 'B', 2: 'C', 3: 'B', 4: 'B', 5: 'C' },
    // Day 17 – Juz 17: Al-Anbiya & Al-Hajj
    17: { 1: 'C', 2: 'B', 3: 'A', 4: 'C', 5: 'C' },
    // Day 18 – Juz 18: Al-Mu'minun, An-Nur & Al-Furqan
    18: { 1: 'B', 2: 'B', 3: 'B', 4: 'D', 5: 'B' },
    // Day 19 – Juz 19: Al-Furqan, Ash-Shu'ara & An-Naml
    19: { 1: 'B', 2: 'B', 3: 'C', 4: 'B', 5: 'C' },
    // Day 20 – Juz 20: An-Naml, Al-Qasas & Al-Ankabut
    20: { 1: 'C', 2: 'C', 3: 'B', 4: 'B', 5: 'C' },
    // Day 21 – Juz 21: Al-Ankabut, Ar-Rum, Luqman, As-Sajdah & Al-Ahzab
    21: { 1: 'B', 2: 'C', 3: 'D', 4: 'B', 5: 'C' },
    // Day 22 – Juz 22: Al-Ahzab, Saba, Fatir & Ya-Sin
    22: { 1: 'C', 2: 'C', 3: 'B', 4: 'B', 5: 'C' },
    // Day 23 – Juz 23: Ya-Sin, As-Saffat, Sad & Az-Zumar
    23: { 1: 'B', 2: 'C', 3: 'C', 4: 'B', 5: 'B' },
    // Day 24 – Juz 24: Az-Zumar, Ghafir & Fussilat
    24: { 1: 'B', 2: 'B', 3: 'B', 4: 'A', 5: 'C' },
    // Day 25 – Juz 25: Fussilat, Ash-Shura, Az-Zukhruf, Ad-Dukhan & Al-Jathiyah
    25: { 1: 'C', 2: 'B', 3: 'B', 4: 'C', 5: 'B' },
    // Day 26 – Juz 26: Al-Ahqaf, Muhammad, Al-Fath, Al-Hujurat & Qaf
    26: { 1: 'C', 2: 'B', 3: 'C', 4: 'C', 5: 'B' },
    // Day 27 – Juz 27: Adh-Dhariyat, At-Tur, An-Najm, Al-Qamar, Ar-Rahman, Al-Waqi'ah & Al-Hadid
    27: { 1: 'C', 2: 'B', 3: 'B', 4: 'C', 5: 'C' },
    // Day 28 – Juz 28: Al-Mujadila to At-Tahrim
    28: { 1: 'C', 2: 'B', 3: 'C', 4: 'C', 5: 'B' },
    // Day 29 – Juz 29: Al-Mulk to Al-Mursalat
    29: { 1: 'B', 2: 'C', 3: 'C', 4: 'B', 5: 'B' },
    // Day 30 – Juz 30 (Juz Amma): An-Naba to An-Nas
    30: { 1: 'B', 2: 'B', 3: 'C', 4: 'B', 5: 'B' },
};

/**
 * Fetch raw quiz content for a specific day
 */
const fetchRawQuizContent = (dayNumber: number): string => {
    const quizMap: Record<number, () => { content: string }[]> = {
        0: getMockQuizForDay0,
        1: getMockQuizForDay1,
        2: getMockQuizForDay2,
        3: getMockQuizForDay3,
        4: getMockQuizForDay4,
        5: getMockQuizForDay5,
        6: getMockQuizForDay6,
        7: getMockQuizForDay7,
        8: getMockQuizForDay8,
        9: getMockQuizForDay9,
        10: getMockQuizForDay10,
        11: getMockQuizForDay11,
        12: getMockQuizForDay12,
        13: getMockQuizForDay13,
        14: getMockQuizForDay14,
        15: getMockQuizForDay15,
        16: getMockQuizForDay16,
        17: getMockQuizForDay17,
        18: getMockQuizForDay18,
        19: getMockQuizForDay19,
        20: getMockQuizForDay20,
        21: getMockQuizForDay21,
        22: getMockQuizForDay22,
        23: getMockQuizForDay23,
        24: getMockQuizForDay24,
        25: getMockQuizForDay25,
        26: getMockQuizForDay26,
        27: getMockQuizForDay27,
        28: getMockQuizForDay28,
        29: getMockQuizForDay29,
        30: getMockQuizForDay30,
    };

    const quizFn = quizMap[dayNumber];
    if (!quizFn) return '';

    const slides = quizFn();
    return slides.length > 0 ? slides[0].content : '';
};

/**
 * Parse raw quiz content string into structured Question objects.
 * Supports TWO formats:
 *   1) Single-line: "1. Question? A) opt1 B) opt2  C) opt3 D) opt4"
 *   2) Multi-line:  "1. Question?\nA) opt1\nB) opt2\nC) opt3\nD) opt4"
 * Correct answer is detected via trailing double-space or  marker.
 */
export const parseQuizContent = (rawContent: string): Question[] => {
    const questions: Question[] = [];

    // Unescape backslashes from template literals: \( -> ( and \) -> )
    const content = rawContent.replace(/\\\(/g, '(').replace(/\\\)/g, ')');

    // Split content into individual lines using real newlines
    const lines = content.split('\n');

    let i = 0;
    while (i < lines.length) {
        const trimmed = lines[i].trim();
        if (!trimmed) { i++; continue; }

        // Match question pattern: starts with "N. " where N is a number
        const questionMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
        if (!questionMatch) { i++; continue; }

        const questionNum = parseInt(questionMatch[1]);
        const restOfLine = questionMatch[2];

        // Check if options are on the SAME line
        const firstOptionIdx = restOfLine.search(/\b[A-D]\)/);
        if (firstOptionIdx >= 0) {
            // SAME-LINE FORMAT: "1. Question? A) opt1 B) opt2 C) opt3 D) opt4"
            const questionText = restOfLine.substring(0, firstOptionIdx).trim();
            const optionsPart = restOfLine.substring(firstOptionIdx);

            const optionEntries: { label: string; text: string }[] = [];
            const optionRegex = /([A-D])\)\s*(.*?)(?=\s+[A-D]\)|$)/g;
            let match;
            while ((match = optionRegex.exec(optionsPart)) !== null) {
                optionEntries.push({ label: match[1], text: match[2].trim() });
            }

            if (optionEntries.length >= 2) {
                // Detect correct answer: option followed by double-space
                let correctLabel = '';
                const correctRegex = /([A-D])\)\s*(.*?)\s{2,}(?=[A-D]\)|$)/g;
                let correctMatch;
                while ((correctMatch = correctRegex.exec(optionsPart)) !== null) {
                    correctLabel = correctMatch[1];
                }
                if (!correctLabel) correctLabel = optionEntries[0].label;

                questions.push({
                    id: questionNum,
                    questionText,
                    options: optionEntries.map(o => ({ label: o.label, text: o.text })),
                    correctAnswer: correctLabel,
                });
            }
            i++;
        } else {
            // MULTI-LINE FORMAT: question on one line, options on following lines
            const questionText = restOfLine.trim();
            const optionEntries: { label: string; text: string }[] = [];
            let correctLabel = '';
            i++;

            // Collect option lines (A), B), C), D))
            while (i < lines.length) {
                const optLine = lines[i].trim();
                const optMatch = optLine.match(/^([A-D])\)\s*(.*)/);
                if (optMatch) {
                    const label = optMatch[1];
                    const text = optMatch[2].trim();
                    // Check for trailing double-space (correct answer marker)
                    if (optMatch[2].match(/\s{2,}$/)) {
                        correctLabel = label;
                    }
                    optionEntries.push({ label, text });
                    i++;
                } else if (optLine.startsWith('+') || optLine === '') {
                    // Skip  markers and empty lines between options
                    i++;
                } else {
                    break; // Not an option line, stop collecting
                }
            }

            if (optionEntries.length >= 2) {
                if (!correctLabel) correctLabel = optionEntries[0].label;
                questions.push({
                    id: questionNum,
                    questionText,
                    options: optionEntries.map(o => ({ label: o.label, text: o.text })),
                    correctAnswer: correctLabel,
                });
            }
        }
    }

    return questions;
};

/**
 * Fisher-Yates shuffle for arrays (in-place, returns same array)
 */
const shuffleArray = <T>(array: T[]): T[] => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

/**
 * Shuffle the options for each question so the correct answer
 * isn't always in the same position. Updates labels (A, B, C, D)
 * and correctAnswer to match the new order.
 */
const shuffleQuestionOptions = (questions: Question[]): Question[] => {
    const labels = ['A', 'B', 'C', 'D'];

    return questions.map(q => {
        // Find the correct option's text before shuffling
        const correctOption = q.options.find(o => o.label === q.correctAnswer);
        if (!correctOption) return q;
        const correctText = correctOption.text;

        // Shuffle the options
        const shuffled = shuffleArray([...q.options]);

        // Re-assign labels and find new correct answer label
        let newCorrectLabel = 'A';
        const newOptions = shuffled.map((opt, idx) => {
            const newLabel = labels[idx];
            if (opt.text === correctText) {
                newCorrectLabel = newLabel;
            }
            return { label: newLabel, text: opt.text };
        });

        return {
            ...q,
            options: newOptions,
            correctAnswer: newCorrectLabel,
        };
    });
};

/**
 * Fetch and parse quiz for a specific day.
 * Applies the explicit QUIZ_ANSWER_KEY to set correct answers reliably,
 * then shuffles options randomly so the correct answer appears in a
 * different position on every attempt.
 */
export const fetchQuizByDay = (dayNumber: number): Question[] => {
    const rawContent = fetchRawQuizContent(dayNumber);
    if (!rawContent) return [];
    const questions = parseQuizContent(rawContent);

    // Apply explicit answer key (overrides unreliable double-space detection)
    const answerKey = QUIZ_ANSWER_KEY[dayNumber];
    if (answerKey) {
        questions.forEach(q => {
            if (answerKey[q.id]) {
                q.correctAnswer = answerKey[q.id];
            }
        });
    }

    return shuffleQuestionOptions(questions);
};
