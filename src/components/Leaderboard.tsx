import { useState, useEffect } from 'react';
import { getLeaderboard, LeaderboardEntry } from '../services/quizResultsService';
import { Trophy, Medal, Award } from 'lucide-react';

const RANK_ICONS = [Trophy, Medal, Award];
const RANK_LABELS = ['🥇', '🥈', '🥉'];

const Leaderboard = () => {
    const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const whatsappGroup = localStorage.getItem('ramadan_quiz_group');

    useEffect(() => {
        const fetchLeaderboard = async () => {
            if (!whatsappGroup) {
                setLoading(false);
                return;
            }
            const data = await getLeaderboard(3, whatsappGroup);
            setEntries(data);
            setLoading(false);
        };
        fetchLeaderboard();
    }, [whatsappGroup]);

    if (!whatsappGroup) return null;

    if (loading) {
        return (
            <div className="leaderboard-container">
                <h2 className="leaderboard-title">
                    <Trophy size={24} />
                    சிறந்த மாணவர்கள்
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
                    சிறந்த மாணவர்கள்
                </h2>
                <p className="leaderboard-empty">உங்கள் குழுவில் இன்னும் யாரும் வினாடி வினாவை முயற்சிக்கவில்லை</p>
            </div>
        );
    }

    return (
        <div className="leaderboard-container">
            <h2 className="leaderboard-title">
                <Trophy size={24} />
                சிறந்த மாணவர்கள்
            </h2>
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
