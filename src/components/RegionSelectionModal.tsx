import { useState } from 'react';
import { REGION_CONFIGS, Region } from '../services/regionService';
import { useLanguage } from '../contexts/LanguageContext';
import { Globe, Check } from 'lucide-react';

interface RegionSelectionModalProps {
    onSelect: (region: Region) => void;
}

const RegionSelectionModal = ({ onSelect }: RegionSelectionModalProps) => {
    const { t } = useLanguage();
    const [selectedRegion, setSelectedRegion] = useState<Region | ''>('');

    const handleSave = () => {
        if (selectedRegion) {
            onSelect(selectedRegion as Region);
        }
    };

    return (
        <div className="group-selection-overlay" style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1100,
            backdropFilter: 'blur(10px)'
        }}>
            <div className="group-selection-card" style={{
                background: 'var(--surface)',
                padding: '2.5rem',
                borderRadius: '32px',
                width: '90%',
                maxWidth: '500px',
                border: '1px solid var(--gold-accent)',
                boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
                textAlign: 'center'
            }}>
                <div style={{
                    width: '72px',
                    height: '72px',
                    background: 'var(--primary-gradient)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem',
                    color: 'white',
                    boxShadow: '0 0 20px rgba(238, 198, 95, 0.3)'
                }}>
                    <Globe size={40} />
                </div>

                <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
                    நாட்டைத் தேர்ந்தெடுக்கவும்
                </h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1.1rem', lineHeight: '1.5' }}>
                    சரியான நேரத்தைக் கணக்கிட உங்கள் நாட்டைத் தேர்ந்தெடுக்கவும். இதை ஒருமுறை மட்டுமே செய்ய முடியும்.<br />
                    (Please select your country for accurate date calculation. This can only be set once.)
                </p>

                <div className="regions-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                    gap: '1rem',
                    maxHeight: '350px',
                    overflowY: 'auto',
                    padding: '0.5rem',
                    marginBottom: '2rem',
                    textAlign: 'left'
                }}>
                    {Object.entries(REGION_CONFIGS).map(([key, config]) => (
                        <button
                            key={key}
                            onClick={() => setSelectedRegion(key as Region)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                padding: '0.8rem 1rem',
                                background: selectedRegion === key ? 'rgba(238, 198, 95, 0.15)' : 'var(--surface-light)',
                                border: selectedRegion === key ? '2px solid var(--gold-accent)' : '1px solid var(--border)',
                                borderRadius: '16px',
                                color: 'var(--text-primary)',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                fontSize: '1rem'
                            }}
                        >
                            <span style={{ fontSize: '1.4rem' }}>{config.flag}</span>
                            <span style={{ flex: 1 }}>{config.name}</span>
                            {selectedRegion === key && <Check size={18} style={{ color: 'var(--gold-accent)' }} />}
                        </button>
                    ))}
                </div>

                <button
                    onClick={handleSave}
                    disabled={!selectedRegion}
                    style={{
                        width: '100%',
                        padding: '1.2rem',
                        borderRadius: '16px',
                        border: 'none',
                        background: selectedRegion ? 'var(--primary-gradient)' : 'var(--border)',
                        color: selectedRegion ? 'white' : 'var(--text-secondary)',
                        cursor: selectedRegion ? 'pointer' : 'not-allowed',
                        fontWeight: 'bold',
                        fontSize: '1.1rem',
                        boxShadow: selectedRegion ? '0 10px 20px rgba(238, 198, 95, 0.2)' : 'none',
                        transition: 'all 0.3s'
                    }}
                >
                    உறுதிப்படுத்து (Confirm)
                </button>
            </div>
        </div>
    );
};

export default RegionSelectionModal;
