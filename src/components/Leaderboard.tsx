import { useState, useEffect } from 'react';
import { getLeaderboard, LeaderboardEntry } from '../services/quizResultsService';
import { Trophy, Medal, Award } from 'lucide-react';

const RANK_ICONS = [Trophy, Medal, Award];
const RANK_LABELS = ['🥇', '🥈', '🥉'];

interface LeaderboardProps {
    whatsappGroup?: string;
}

const Leaderboard = ({ whatsappGroup: propGroup }: LeaderboardProps) => {
    const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const whatsappGroup = (propGroup || localStorage.getItem('ramadan_quiz_group'))?.trim();

    useEffect(() => {
        const fetchLeaderboard = async () => {
            if (!whatsappGroup) {
                setLoading(false);
                setEntries([]);
                return;
            }
            setLoading(true);
            try {
                const data = await getLeaderboard(5, whatsappGroup);
                setEntries(data);
            } catch (err) {
                console.error('Leaderboard fetch error:', err);
                setEntries([]);
            } finally {
                setLoading(false);
            }
        };
        fetchLeaderboard();
    }, [whatsappGroup]);

    if (loading) {
        return (
            <div className="leaderboard-container">
                <h2 className="leaderboard-title">
                    <Trophy size={24} />
                    3 சிறந்த உறுப்பினர்கள்
                </h2>
                <div className="leaderboard-loading">
                    <div className="spinner"></div>
                </div>
            </div>
        );
    }

    if (entries.length === 0) {
        return (
            <div className="leaderboard-container">
                <h2 className="leaderboard-title">
                    <Trophy size={24} />
                    3 சிறந்த உறுப்பினர்கள்
                </h2>
                {whatsappGroup && (
                    <div className="mobile-only" style={{
                        fontSize: '0.75rem',
                        color: 'var(--text-secondary)',
                        textAlign: 'center',
                        marginTop: '-0.8rem',
                        marginBottom: '1rem',
                        opacity: 0.8
                    }}>
                        {whatsappGroup}
                    </div>
                )}
                <p className="leaderboard-empty" style={{ opacity: 0.6, fontStyle: 'italic' }}>
                    {whatsappGroup ? 'உங்கள் குழுவில் இன்னும் யாரும் வினாடி வினாவை முயற்சிக்கவில்லை (பாடப் பயிற்சி தவிர்த்து)' : 'குழுவை தேர்ந்தெடுத்து சிறந்த மாணவர்களைப் பாருங்கள்'}
                </p>
            </div>
        );
    }

    return (
        <div className="leaderboard-container">
            <h2 className="leaderboard-title">
                <Trophy size={24} />
                சிறந்த மாணவர்கள்
            </h2>
            {whatsappGroup && (
                <div className="mobile-only" style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-secondary)',
                    textAlign: 'center',
                    marginTop: '-0.8rem',
                    marginBottom: '1rem',
                    opacity: 0.8
                }}>
                    {whatsappGroup}
                </div>
            )}
            <div className="leaderboard-list">
                {entries.map((entry, index) => {
                    const RankIcon = RANK_ICONS[index] || Award;
                    return (
                        <div key={entry.userEmail} className={`leaderboard-row rank-${index + 1}`}>
                            <div className="leaderboard-rank">
                                <span className="rank-medal">{RANK_LABELS[index]}</span>
                            </div>
                            <div className="leaderboard-info">
                                <div className="leaderboard-name">{entry.displayName}</div>
                                <div className="leaderboard-stats">
                                    பங்கெடுத்த நாட்கள் : {entry.quizzesTaken} • {entry.totalScore}/{entry.totalQuestions} சரி
                                </div>
                            </div>
                            <div className="leaderboard-score">
                                <span className="score-percentage">{entry.averagePercentage}%</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Leaderboard;
