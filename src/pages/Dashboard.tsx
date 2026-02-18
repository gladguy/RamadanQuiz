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
import GroupSelectionModal from '../components/GroupSelectionModal';
import { useState, useEffect } from 'react';

const Dashboard = () => {
    const { currentUser, isAdmin, signOut } = useAuth();
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [region, setRegion] = useState<Region | null>(null);
    const [gulfStartDate, setGulfStartDate] = useState<string>('2026-02-18');
    const [showRegionModal, setShowRegionModal] = useState(false);
    const [userProfile, setUserProfile] = useState<any>(null);
    const [whatsappGroup, setWhatsappGroup] = useState<string | null>(localStorage.getItem('ramadan_quiz_group'));
    const [showGroupModal, setShowGroupModal] = useState(false);

    useEffect(() => {
        const fetchConfigAndProfile = async () => {
            const [date, profile] = await Promise.all([
                getGulfStartDate(),
                currentUser ? getUserProfile(currentUser.uid) : null
            ]);

            setGulfStartDate(date);
            if (profile) setUserProfile(profile);

            if (profile?.region) {
                const verifiedRegion = profile.region as Region;
                setRegion(verifiedRegion);
                setUserRegion(verifiedRegion);
            } else {
                setShowRegionModal(true);
            }

            if (profile?.whatsappGroup) {
                setWhatsappGroup(profile.whatsappGroup);
                localStorage.setItem('ramadan_quiz_group', profile.whatsappGroup);
            } else if (!isAdmin) {
                setShowGroupModal(true);
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

    const handleGroupSelect = async (selectedGroup: string) => {
        if (currentUser) {
            const trimmedGroup = selectedGroup.trim();
            await updateUserProfile(currentUser.uid, { whatsappGroup: trimmedGroup });
            setWhatsappGroup(trimmedGroup);
            localStorage.setItem('ramadan_quiz_group', trimmedGroup);

            // Also update local userProfile state to reflect change immediately in header
            if (userProfile) {
                setUserProfile({ ...userProfile, whatsappGroup: trimmedGroup });
            }

            setShowGroupModal(false);
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
                            <div
                                className="region-display"
                                onClick={() => setShowRegionModal(true)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.4rem',
                                    background: 'var(--surface-light)',
                                    padding: '0.4rem 0.8rem',
                                    borderRadius: '20px',
                                    border: '1px solid var(--gold-accent)',
                                    color: 'var(--text-primary)',
                                    fontSize: '1rem',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                <span style={{ fontSize: '1.2rem' }}>{REGION_CONFIGS[region].flag}</span>
                                <span>{REGION_CONFIGS[region].name}</span>
                                <span style={{ fontSize: '0.7rem', color: 'var(--gold-accent)', marginLeft: '2px', opacity: 0.8 }}>▼</span>
                            </div>
                        )}
                    </div>

                    <div className="header-right" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div className="user-greeting" style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-end',
                            marginRight: '0.5rem'
                        }}>
                            <span style={{
                                fontSize: '0.8rem',
                                color: 'var(--gold-accent)',
                                opacity: 0.8,
                                fontWeight: 500
                            }}>
                                {t('common.welcome')}
                            </span>
                            <span style={{
                                fontSize: '1rem',
                                color: 'var(--text-primary)',
                                fontWeight: 600,
                                whiteSpace: 'nowrap'
                            }}>
                                {userProfile?.fullName || currentUser?.displayName || t('common.guest')}
                            </span>
                            {(whatsappGroup || userProfile?.whatsappGroup) && (
                                <span style={{
                                    fontSize: '0.7rem',
                                    color: 'var(--text-primary)',
                                    opacity: 0.6,
                                    fontWeight: 400,
                                    marginTop: '2px'
                                }}>
                                    {whatsappGroup || userProfile?.whatsappGroup}
                                </span>
                            )}
                        </div>
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
            <Leaderboard whatsappGroup={whatsappGroup || undefined} />

            {/* Main Content */}
            <main className="dashboard-main">


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
            {showGroupModal && <GroupSelectionModal onSelect={handleGroupSelect} currentGroup={whatsappGroup || undefined} />}
        </div>
    );
};

export default Dashboard;
