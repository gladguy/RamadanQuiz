import { useAuth } from '../contexts/AuthContext';
import { isDayUnlocked } from '../utils/ramadanDates';
import { Lock, BookOpen, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Leaderboard from '../components/Leaderboard';

const Dashboard = () => {
    const { currentUser, signOut } = useAuth();
    const navigate = useNavigate();

    const handleSignOut = async () => {
        try {
            await signOut();
        } catch (error) {
            console.error('Sign out failed:', error);
        }
    };

    const handleDayClick = (day: number, unlocked: boolean) => {
        if (unlocked) {
            navigate(`/learn/${day}`);
        }
    };

    const days = Array.from({ length: 30 }, (_, i) => i + 1);

    return (
        <div className="dashboard-container">
            {/* Header */}
            <header className="dashboard-header">
                <div className="header-content">
                    <div className="header-left">
                        <BookOpen size={32} className="header-icon" />
                        <div>
                            <h1 className="header-title">
                                <span className="desktop-only">ரமழான் 2026 (ஹிஜிரி 1447) - குர்ஆன் கேள்வி பதில்</span>
                                <span className="mobile-only">ரமழான் கேள்வி பதில்</span>
                            </h1>
                            <p className="header-subtitle">
                                வரவேற்கிறோம், {currentUser?.displayName || 'நண்பரே'}!
                            </p>
                        </div>
                    </div>
                    <button onClick={handleSignOut} className="signout-btn">
                        <LogOut size={20} />
                        வெளியேறு
                    </button>
                </div>
            </header>

            {/* Leaderboard */}
            <Leaderboard />

            {/* Main Content */}
            <main className="dashboard-main">
                <div className="days-grid">
                    {days.map((day) => {
                        const unlocked = isDayUnlocked(day);
                        return (
                            <div
                                key={day}
                                className={`day-card ${unlocked ? 'unlocked' : 'locked'}`}
                                onClick={() => handleDayClick(day, unlocked)}
                            >
                                <div className="day-card-content">
                                    {!unlocked && (
                                        <div className="lock-overlay">
                                            <Lock size={24} />
                                        </div>
                                    )}
                                    <div className="day-number">நாள் {day}</div>
                                    {unlocked && (
                                        <div className="day-status">தயாராக உள்ளது</div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
