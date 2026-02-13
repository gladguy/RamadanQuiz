import { Question } from '../types/quiz';
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
 * Fetch raw quiz content for a specific day
 */
const fetchRawQuizContent = (dayNumber: number): string => {
    const quizMap: Record<number, () => { content: string }[]> = {
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
 * The content contains questions like:
 *   "1. Question text? A) opt1 B) opt2  C) opt3 D) opt4"
 * Questions are separated by newlines. Correct answer has trailing double-space.
 */
export const parseQuizContent = (rawContent: string): Question[] => {
    const questions: Question[] = [];

    // Unescape backslashes from template literals: \( -> ( and \) -> )
    const content = rawContent.replace(/\\\(/g, '(').replace(/\\\)/g, ')');

    // Split content into individual lines using real newlines
    const lines = content.split('\n');

    for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;

        // Match question pattern: starts with "N. " where N is a number
        const questionMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
        if (!questionMatch) continue;

        const questionNum = parseInt(questionMatch[1]);
        const restOfLine = questionMatch[2];

        // Find where the first option starts (A) B) C) or D))
        const firstOptionIdx = restOfLine.search(/\b[A-D]\)/);
        if (firstOptionIdx < 0) continue; // No options found, skip this line

        const questionText = restOfLine.substring(0, firstOptionIdx).trim();
        const optionsPart = restOfLine.substring(firstOptionIdx);

        // Extract each option: A) text B) text C) text D) text
        // Use a pattern that captures the label and text up to the next option or end
        const optionEntries: { label: string; text: string; raw: string }[] = [];
        const optionRegex = /([A-D])\)\s*(.*?)(?=\s+[A-D]\)|$)/g;
        let match;

        while ((match = optionRegex.exec(optionsPart)) !== null) {
            optionEntries.push({
                label: match[1],
                text: match[2].trim(),
                raw: match[2], // Keep raw for correct-answer detection
            });
        }

        if (optionEntries.length < 2) continue; // Need at least 2 options

        // Detect correct answer: the option followed by double-space in raw content
        // Pattern: "correct answer text  " (trailing 2+ spaces before next option)
        let correctLabel = '';
        const correctRegex = /([A-D])\)\s*(.*?)\s{2,}(?=[A-D]\)|$)/g;
        let correctMatch;
        while ((correctMatch = correctRegex.exec(optionsPart)) !== null) {
            correctLabel = correctMatch[1];
        }

        // Fallback: if no correct answer detected, default to B (common in the data)
        if (!correctLabel) {
            correctLabel = optionEntries[0].label;
        }

        questions.push({
            id: questionNum,
            questionText,
            options: optionEntries.map(o => ({ label: o.label, text: o.text })),
            correctAnswer: correctLabel,
        });
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
 * Options are shuffled randomly each time so the correct answer
 * appears in a different position on every attempt.
 */
export const fetchQuizByDay = (dayNumber: number): Question[] => {
    const rawContent = fetchRawQuizContent(dayNumber);
    if (!rawContent) return [];
    const questions = parseQuizContent(rawContent);
    return shuffleQuestionOptions(questions);
};

