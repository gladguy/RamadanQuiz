export interface QuizOption {
    label: string; // A, B, C, D
    text: string;
}

export interface Question {
    id: number;
    questionText: string;
    options: QuizOption[];
    correctAnswer: string; // The label of the correct answer (A, B, C, D)
}

export interface QuizResult {
    totalQuestions: number;
    correctAnswers: number;
    percentage: number;
}
