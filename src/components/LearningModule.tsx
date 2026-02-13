import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchSlidesByDay } from '../services/slidesService';
import { Slide as SlideType } from '../types/slide';
import Slide from './Slide';
import { ChevronLeft, ChevronRight, PlayCircle, Loader } from 'lucide-react';

const LearningModule = () => {
    const { dayNumber } = useParams<{ dayNumber: string }>();
    const navigate = useNavigate();

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
                const fetchedSlides = fetchSlidesByDay(day);

                if (fetchedSlides.length > 0) {
                    console.log(`📚 Loading mock slides for Day ${day} (instant)`);
                    setSlides(fetchedSlides);
                } else {
                    setError('இந்த நாளுக்கான பாடங்கள் இன்னும் கிடைக்கவில்லை');
                }
            } catch (err) {
                console.error('Error loading slides:', err);
                setError('பாடங்களை ஏற்றுவதில் பிழை ஏற்பட்டது');
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
                <p>பாடங்களை டவுன்லோடு ஆகிறது !</p>
                <p style={{ fontSize: '0.9rem', marginTop: '-0.5rem' }}>தயவு செய்து காத்திருக்கவும் ...</p>
            </div>
        );
    }

    if (error || slides.length === 0) {
        return (
            <div className="learning-module-error">
                <h2>மன்னிக்கவும்</h2>
                <p>{error || 'பாடங்கள் கிடைக்கவில்லை'}</p>
                <button onClick={() => navigate('/dashboard')} className="back-to-dashboard">
                    முகப்புக்கு திரும்பு
                </button>
            </div>
        );
    }

    return (
        <div className="learning-module-container">
            {/* Header */}
            <header className="learning-header">
                <button onClick={() => navigate('/dashboard')} className="back-button">
                    <ChevronLeft size={20} />
                    முகப்பு
                </button>
                <h1 className="learning-title">நாள் {dayNumber}</h1>
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
                            <span>முந்தைய</span>
                        </button>

                        {!isLastSlide ? (
                            <button
                                onClick={handleNext}
                                className="slide-nav-btn primary"
                            >
                                <span>அடுத்தது</span>
                                <ChevronRight size={24} />
                            </button>
                        ) : (
                            <button
                                onClick={handleStartQuiz}
                                disabled={!allSlidesViewed}
                                className={`quiz-button ${allSlidesViewed ? 'enabled' : 'disabled'}`}
                            >
                                <PlayCircle size={24} />
                                <span>வினாடி வினாவைத் தொடங்கு</span>
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
