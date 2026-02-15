import { useState, useEffect } from 'react';
import { getWhatsAppGroups, WhatsAppGroup } from '../services/whatsappGroupsService';
import { Users, Check } from 'lucide-react';

interface GroupSelectionModalProps {
    onSelect: (groupName: string) => void;
    currentGroup?: string;
}

const GroupSelectionModal = ({ onSelect, currentGroup }: GroupSelectionModalProps) => {
    const [groups, setGroups] = useState<WhatsAppGroup[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadGroups = async () => {
            try {
                const fetchedGroups = await getWhatsAppGroups();
                setGroups(fetchedGroups);
            } catch (err) {
                setError('குழுக்களை ஏற்றுவதில் பிழை ஏற்பட்டது');
            } finally {
                setLoading(false);
            }
        };
        loadGroups();
    }, []);

    const handleSelect = (name: string) => {
        onSelect(name);
    };

    return (
        <div className="group-selection-overlay" style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(8px)'
        }}>
            <div className="group-selection-card" style={{
                background: 'var(--surface)',
                padding: '2rem',
                borderRadius: '24px',
                width: '90%',
                maxWidth: '450px',
                border: '1px solid var(--border)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                textAlign: 'center'
            }}>
                <div style={{
                    width: '64px',
                    height: '64px',
                    background: 'var(--primary-gradient)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem',
                    color: 'white'
                }}>
                    <Users size={32} />
                </div>

                <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                    உங்கள் வாட்ஸ்அப் குழுவை தேர்ந்தெடுக்கவும்
                </h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1rem' }}>
                    வினாடி வினாவைத் தொடர நீங்கள் எந்த குழுவைச் சேர்ந்தவர் என்பதை உறுதிப்படுத்தவும்
                </p>

                {loading ? (
                    <div className="spinner" style={{ margin: '2rem auto' }}></div>
                ) : error ? (
                    <p style={{ color: 'var(--error)' }}>{error}</p>
                ) : (
                    <div className="groups-list" style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem',
                        maxHeight: '300px',
                        overflowY: 'auto',
                        padding: '0.5rem'
                    }}>
                        {groups.map((group) => (
                            <button
                                key={group.id}
                                onClick={() => handleSelect(group.name)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '1rem 1.5rem',
                                    background: group.name === currentGroup ? 'rgba(238, 198, 95, 0.1)' : 'var(--surface-light)',
                                    border: group.name === currentGroup ? '2px solid var(--gold-accent)' : '1px solid var(--border)',
                                    borderRadius: '16px',
                                    color: 'var(--text-primary)',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    fontSize: '1.1rem',
                                    textAlign: 'left'
                                }}
                            >
                                <span>{group.name}</span>
                                {group.name === currentGroup && <Check size={20} style={{ color: 'var(--gold-accent)' }} />}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default GroupSelectionModal;
