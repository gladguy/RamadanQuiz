import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchQuizByDay } from '../services/quizService';
import { saveQuizResult, getUserQuizAttempt, QuizResultRecord } from '../services/quizResultsService';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Question } from '../types/quiz';
import { ChevronLeft, ChevronRight, Trophy, Home, CheckCircle, XCircle, Search, X } from 'lucide-react';
import { QUIZ_EVIDENCE } from '../services/Quiz/Evidence';
import GroupSelectionModal from './GroupSelectionModal';

const QuizPage = () => {
    const { dayNumber } = useParams<{ dayNumber: string }>();
    const navigate = useNavigate();
    const { currentUser, loading: authLoading } = useAuth();
    const { t, language } = useLanguage();

    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
    const [showResult, setShowResult] = useState(false);
    const [revealed, setRevealed] = useState<Record<number, boolean>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [previousResult, setPreviousResult] = useState<QuizResultRecord | null>(null);
    const [showEvidence, setShowEvidence] = useState(false);
    const [whatsappGroup, setWhatsappGroup] = useState<string | null>(localStorage.getItem('ramadan_quiz_group'));
    const [showGroupModal, setShowGroupModal] = useState(false);

    useEffect(() => {
        if (!dayNumber) return;
        // Wait for auth to finish loading before checking Firestore
        if (authLoading) return;

        const day = parseInt(dayNumber);
        const email = currentUser?.email;

        const loadQuiz = async () => {
            // Check if user has already attempted this day's quiz
            if (email) {
                const existing = await getUserQuizAttempt(email, day);
                if (existing) {
                    setPreviousResult(existing);
                    setLoading(false);
                    return;
                }
            }

            const parsed = fetchQuizByDay(day, language);
            if (parsed.length > 0) {
                setQuestions(parsed);
            } else {
                setError(t('common.error'));
            }
            setLoading(false);
        };

        loadQuiz();
    }, [dayNumber, currentUser, authLoading]);

    const currentQuestion = questions[currentIndex];
    const isAnswered = currentQuestion && selectedAnswers[currentQuestion.id] !== undefined;
    const isRevealed = currentQuestion && revealed[currentQuestion.id];
    const isLastQuestion = currentIndex === questions.length - 1;

    const handleSelectOption = (label: string) => {
        if (isRevealed) return; // Can't change after reveal

        setSelectedAnswers(prev => ({
            ...prev,
            [currentQuestion.id]: label,
        }));

        // Auto-reveal after selection
        setTimeout(() => {
            setRevealed(prev => ({
                ...prev,
                [currentQuestion.id]: true,
            }));
        }, 300);
    };

    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const handleShowResults = async () => {
        setShowResult(true);

        // Save results to Firebase
        const score = getScore();
        const email = currentUser?.email || 'unknown';
        const day = parseInt(dayNumber || '0');

        setSaving(true);
        try {
            await saveQuizResult({
                dayNumber: day,
                score,
                totalQuestions: questions.length,
                percentage: Math.round((score / questions.length) * 100),
                userEmail: email,
                dateAttempted: new Date().toISOString(),
                whatsappGroup: whatsappGroup || 'Unknown'
            });
            setSaved(true);
        } catch (err) {
            console.error('Failed to save quiz result:', err);
        } finally {
            setSaving(false);
        }
    };

    // No retry allowed — each user gets only one attempt per day

    const getScore = () => {
        let correct = 0;
        questions.forEach(q => {
            if (selectedAnswers[q.id] === q.correctAnswer) {
                correct++;
            }
        });
        return correct;
    };

    const getOptionClass = (label: string) => {
        if (!isRevealed) {
            return selectedAnswers[currentQuestion.id] === label ? 'selected' : '';
        }

        const isCorrectAnswer = label === currentQuestion.correctAnswer;
        const isSelectedAnswer = selectedAnswers[currentQuestion.id] === label;

        if (isCorrectAnswer) return 'correct';
        if (isSelectedAnswer && !isCorrectAnswer) return 'incorrect';
        return 'dimmed';
    };

    if (loading) {
        return (
            <div className="quiz-page-container">
                <div className="learning-module-loading">
                    <div className="spinner"></div>
                    <p>{t('quiz.save_status')}</p>
                </div>
            </div>
        );
    }

    // Already attempted — show previous result
    if (previousResult) {
        const { score, totalQuestions, percentage } = previousResult;
        const emoji = percentage >= 80 ? '🌟' : percentage >= 60 ? '👍' : percentage >= 40 ? '📖' : '💪';
        const attemptDate = new Date(previousResult.dateAttempted).toLocaleDateString('ta-IN', {
            year: 'numeric', month: 'long', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });

        return (
            <div className="quiz-page-container">
                <div className="quiz-results-card">
                    <div className="results-emoji">{emoji}</div>
                    <h2 className="results-title">
                        {dayNumber === '0' ? t('dashboard.try_lesson') : `${t('dashboard.day_label')} ${dayNumber}`} - {t('quiz.results_title')}
                    </h2>
                    <div className="results-score-circle">
                        <span className="score-number">{score}</span>
                        <span className="score-divider">/</span>
                        <span className="score-total">{totalQuestions}</span>
                    </div>
                    <div className="results-percentage">{percentage}%</div>
                    <p className="results-message">
                        {t('quiz.already_attempted')}
                    </p>
                    <p className="results-save-status">📅 {attemptDate}</p>

                    <div className="results-actions">
                        <button onClick={() => setShowEvidence(true)} className="results-btn verify-btn">
                            <Search size={20} />
                            <span>{t('quiz.verify')}</span>
                        </button>
                        <button onClick={() => navigate('/dashboard')} className="results-btn home-btn">
                            <Home size={20} />
                            <span>{t('common.home')}</span>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (error || questions.length === 0) {
        return (
            <div className="quiz-page-container">
                <div className="learning-module-error">
                    <h2>{t('common.error')}</h2>
                    <p>{error || t('common.error')}</p>
                    <button onClick={() => navigate('/dashboard')} className="back-to-dashboard">
                        {t('common.home')}
                    </button>
                </div>
            </div>
        );
    }

    // Results Screen
    if (showResult) {
        const score = getScore();
        const percentage = Math.round((score / questions.length) * 100);
        const emoji = percentage >= 80 ? '🌟' : percentage >= 60 ? '👍' : percentage >= 40 ? '📖' : '💪';
        const message = percentage >= 80
            ? (language === 'ta' ? 'மாஷா அல்லாஹ்! சிறப்பான மதிப்பெண்!' : 'Masha Allah! Excellent score!')
            : percentage >= 60
                ? (language === 'ta' ? 'நல்ல முயற்சி! இன்னும் சிறப்பாக செய்யலாம்!' : 'Good effort! You can do even better!')
                : percentage >= 40
                    ? (language === 'ta' ? 'மீண்டும் பாடங்களைப் படித்து முயற்சிக்கவும்' : 'Study the lesson again and try hard')
                    : (language === 'ta' ? 'விடாமல் முயற்சி செய்யுங்கள்! அல்லாஹ் உதவி செய்வான்!' : 'Keep trying! Allah will help you!');

        return (
            <div className="quiz-page-container">
                <div className="quiz-results-card">
                    <div className="results-emoji">{emoji}</div>
                    <h2 className="results-title">{t('quiz.results_title')}</h2>
                    <div className="results-score-circle">
                        <span className="score-number">{score}</span>
                        <span className="score-divider">/</span>
                        <span className="score-total">{questions.length}</span>
                    </div>
                    <div className="results-percentage">{percentage}%</div>
                    <p className="results-message">{message}</p>
                    {saving && <p className="results-save-status">💾 {t('quiz.save_status')}</p>}
                    {saved && <p className="results-save-status saved">✅ {t('quiz.saved_status')}</p>}

                    <div className="results-actions">
                        <button onClick={() => setShowEvidence(true)} className="results-btn verify-btn">
                            <Search size={20} />
                            <span>{t('quiz.verify')}</span>
                        </button>
                        <button onClick={() => navigate('/dashboard')} className="results-btn home-btn">
                            <Home size={20} />
                            <span>{t('common.home')}</span>
                        </button>
                    </div>
                </div>

                {/* Evidence Modal */}
                {showEvidence && (
                    <div className="evidence-modal-overlay" onClick={() => setShowEvidence(false)}>
                        <div className="evidence-modal" onClick={e => e.stopPropagation()}>
                            <div className="evidence-header">
                                <h2>{t('quiz.evidence_title')}</h2>
                                <button className="close-btn" onClick={() => setShowEvidence(false)}>
                                    <X size={24} />
                                </button>
                            </div>
                            <div className="evidence-content">
                                {QUIZ_EVIDENCE[dayNumber ? parseInt(dayNumber) : 0]?.map((item, idx) => (
                                    <div key={idx} className="evidence-item">
                                        <div className="evidence-q">{idx + 1}. {item.q}</div>
                                        <div className="evidence-a">
                                            <strong>பதில்:</strong>
                                            <span>{item.a}</span>
                                        </div>
                                        <div className="evidence-p">
                                            {item.p}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // Quiz Question Screen
    return (
        <div className="quiz-page-container">
            {/* Header */}
            <header className="quiz-header">
                <button onClick={() => navigate(`/learn/${dayNumber}`)} className="back-button">
                    <ChevronLeft size={20} />
                    {t('common.back')}
                </button>
                <h1 className="quiz-title">
                    {dayNumber === '0' ? t('dashboard.try_lesson') : `${t('dashboard.day_label')} ${dayNumber}`} - {t('quiz.title')}
                </h1>
            </header>

            {/* Progress */}
            <div className="quiz-progress">
                <span className="quiz-progress-text">
                    {t('quiz.question')} {currentIndex + 1} / {questions.length}
                </span>
                <div className="progress-bar">
                    <div
                        className="progress-fill"
                        style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                    />
                </div>
            </div>

            {/* Question Card */}
            <div className="quiz-question-card">
                <h3 className="quiz-question-text">
                    <span className="question-number">{currentQuestion.id}.</span>
                    {' '}{currentQuestion.questionText}
                </h3>

                <div className="quiz-options-grid">
                    {currentQuestion.options.map((option) => (
                        <button
                            key={option.label}
                            className={`quiz-option-btn ${getOptionClass(option.label)}`}
                            onClick={() => handleSelectOption(option.label)}
                            disabled={isRevealed as boolean}
                        >
                            <span className="option-label">{option.label}</span>
                            <span className="option-text">{option.text}</span>
                            {isRevealed && option.label === currentQuestion.correctAnswer && (
                                <CheckCircle className="option-icon correct-icon" size={22} />
                            )}
                            {isRevealed && selectedAnswers[currentQuestion.id] === option.label && option.label !== currentQuestion.correctAnswer && (
                                <XCircle className="option-icon incorrect-icon" size={22} />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Navigation */}
            <div className="quiz-navigation">
                <button
                    onClick={handlePrev}
                    disabled={currentIndex === 0}
                    className="slide-nav-btn"
                >
                    <ChevronLeft size={24} />
                    <span>{t('common.previous')}</span>
                </button>

                {isLastQuestion && isAnswered ? (
                    <button
                        onClick={handleShowResults}
                        className="quiz-button enabled"
                    >
                        <Trophy size={24} />
                        <span>முடிவைக் காண</span>
                    </button>
                ) : (
                    <button
                        onClick={handleNext}
                        disabled={!isRevealed}
                        className="slide-nav-btn primary"
                    >
                        <span>{t('common.next')}</span>
                        <ChevronRight size={24} />
                    </button>
                )}
            </div>

            {/* Group Selection Modal */}
            {(showGroupModal || !whatsappGroup) && (
                <GroupSelectionModal
                    currentGroup={whatsappGroup || undefined}
                    onSelect={(group) => {
                        setWhatsappGroup(group);
                        localStorage.setItem('ramadan_quiz_group', group);
                        setShowGroupModal(false);
                    }}
                />
            )}
        </div>
    );
};

export default QuizPage;
