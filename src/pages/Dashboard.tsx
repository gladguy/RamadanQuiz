import { useAuth } from '../contexts/AuthContext';
import { isDayUnlocked } from '../utils/ramadanDates';
import { Lock, BookOpen, LogOut, Globe, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Leaderboard from '../components/Leaderboard';
import { getUserRegion, setUserRegion, REGION_CONFIGS, Region } from '../services/regionService';
import { useState } from 'react';

const Dashboard = () => {
    const { currentUser, isAdmin, signOut } = useAuth();
    const navigate = useNavigate();
    const [region, setRegion] = useState<Region>(getUserRegion());

    const handleRegionChange = (newRegion: Region) => {
        setRegion(newRegion);
        setUserRegion(newRegion);
    };

    const currentStartDate = REGION_CONFIGS[region].startDate;

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
                    <div className="header-left" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <div className="title-area" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
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

                        <div className="region-selector" style={{ display: 'flex', alignItems: 'center', background: 'var(--surface-light)', padding: '0.4rem 0.6rem', borderRadius: '20px', border: '1px solid var(--border)' }}>
                            <select
                                value={region}
                                onChange={(e) => handleRegionChange(e.target.value as Region)}
                                style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', outline: 'none', fontSize: '1.2rem', appearance: 'none' }}
                            >
                                {Object.entries(REGION_CONFIGS).map(([key, config]) => (
                                    <option key={key} value={key} style={{ background: 'var(--surface)', color: 'white', fontSize: '1rem' }}>
                                        {config.flag} {config.name}
                                    </option>
                                ))}
                            </select>
                            <div style={{ pointerEvents: 'none', marginLeft: '-0.3rem', color: 'var(--gold-accent)', fontSize: '0.8rem' }}>▼</div>
                        </div>
                    </div>
                    <div className="header-right" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        {isAdmin && (
                            <button
                                onClick={() => navigate('/admin')}
                                className="admin-btn"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    background: 'rgba(238, 198, 95, 0.1)',
                                    border: '1px solid var(--gold-accent)',
                                    color: 'var(--gold-accent)',
                                    padding: '0.5rem 1rem',
                                    borderRadius: '12px',
                                    cursor: 'pointer',
                                    fontWeight: 'bold'
                                }}
                            >
                                <Shield size={20} />
                                <span className="desktop-only">Admin</span>
                            </button>
                        )}
                        <button onClick={handleSignOut} className="signout-btn">
                            <LogOut size={20} />
                            <span className="desktop-only">வெளியேறு</span>
                            <span className="mobile-only" style={{ fontSize: '1.2rem' }}>🚪➡️</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Leaderboard */}
            <Leaderboard />

            {/* Main Content */}
            <main className="dashboard-main">
                <div className="special-lesson-section" style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
                    <div
                        className="day-card unlocked special"
                        onClick={() => handleDayClick(0, true)}
                        style={{
                            maxWidth: '200px',
                            margin: '0 auto',
                            aspectRatio: 'unset',
                            padding: '1rem',
                            background: '#000',
                            color: 'var(--gold-accent)',
                            border: '1px solid var(--gold-accent)',
                            boxShadow: '0 4px 15px rgba(238, 198, 95, 0.2)'
                        }}
                    >
                        <div className="day-card-content">
                            <div className="day-number" style={{ fontSize: '1.2rem' }}>Try Lesson</div>
                        </div>
                    </div>
                </div>

                <div className="days-grid">
                    {days.map((day) => {
                        const unlocked = isAdmin || isDayUnlocked(day, currentStartDate);
                        const isLockedForUser = !isAdmin && !isDayUnlocked(day, currentStartDate);
                        return (
                            <div
                                key={day}
                                className={`day-card ${unlocked ? 'unlocked' : 'locked'}`}
                                onClick={() => handleDayClick(day, unlocked)}
                            >
                                <div className="day-card-content">
                                    {isLockedForUser && (
                                        <div className="lock-overlay">
                                            <Lock size={24} />
                                        </div>
                                    )}
                                    <div className="day-number"><span className="day-label">நோன்பு</span> {day}</div>
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
