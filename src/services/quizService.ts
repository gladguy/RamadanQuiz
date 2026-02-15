import { Question } from '../types/quiz';

/**
 * Explicit answer key for all 30 days (Juz 1–30).
 */
const QUIZ_ANSWER_KEY: Record<number, Record<number, string>> = {
    0: { 1: 'B', 2: 'C', 3: 'B', 4: 'B', 5: 'C' },
    1: { 1: 'B', 2: 'C', 3: 'B', 4: 'B', 5: 'B' },
    2: { 1: 'B', 2: 'C', 3: 'C', 4: 'B', 5: 'C' },
    3: { 1: 'B', 2: 'D', 3: 'B', 4: 'C', 5: 'B' },
    4: { 1: 'C', 2: 'C', 3: 'A', 4: 'B', 5: 'C' },
    5: { 1: 'C', 2: 'C', 3: 'B', 4: 'C', 5: 'B' },
    6: { 1: 'B', 2: 'B', 3: 'C', 4: 'B', 5: 'B' },
    7: { 1: 'B', 2: 'B', 3: 'B', 4: 'C', 5: 'A' },
    8: { 1: 'C', 2: 'B', 3: 'C', 4: 'C', 5: 'A' },
    9: { 1: 'C', 2: 'B', 3: 'B', 4: 'B', 5: 'C' },
    10: { 1: 'B', 2: 'B', 3: 'B', 4: 'B', 5: 'B' },
    11: { 1: 'B', 2: 'B', 3: 'B', 4: 'B', 5: 'B' },
    12: { 1: 'C', 2: 'B', 3: 'B', 4: 'D', 5: 'C' },
    13: { 1: 'C', 2: 'B', 3: 'C', 4: 'C', 5: 'B' },
    14: { 1: 'C', 2: 'B', 3: 'B', 4: 'B', 5: 'B' },
    15: { 1: 'B', 2: 'B', 3: 'C', 4: 'B', 5: 'B' },
    16: { 1: 'B', 2: 'C', 3: 'B', 4: 'B', 5: 'C' },
    17: { 1: 'C', 2: 'B', 3: 'A', 4: 'C', 5: 'C' },
    18: { 1: 'B', 2: 'B', 3: 'B', 4: 'D', 5: 'B' },
    19: { 1: 'B', 2: 'B', 3: 'C', 4: 'B', 5: 'C' },
    20: { 1: 'C', 2: 'C', 3: 'B', 4: 'B', 5: 'C' },
    21: { 1: 'B', 2: 'C', 3: 'D', 4: 'B', 5: 'C' },
    22: { 1: 'C', 2: 'C', 3: 'B', 4: 'B', 5: 'C' },
    23: { 1: 'B', 2: 'C', 3: 'C', 4: 'B', 5: 'B' },
    24: { 1: 'B', 2: 'B', 3: 'B', 4: 'A', 5: 'C' },
    25: { 1: 'C', 2: 'B', 3: 'B', 4: 'C', 5: 'B' },
    26: { 1: 'C', 2: 'B', 3: 'C', 4: 'C', 5: 'B' },
    27: { 1: 'C', 2: 'B', 3: 'B', 4: 'C', 5: 'C' },
    28: { 1: 'C', 2: 'B', 3: 'C', 4: 'C', 5: 'B' },
    29: { 1: 'B', 2: 'C', 3: 'C', 4: 'B', 5: 'B' },
    30: { 1: 'B', 2: 'B', 3: 'C', 4: 'B', 5: 'B' },
};

// Eagerly load all quiz files from the content directory
const quizFiles = import.meta.glob('../content/*/quiz/Quiz-*.ts', { eager: true });

/**
 * Fetch raw quiz content for a specific day and language
 */
const fetchRawQuizContent = (dayNumber: number, language: string = 'ta'): string => {
    try {
        const path = `../content/${language}/quiz/Quiz-${dayNumber}.ts`;
        const module = quizFiles[path] as any;

        if (!module) {
            console.warn(`Quiz content not found for Day ${dayNumber} (${language}) at ${path}`);
            return '';
        }

        const quizFn = module[`getMockQuizForDay${dayNumber}`] ||
            module.getMockQuizForDay100 || // legacy link
            module.default;

        if (!quizFn) return '';
        const slides = typeof quizFn === 'function' ? quizFn() : quizFn;
        return slides.length > 0 ? slides[0].content : '';
    } catch (error) {
        console.error(`Error loading quiz for Day ${dayNumber} (${language}):`, error);
        return '';
    }
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

// Eagerly load all evidence files from the content directory
const evidenceFiles = import.meta.glob('../content/*/quiz/Evidence.ts', { eager: true });

/**
 * Fetch evidence for a specific day and language.
 */
export const fetchEvidenceByDay = (dayNumber: number, language: string = 'ta'): any[] => {
    try {
        const path = `../content/${language}/quiz/Evidence.ts`;
        const module = evidenceFiles[path] as any;

        if (!module) {
            console.warn(`Evidence content not found for (${language}) at ${path}`);
            return [];
        }

        const evidence = module.QUIZ_EVIDENCE || module.default;
        return evidence[dayNumber] || [];
    } catch (error) {
        console.error(`Error loading evidence for Day ${dayNumber} (${language}):`, error);
        return [];
    }
};

/**
 * Fetch and parse quiz for a specific day and language.
 */
export const fetchQuizByDay = (dayNumber: number, language: string = 'ta'): Question[] => {
    const rawContent = fetchRawQuizContent(dayNumber, language);
    if (!rawContent) return [];
    const questions = parseQuizContent(rawContent);

    // Apply explicit answer key
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
