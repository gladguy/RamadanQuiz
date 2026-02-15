import { useLanguage } from '../contexts/LanguageContext';
import { Globe } from 'lucide-react';

const LanguageToggle = () => {
    const { language, setLanguage } = useLanguage();

    return (
        <div className="language-selector" style={{
            display: 'flex',
            alignItems: 'center',
            background: 'var(--surface-light)',
            padding: '0.4rem 0.6rem',
            borderRadius: '20px',
            border: '1px solid var(--border)',
            gap: '0.5rem'
        }}>
            <Globe size={18} style={{ color: 'var(--gold-accent)' }} />
            <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as 'en' | 'ta')}
                style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                    outline: 'none',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                    appearance: 'none',
                    paddingRight: '1rem'
                }}
            >
                <option value="ta" style={{ background: 'var(--surface)', color: 'white' }}>தமிழ்</option>
                <option value="en" style={{ background: 'var(--surface)', color: 'white' }}>English</option>
            </select>
            <div style={{ pointerEvents: 'none', marginLeft: '-1.4rem', color: 'var(--gold-accent)', fontSize: '0.7rem' }}>▼</div>
        </div>
    );
};

export default LanguageToggle;
