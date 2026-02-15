import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { fetchAyahForMulk, AyahData } from '../services/quranService';
import { getUserProfile, updateUserProfile } from '../services/userService';
import { ChevronLeft, CheckCircle, Music, Book, Loader, Heart } from 'lucide-react';
import { incrementVersePlayCount, getVerseStats, toggleVerseLike, toggleVerseMemorized, VerseStats } from '../services/verseService';
import goldMushafIcon from '../assets/gold_mushaf_icon.png';

const MulkChallenge = () => {
    const { currentUser } = useAuth();
    const { t } = useLanguage();
    const navigate = useNavigate();
    const { dayNumber } = useParams<{ dayNumber: string }>();
    const currentDay = dayNumber === '0' ? 1 : Math.max(1, dayNumber ? parseInt(dayNumber) : 1);

    const [ayah, setAyah] = useState<AyahData | null>(null);
    const [loading, setLoading] = useState(true);
    const [isCompleted, setIsCompleted] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [stats, setStats] = useState<VerseStats>({ playCount: 0, likeCount: 0, memorizedCount: 0, userLiked: false, userMemorized: false });

    useEffect(() => {
        const loadAyahAndProgress = async () => {
            try {
                setLoading(true);
                const [ayahData, profile, verseStats] = await Promise.all([
                    fetchAyahForMulk(currentDay),
                    currentUser ? getUserProfile(currentUser.uid) : null,
                    getVerseStats(67, currentDay, currentUser?.uid)
                ]);

                setAyah(ayahData);
                setStats(verseStats);
                if (profile?.lastMulkDay && profile.lastMulkDay >= currentDay) {
                    setIsCompleted(true);
                }
            } catch (error) {
                console.error('Error loading Mulk challenge:', error);
            } finally {
                setLoading(false);
            }
        };

        loadAyahAndProgress();
    }, [currentDay, currentUser]);

    const handleLike = async () => {
        if (!currentUser) return;

        // Optimistic Update
        const previousStats = { ...stats };
        const isLiking = !stats.userLiked;

        setStats(prev => ({
            ...prev,
            userLiked: isLiking,
            likeCount: isLiking ? prev.likeCount + 1 : Math.max(0, prev.likeCount - 1)
        }));

        try {
            const confirmedLikedState = await toggleVerseLike(67, currentDay, currentUser.uid);
            // Sync with server state if it differs from optimistic (unlikely but safe)
            if (confirmedLikedState !== isLiking) {
                setStats(prev => ({
                    ...prev,
                    userLiked: confirmedLikedState,
                    likeCount: confirmedLikedState ? previousStats.likeCount + 1 : previousStats.likeCount
                }));
            }
        } catch (error) {
            console.error('Error liking verse:', error);
            // Rollback on error
            setStats(previousStats);
        }
    };


    const handleComplete = async () => {
        if (!currentUser || isCompleted || updating) return;

        try {
            setUpdating(true);

            // 1. Update user profile progress
            await updateUserProfile(currentUser.uid, { lastMulkDay: currentDay });
            setIsCompleted(true);

            // 2. Update verse memorization stats if not already memorized
            if (!stats.userMemorized) {
                const isNowMemorized = await toggleVerseMemorized(67, currentDay, currentUser.uid);
                if (isNowMemorized) {
                    setStats(prev => ({
                        ...prev,
                        userMemorized: true,
                        memorizedCount: prev.memorizedCount + 1
                    }));
                }
            }
        } catch (error) {
            console.error('Error updating progress:', error);
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="learning-module-loading">
                <Loader className="spinner-icon" size={48} />
                <p>{t('common.loading')}</p>
            </div>
        );
    }

    if (!ayah) {
        return (
            <div className="learning-module-error">
                <h2>{t('common.error')}</h2>
                <button onClick={() => navigate('/dashboard')} className="back-to-dashboard">
                    {t('common.home')}
                </button>
            </div>
        );
    }

    return (
        <div className="learning-module-container">
            <header className="learning-header" style={{ flexDirection: 'column', gap: '1rem', padding: '1.5rem 2rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', width: '100%', alignItems: 'center', gap: '1rem' }}>
                    <button onClick={() => navigate(-1)} className="back-button">
                        <ChevronLeft size={20} />
                        <span className="desktop-only">{t('common.back')}</span>
                    </button>
                    <h1 className="learning-title" style={{ margin: 0, textAlign: 'center' }}>
                        {t('mulk.title')} (<span className="metallic-gold-text">{t('dashboard.day_label')}</span> {currentDay})
                    </h1>
                    {/* Placeholder for symmetry */}
                    <div style={{ width: '40px' }} className="desktop-only"></div>
                </div>
            </header>

            <main className="learning-main">
                <div className="slide-container" style={{ textAlign: 'center' }}>
                    <div className="slide-content-wrapper">
                        <div style={{ marginBottom: '2rem' }}>
                            <Book size={48} style={{ color: 'var(--gold-accent)', marginBottom: '1rem' }} />
                            <h2 style={{ fontSize: '2.5rem', color: 'var(--gold-accent)', fontFamily: "'Amiri', serif", fontWeight: 700 }}>
                                سورة الملك
                            </h2>
                            <p style={{ color: 'var(--text-secondary)' }}>Ayah {ayah.numberInSurah}</p>
                        </div>

                        <div style={{
                            background: 'var(--surface-light)',
                            padding: '1.5rem 2rem',
                            borderRadius: '20px',
                            border: '1px solid var(--border)',
                            marginBottom: '2.5rem',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '0.8rem'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', justifyContent: 'center' }}>
                                <Music size={24} style={{ color: 'var(--gold-accent)' }} />
                                <span style={{ fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase', fontSize: '0.9rem', color: 'var(--gold-accent)' }}>
                                    {t('quiz.listen_audio')}
                                </span>
                            </div>
                            <audio
                                controls
                                src={ayah.audio}
                                style={{ width: '100%', height: '40px' }}
                                onPlay={() => {
                                    incrementVersePlayCount(67, currentDay);
                                    setStats(prev => ({ ...prev, playCount: prev.playCount + 1 }));
                                }}
                            >
                                Your browser does not support the audio element.
                            </audio>

                            <div style={{
                                display: 'flex',
                                justifyContent: 'center',
                                gap: '2.5rem',
                                borderTop: '1px solid rgba(238, 198, 95, 0.1)',
                                paddingTop: '1.5rem',
                                marginTop: '1rem',
                                width: '100%'
                            }}>
                                <div
                                    title="Listens"
                                    style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-secondary)' }}
                                >
                                    <span style={{ fontSize: '1.5rem' }}>👂</span>
                                    <span style={{ fontSize: '1.1rem', fontWeight: '800' }}>{stats.playCount}</span>
                                </div>
                                <button
                                    onClick={handleLike}
                                    title="Likes"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.6rem',
                                        background: 'transparent',
                                        border: 'none',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    <span style={{ fontSize: '1.5rem', filter: stats.userLiked ? 'none' : 'grayscale(100%) opacity(0.6)' }}>
                                        ❤️
                                    </span>
                                    <span style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-secondary)' }}>
                                        {stats.likeCount}
                                    </span>
                                </button>
                                <div
                                    title={`${stats.memorizedCount} members memorised the Ayah`}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.6rem',
                                        background: 'transparent',
                                        border: 'none',
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    <span style={{
                                        fontSize: '1.5rem',
                                        filter: (stats.userMemorized || stats.memorizedCount > 1) ? 'none' : 'grayscale(100%) opacity(0.6)'
                                    }}>
                                        🧠
                                    </span>
                                    <span style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-secondary)' }}>
                                        {stats.memorizedCount}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div style={{ marginBottom: '3rem' }}>
                            <div style={{
                                background: 'var(--surface-light)',
                                padding: '3rem 2rem',
                                borderRadius: '24px',
                                border: '2px solid transparent',
                                backgroundImage: 'linear-gradient(var(--surface-light), var(--surface-light)), var(--primary-gradient)',
                                backgroundOrigin: 'border-box',
                                backgroundClip: 'padding-box, border-box',
                                boxShadow: '0 10px 40px rgba(0,0,0,0.6)',
                                position: 'relative'
                            }}>
                                <p style={{
                                    fontSize: '3rem',
                                    lineHeight: '1.5',
                                    marginBottom: '2rem',
                                    color: 'var(--text-primary)',
                                    fontFamily: "'Scheherazade New', serif",
                                    direction: 'rtl',
                                    textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                                }}>
                                    {ayah.arabicText}
                                </p>
                                <div style={{
                                    width: '60px',
                                    height: '3px',
                                    background: 'var(--primary-gradient)',
                                    margin: '0 auto 2rem',
                                    borderRadius: '2px'
                                }}></div>

                                <p style={{
                                    fontSize: '1.25rem',
                                    lineHeight: '1.8',
                                    color: 'var(--text-secondary)',
                                    fontStyle: 'italic',
                                    maxWidth: '800px',
                                    margin: '0 auto 2.5rem'
                                }}>
                                    "{ayah.text}"
                                </p>
                            </div>
                        </div>

                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '1rem',
                            marginTop: '1rem'
                        }}>
                            <button
                                onClick={handleComplete}
                                disabled={isCompleted || updating}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    cursor: isCompleted ? 'default' : 'pointer',
                                    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                                    padding: '0',
                                    outline: 'none',
                                    position: 'relative'
                                }}
                                title={isCompleted ? "Memorisation Completed" : "Click to Mark as Memorised"}
                            >
                                <img
                                    src={goldMushafIcon}
                                    alt="Mushaf Completion Toggle"
                                    style={{
                                        width: '120px',
                                        height: 'auto',
                                        transition: 'all 0.6s ease',
                                        transform: updating ? 'scale(0.95)' : 'scale(1)',
                                        opacity: updating ? 0.7 : 1,
                                        filter: isCompleted
                                            ? 'drop-shadow(0 0 15px rgba(238, 198, 95, 0.4))'
                                            : 'grayscale(100%) opacity(0.4) brightness(0.7)'
                                    }}
                                />
                                {updating && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)'
                                    }}>
                                        <Loader className="spinner-icon" size={32} />
                                    </div>
                                )}
                            </button>
                            <span style={{
                                color: isCompleted ? 'var(--gold-accent)' : 'var(--text-secondary)',
                                fontSize: '0.9rem',
                                fontWeight: '700',
                                textTransform: 'uppercase',
                                letterSpacing: '1px'
                            }}>
                                {isCompleted ? t('quiz.completed_status') : t('quiz.mushaf_tap_instruction')}
                            </span>
                        </div>
                    </div>
                </div>
            </main >
        </div >
    );
};

export default MulkChallenge;
