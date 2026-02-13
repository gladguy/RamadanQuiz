import { useAuth } from '../contexts/AuthContext';
import { BookOpen, Calendar, Trophy, Sparkles } from 'lucide-react';

const Landing = () => {
    const { signInWithGoogle } = useAuth();

    const handleSignIn = async () => {
        try {
            await signInWithGoogle();
        } catch (error) {
            console.error('Sign in failed:', error);
        }
    };

    return (
        <div className="landing-container">
            <div className="landing-content">
                {/* Hero Section */}
                <div className="hero-section">
                    <div className="hero-icon">
                        <BookOpen size={64} />
                    </div>
                    <h1 className="hero-title">
                        <span className="desktop-only">ரமழான் 2026 (ஹிஜிரி 1447) - குர்ஆன் கேள்வி பதில்</span>
                        <span className="mobile-only">ரமழான் கேள்வி பதில்</span>
                    </h1>
                    <p className="hero-subtitle">
                        ரமழானின் ஒவ்வொரு நாளும் குர்ஆனுடன் நெருக்கமாகுங்கள்
                    </p>
                </div>

                {/* Features Grid */}
                <div className="features-grid">
                    <div className="feature-card">
                        <Calendar className="feature-icon" size={32} />
                        <h3 className="feature-title">30 நாட்கள்</h3>
                        <p className="feature-description">
                            ரமழானின் ஒவ்வொரு நாளும் ஒரு புதிய பாடம்
                        </p>
                    </div>

                    <div className="feature-card">
                        <BookOpen className="feature-icon" size={32} />
                        <h3 className="feature-title">தினசரி வாசிப்பு</h3>
                        <p className="feature-description">
                            குர்ஆனின் தேர்ந்தெடுக்கப்பட்ட வசனங்கள்
                        </p>
                    </div>

                    <div className="feature-card">
                        <Trophy className="feature-icon" size={32} />
                        <h3 className="feature-title">முன்னேற்றம்</h3>
                        <p className="feature-description">
                            உங்கள் பயணத்தை கண்காணியுங்கள்
                        </p>
                    </div>

                    <div className="feature-card">
                        <Sparkles className="feature-icon" size={32} />
                        <h3 className="feature-title">ஆன்மீக வளர்ச்சி</h3>
                        <p className="feature-description">
                            தினமும் புதிய நுண்ணறிவுகளை கண்டறியுங்கள்
                        </p>
                    </div>
                </div>

                {/* Call to Action */}
                <div className="cta-section">
                    <button onClick={handleSignIn} className="google-signin-btn">
                        <svg className="google-icon" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Google இல் உள்நுழைக
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Landing;
