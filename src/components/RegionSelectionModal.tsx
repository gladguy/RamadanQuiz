import { useState } from 'react';
import { REGION_CONFIGS, Region } from '../services/regionService';
import { useLanguage } from '../contexts/LanguageContext';
import { Globe, Check } from 'lucide-react';

interface RegionSelectionModalProps {
    onSelect: (region: Region) => void;
}

const RegionSelectionModal = ({ onSelect }: RegionSelectionModalProps) => {
    const { t } = useLanguage();

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
                    சரியான நேரத்தைக் கணக்கிட உங்கள் நாட்டைத் தேர்ந்தெடுக்கவும்.<br />
                    (Please select your country for accurate date calculation.)
                </p>

                <div className="regions-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                    gap: '1rem',
                    maxHeight: '400px',
                    overflowY: 'auto',
                    padding: '0.5rem',
                    marginBottom: '1rem',
                    textAlign: 'left'
                }}>
                    {Object.entries(REGION_CONFIGS).map(([key, config]) => (
                        <button
                            key={key}
                            onClick={() => onSelect(key as Region)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                padding: '0.8rem 1rem',
                                background: 'var(--surface-light)',
                                border: '1px solid var(--border)',
                                borderRadius: '16px',
                                color: 'var(--text-primary)',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                fontSize: '1rem'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.border = '1px solid var(--gold-accent)';
                                e.currentTarget.style.background = 'rgba(238, 198, 95, 0.05)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.border = '1px solid var(--border)';
                                e.currentTarget.style.background = 'var(--surface-light)';
                            }}
                        >
                            <span style={{ fontSize: '1.4rem' }}>{config.flag}</span>
                            <span style={{ flex: 1 }}>{config.name}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RegionSelectionModal;
