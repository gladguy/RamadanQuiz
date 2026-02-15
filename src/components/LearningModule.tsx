import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchSlidesByDay } from '../services/slidesService';
import { Slide as SlideType } from '../types/slide';
import Slide from './Slide';
import { useLanguage } from '../contexts/LanguageContext';
import { ChevronLeft, ChevronRight, PlayCircle, Loader } from 'lucide-react';

const LearningModule = () => {
    const { dayNumber } = useParams<{ dayNumber: string }>();
    const navigate = useNavigate();
    const { t, language } = useLanguage();

    const [slides, setSlides] = useState<SlideType[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [viewedSlides, setViewedSlides] = useState<Set<number>>(new Set([0]));
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSlides = async () => {
            if (!dayNumber) return;

            try {
                setLoading(true);

                const day = parseInt(dayNumber);
                const fetchedSlides = fetchSlidesByDay(day, language);

                if (fetchedSlides.length > 0) {
                    console.log(`📚 Loading mock slides for Day ${day} (instant)`);
                    setSlides(fetchedSlides);
                } else {
                    setError(t('common.error'));
                }
            } catch (err) {
                console.error('Error loading slides:', err);
                setError(t('common.error'));
            } finally {
                setLoading(false);
            }
        };


        fetchSlides();
    }, [dayNumber]);

    const handleNext = () => {
        if (currentIndex < slides.length - 1) {
            const nextIndex = currentIndex + 1;
            setCurrentIndex(nextIndex);
            setViewedSlides((prev: Set<number>) => new Set([...prev, nextIndex]));
        }
    };

    const handleBack = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const handleStartQuiz = () => {
        // Navigate to quiz page (to be implemented)
        navigate(`/quiz/${dayNumber}`);
    };

    const allSlidesViewed = viewedSlides.size === slides.length;
    const isLastSlide = currentIndex === slides.length - 1;

    if (loading) {
        return (
            <div className="learning-module-loading">
                <Loader className="spinner-icon" size={48} />
                <p>{t('common.loading')}</p>
            </div>
        );
    }

    if (error || slides.length === 0) {
        return (
            <div className="learning-module-error">
                <h2>{t('common.error')}</h2>
                <p>{error || t('common.error')}</p>
                <button onClick={() => navigate('/dashboard')} className="back-to-dashboard">
                    {t('common.home')}
                </button>
            </div>
        );
    }

    return (
        <div className="learning-module-container">
            {/* Header */}
            <header className="learning-header" style={{ flexDirection: 'column', gap: '1rem', padding: '1.5rem 2rem' }}>
                <div style={{ display: 'flex', width: '100%', alignItems: 'center', position: 'relative', justifyContent: 'center' }}>
                    <button onClick={() => navigate('/dashboard')} className="back-button" style={{ position: 'absolute', left: 0 }}>
                        <ChevronLeft size={20} />
                        <span className="desktop-only">{t('common.home')}</span>
                    </button>
                    <h1 className="learning-title" style={{ margin: 0 }}>
                        {dayNumber === '0' ? t('dashboard.try_lesson') : `${t('dashboard.day_label')} ${dayNumber}`}
                    </h1>
                </div>
                <button
                    onClick={() => navigate(`/mulk-challenge/${dayNumber}`)}
                    className="back-button"
                    style={{
                        background: 'rgba(238, 198, 95, 0.1)',
                        border: '1px solid var(--gold-accent)',
                        color: 'var(--gold-accent)',
                        width: 'fit-content',
                        padding: '0.6rem 2rem'
                    }}
                >
                    {t('mulk.title')}
                </button>
            </header>

            {/* Slide Display */}
            <main className="learning-main">
                <Slide
                    slide={slides[currentIndex]}
                    currentSlide={currentIndex + 1}
                    totalSlides={slides.length}
                >
                    {/* Navigation Controls moved inside Slide container */}
                    <div className="slide-navigation">
                        <button
                            onClick={handleBack}
                            disabled={currentIndex === 0}
                            className="slide-nav-btn"
                        >
                            <ChevronLeft size={24} />
                            <span>{t('common.previous')}</span>
                        </button>

                        {!isLastSlide ? (
                            <button
                                onClick={handleNext}
                                className="slide-nav-btn primary"
                            >
                                <span>{t('common.next')}</span>
                                <ChevronRight size={24} />
                            </button>
                        ) : (
                            <button
                                onClick={handleStartQuiz}
                                disabled={!allSlidesViewed}
                                className={`quiz-button ${allSlidesViewed ? 'enabled' : 'disabled'}`}
                            >
                                <PlayCircle size={24} />
                                <span>{t('quiz.title')}</span>
                            </button>
                        )}
                    </div>

                    {/* Hint for quiz button */}
                    {isLastSlide && !allSlidesViewed && (
                        <p className="quiz-hint">
                            வினாடி வினாவைத் தொடங்க அனைத்து பாடங்களையும் பார்க்கவும்
                        </p>
                    )}
                </Slide>
            </main>
        </div>
    );
};

export default LearningModule;
