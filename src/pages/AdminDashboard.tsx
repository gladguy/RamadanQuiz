import { useState, useEffect } from 'react';
import { getWhatsAppGroups, addWhatsAppGroup, deleteWhatsAppGroup, WhatsAppGroup } from '../services/whatsappGroupsService';
import { getAllQuizResultsForAdmin, QuizResultRecord } from '../services/quizResultsService';
import { getGulfStartDate, updateGulfStartDate } from '../services/appConfigService';
import { getUserProfile, updateUserProfile, getAllUserProfiles, UserProfile } from '../services/userService';
import { Users, Plus, Trash2, Search, Calendar, Trophy, ChevronLeft, Settings, UserPen, Edit2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [groups, setGroups] = useState<WhatsAppGroup[]>([]);
    const [results, setResults] = useState<QuizResultRecord[]>([]);
    const [newGroupName, setNewGroupName] = useState('');
    const [selectedGroup, setSelectedGroup] = useState<string>('');
    const [gulfStartDate, setGulfStartDate] = useState<string>('2026-02-18');
    const [isUpdatingDate, setIsUpdatingDate] = useState(false);
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [userSearchTerm, setUserSearchTerm] = useState('');
    const [isUpdatingUser, setIsUpdatingUser] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const [fetchedGroups, fetchedResults, fetchedDate, fetchedUsers] = await Promise.all([
                    getWhatsAppGroups(),
                    getAllQuizResultsForAdmin(),
                    getGulfStartDate(),
                    getAllUserProfiles()
                ]);
                setGroups(fetchedGroups);
                setResults(fetchedResults);
                setGulfStartDate(fetchedDate);
                setUsers(fetchedUsers);
            } catch (error) {
                console.error('Error loading admin data:', error);
            } finally {
                setLoading(false);
            }
        };
        loadInitialData();
    }, []);

    const handleUpdateDate = async () => {
        try {
            setIsUpdatingDate(true);
            await updateGulfStartDate(gulfStartDate);
            alert('Ramadan start date updated successfully!');
        } catch (error) {
            alert('Error updating date');
        } finally {
            setIsUpdatingDate(false);
        }
    };

    const handleAddGroup = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newGroupName.trim()) return;
        try {
            await addWhatsAppGroup(newGroupName.trim());
            setNewGroupName('');
            const updatedGroups = await getWhatsAppGroups();
            setGroups(updatedGroups);
        } catch (error) {
            alert('குழுவைச் சேர்ப்பதில் பிழை ஏற்பட்டது');
        }
    };

    const handleDeleteGroup = async (id: string) => {
        if (!confirm('இந்த குழுவை நீக்க விரும்புகிறீர்களா?')) return;
        try {
            await deleteWhatsAppGroup(id);
            const updatedGroups = await getWhatsAppGroups();
            setGroups(updatedGroups);
        } catch (error) {
            alert('குழுவை நீக்குவதில் பிழை ஏற்பட்டது');
        }
    };

    const handleUpdateUserGroup = async (uid: string, newGroup: string) => {
        try {
            setIsUpdatingUser(uid);
            await updateUserProfile(uid, { whatsappGroup: newGroup });
            const updatedUsers = await getAllUserProfiles();
            setUsers(updatedUsers);
        } catch (error) {
            console.error('Error updating user group:', error);
            alert('பயனர் குழுவை புதுப்பிப்பதில் பிழை ஏற்பட்டது');
        } finally {
            setIsUpdatingUser(null);
        }
    };

    const filteredUsers = users.filter(user =>
        user.fullName?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
        user.whatsappGroup?.toLowerCase().includes(userSearchTerm.toLowerCase())
    );

    const filteredResults = selectedGroup
        ? results.filter(r => r.whatsappGroup === selectedGroup)
        : results;

    if (loading) return <div className="loading-container"><div className="spinner"></div></div>;

    return (
        <div className="admin-dashboard-container" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', color: 'var(--text-primary)' }}>
            <header style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <button onClick={() => navigate('/dashboard')} className="back-button" style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <ChevronLeft size={24} />
                    <span>முகப்புக்கு</span>
                </button>
                <h1 style={{ fontSize: '2rem' }}>நிர்வாக மையம் (Admin Dashboard)</h1>
            </header>

            <div className="admin-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
                {/* Column 1: Group Management */}
                <section className="admin-section" style={{ background: 'var(--surface)', padding: '1.5rem', borderRadius: '20px', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                        <Users size={24} style={{ color: 'var(--gold-accent)' }} />
                        <h2 style={{ fontSize: '1.25rem' }}>வாட்ஸ்அப் குழுக்கள்</h2>
                    </div>

                    <form onSubmit={handleAddGroup} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                        <input
                            type="text"
                            value={newGroupName}
                            onChange={(e) => setNewGroupName(e.target.value)}
                            placeholder="புதிய குழு பெயர்"
                            style={{ flex: 1, padding: '0.75rem', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--surface-light)', color: 'white' }}
                        />
                        <button type="submit" style={{ padding: '0.75rem', borderRadius: '12px', border: 'none', background: 'var(--primary-gradient)', color: 'white', cursor: 'pointer' }}>
                            <Plus size={24} />
                        </button>
                    </form>

                    <div className="groups-list" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {groups.map(group => (
                            <div key={group.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', background: 'var(--surface-light)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                                <span>{group.name}</span>
                                <button onClick={() => handleDeleteGroup(group.id)} style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer' }}>
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Column 2 (Mobile Shifted): Ramadan Configuration */}
                <section className="admin-section" style={{ background: 'var(--surface)', padding: '1.5rem', borderRadius: '20px', border: '1px solid var(--border)', marginTop: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                        <Settings size={24} style={{ color: 'var(--gold-accent)' }} />
                        <h2 style={{ fontSize: '1.25rem' }}>ரம்ஜான் உள்ளமைவு (Ramadan Config)</h2>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                வளைகுடா நாடுகளுக்கான ரமலான் தொடக்க தேதி (Gulf Start Date):
                            </label>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <input
                                    type="date"
                                    value={gulfStartDate}
                                    onChange={(e) => setGulfStartDate(e.target.value)}
                                    style={{ flex: 1, padding: '0.75rem', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--surface-light)', color: 'white' }}
                                />
                                <button
                                    onClick={handleUpdateDate}
                                    disabled={isUpdatingDate}
                                    style={{ padding: '0.75rem 1.5rem', borderRadius: '12px', border: 'none', background: 'var(--primary-gradient)', color: 'white', cursor: 'pointer', fontWeight: 'bold' }}
                                >
                                    {isUpdatingDate ? 'Updating...' : 'Save'}
                                </button>
                            </div>
                            <p style={{ marginTop: '0.8rem', fontSize: '0.85rem', color: 'var(--gold-accent)', opacity: 0.8 }}>
                                <Calendar size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                                மற்ற நாடுகள் இந்த தேதியிலிருந்து 1 நாள் தாமதமாகும்.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Column 2: Results & Attendees */}
                <section className="admin-section" style={{ background: 'var(--surface)', padding: '1.5rem', borderRadius: '20px', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <Trophy size={24} style={{ color: 'var(--gold-accent)' }} />
                            <h2 style={{ fontSize: '1.25rem', textAlign: 'left', lineHeight: '1.4' }}>
                                <div>தேர்வு முடிவுகள்</div>
                                {selectedGroup && (
                                    <div style={{ color: 'var(--gold-accent)', fontSize: '1.1rem', marginTop: '0.2rem' }}>
                                        {selectedGroup}
                                    </div>
                                )}
                            </h2>
                        </div>
                        <select
                            value={selectedGroup}
                            onChange={(e) => setSelectedGroup(e.target.value)}
                            style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface-light)', color: 'white' }}
                        >
                            <option value="">அனைத்து குழுக்களும்</option>
                            {groups.map(g => <option key={g.id} value={g.name}>{g.name}</option>)}
                        </select>
                    </div>

                    <div className="results-table" style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                                    <th style={{ padding: '1rem' }}>மின்னஞ்சல்</th>
                                    <th style={{ padding: '1rem' }}>நாள்</th>
                                    <th style={{ padding: '1rem' }}>மதிப்பெண்</th>
                                    <th style={{ padding: '1rem' }}>தேதி</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredResults.map((res, idx) => (
                                    <tr key={idx} style={{ borderBottom: '1px solid var(--border)', fontSize: '0.9rem' }}>
                                        <td style={{ padding: '1rem' }}>{res.userEmail}</td>
                                        <td style={{ padding: '1rem' }}>{res.dayNumber}</td>
                                        <td style={{ padding: '1rem' }}>{res.score}/{res.totalQuestions} ({res.percentage}%)</td>
                                        <td style={{ padding: '1rem' }}>{new Date(res.dateAttempted).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredResults.length === 0 && <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>முடிவுகள் எதுவும் இல்லை</p>}
                    </div>
                </section>

                {/* Column 3: User Management */}
                <section className="admin-section" style={{ background: 'var(--surface)', padding: '1.5rem', borderRadius: '20px', border: '1px solid var(--border)', gridColumn: 'span 2' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <Users size={24} style={{ color: 'var(--gold-accent)' }} />
                            <h2 style={{ fontSize: '1.25rem' }}>பயனர் நிர்வாகம் (User Management)</h2>
                        </div>
                        <div style={{ position: 'relative', width: '300px' }}>
                            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                            <input
                                type="text"
                                placeholder="தேட (பெயர்/மின்னஞ்சல்/குழு)..."
                                value={userSearchTerm}
                                onChange={(e) => setUserSearchTerm(e.target.value)}
                                style={{ width: '100%', padding: '0.6rem 0.6rem 0.6rem 2.5rem', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--surface-light)', color: 'white' }}
                            />
                        </div>
                    </div>

                    <div className="users-table" style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                                    <th style={{ padding: '1rem' }}>பெயர்</th>
                                    <th style={{ padding: '1rem' }}>மின்னஞ்சல்</th>
                                    <th style={{ padding: '1rem' }}>தற்போதைய குழு</th>
                                    <th style={{ padding: '1rem' }}>குழுவை மாற்ற</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((user) => (
                                    <tr key={user.uid} style={{ borderBottom: '1px solid var(--border)', fontSize: '0.9rem' }}>
                                        <td style={{ padding: '1rem' }}>{user.fullName}</td>
                                        <td style={{ padding: '1rem' }}>{user.email}</td>
                                        <td style={{ padding: '1rem' }}>
                                            <span style={{
                                                padding: '0.25rem 0.75rem',
                                                borderRadius: '20px',
                                                background: user.whatsappGroup ? 'rgba(255, 184, 0, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                                                color: user.whatsappGroup ? 'var(--gold-accent)' : 'var(--text-secondary)',
                                                fontSize: '0.8rem'
                                            }}>
                                                {user.whatsappGroup || 'குழு இல்லை'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <select
                                                    value={user.whatsappGroup || ''}
                                                    onChange={(e) => handleUpdateUserGroup(user.uid, e.target.value)}
                                                    disabled={isUpdatingUser === user.uid}
                                                    style={{
                                                        padding: '0.4rem',
                                                        borderRadius: '8px',
                                                        border: '1px solid var(--border)',
                                                        background: 'var(--surface-light)',
                                                        color: 'white',
                                                        fontSize: '0.85rem',
                                                        flex: 1
                                                    }}
                                                >
                                                    <option value="">தேர்ந்தெடுக்கவும்</option>
                                                    {groups.map(g => <option key={g.id} value={g.name}>{g.name}</option>)}
                                                </select>
                                                {isUpdatingUser === user.uid && (
                                                    <div className="spinner-small" style={{ width: '16px', height: '16px', borderWidth: '2px' }}></div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredUsers.length === 0 && (
                            <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                                பயனர்கள் யாரும் இல்லை
                            </p>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default AdminDashboard;
