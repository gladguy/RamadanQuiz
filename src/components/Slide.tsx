import { Slide as SlideType } from '../types/slide';

interface SlideProps {
    slide: SlideType;
    currentSlide: number;
    totalSlides: number;
    children?: React.ReactNode;
}

const Slide = ({ slide, currentSlide, totalSlides, children }: SlideProps) => {
    return (
        <div className="slide-container">
            {/* Progress Indicator */}
            <div className="slide-progress">
                <span className="progress-text">
                    {currentSlide} / {totalSlides}
                </span>
                <div className="progress-bar">
                    <div
                        className="progress-fill"
                        style={{ width: `${(currentSlide / totalSlides) * 100}%` }}
                    />
                </div>
            </div>

            {/* Slide Content */}
            <div className="slide-content-wrapper">
                <h2 className="slide-title">{slide.title}</h2>

                {slide.imageUrl && (
                    <div className="slide-image-container">
                        <img
                            src={slide.imageUrl}
                            alt={slide.title}
                            className="slide-image"
                        />
                    </div>
                )}

                <div className="slide-content">
                    <p>{slide.content}</p>
                </div>
            </div>

            {/* Render children (Navigation buttons) inside the gold box */}
            {children}
        </div>
    );
};

export default Slide;
