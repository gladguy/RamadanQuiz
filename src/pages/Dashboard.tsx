import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { isDayUnlocked } from '../utils/ramadanDates';
import { Lock, BookOpen, LogOut, Globe, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Leaderboard from '../components/Leaderboard';
import LanguageToggle from '../components/LanguageToggle';
import { getUserRegion, setUserRegion, REGION_CONFIGS, Region, getRegionalStartDate } from '../services/regionService';
import { getGulfStartDate } from '../services/appConfigService';
import { getUserProfile, updateUserProfile } from '../services/userService';
import RegionSelectionModal from '../components/RegionSelectionModal';
import { useState, useEffect } from 'react';

const Dashboard = () => {
    const { currentUser, isAdmin, signOut } = useAuth();
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [region, setRegion] = useState<Region | null>(getUserRegion());
    const [gulfStartDate, setGulfStartDate] = useState<string>('2026-02-18');
    const [showRegionModal, setShowRegionModal] = useState(false);

    useEffect(() => {
        const fetchConfigAndProfile = async () => {
            const [date, profile] = await Promise.all([
                getGulfStartDate(),
                currentUser ? getUserProfile(currentUser.uid) : null
            ]);

            setGulfStartDate(date);

            if (profile?.region) {
                setRegion(profile.region as Region);
                setUserRegion(profile.region as Region);
            } else if (!region) {
                setShowRegionModal(true);
            }
        };
        fetchConfigAndProfile();
    }, [currentUser]);

    const handleRegionSelect = async (selectedRegion: Region) => {
        if (currentUser) {
            await updateUserProfile(currentUser.uid, { region: selectedRegion });
            setRegion(selectedRegion);
            setUserRegion(selectedRegion);
            setShowRegionModal(false);
        }
    };

    const currentStartDate = region ? getRegionalStartDate(gulfStartDate, region) : gulfStartDate;

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
                        <div className="title-area" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <BookOpen size={32} className="header-icon" />
                            <div>
                                <h1 className="header-title">
                                    <span className="desktop-only">{t('dashboard.title_desktop')}</span>
                                    <span className="mobile-only">{t('dashboard.title_mobile')}</span>
                                </h1>
                            </div>
                        </div>

                        {region && (
                            <div className="region-display" style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                background: 'var(--surface-light)',
                                padding: '0.4rem 0.8rem',
                                borderRadius: '20px',
                                border: '1px solid var(--gold-accent)',
                                color: 'var(--text-primary)',
                                fontSize: '1rem'
                            }}>
                                <span style={{ fontSize: '1.2rem' }}>{REGION_CONFIGS[region].flag}</span>
                                <span>{REGION_CONFIGS[region].name}</span>
                            </div>
                        )}
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
                                    padding: '0.4rem 0.8rem',
                                    borderRadius: '20px',
                                    cursor: 'pointer'
                                }}
                            >
                                <Shield size={20} />
                                <span className="desktop-only">{t('common.admin')}</span>
                            </button>
                        )}
                        <LanguageToggle />
                        <button onClick={handleSignOut} className="signout-btn">
                            <span>{t('common.signout')}</span>
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
                                    <div className="day-number"><span className="day-label metallic-gold-text">{t('dashboard.day_label')}</span> {day}</div>
                                    {unlocked && (
                                        <div className="day-status">{t('dashboard.day_ready')}</div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </main>

            {showRegionModal && <RegionSelectionModal onSelect={handleRegionSelect} />}
        </div>
    );
};

export default Dashboard;
