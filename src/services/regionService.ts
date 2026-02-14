export type Region =
    | 'IN' | 'UAE' | 'SA' | 'QA' | 'KW' | 'OM' | 'BH'
    | 'US' | 'UK' | 'CA' | 'AU' | 'PK' | 'BD' | 'LK'
    | 'MY' | 'SG' | 'EG' | 'JO' | 'LB' | 'TR' | 'ID';

export interface RegionConfig {
    name: string;
    flag: string;
    startDate: string; // YYYY-MM-DD
}

export const REGION_CONFIGS: Record<Region, RegionConfig> = {
    'IN': { name: 'India', flag: '🇮🇳', startDate: '2026-02-19' },
    'UAE': { name: 'UAE', flag: '🇦🇪', startDate: '2026-02-18' },
    'SA': { name: 'Saudi Arabia', flag: '🇸🇦', startDate: '2026-02-18' },
    'QA': { name: 'Qatar', flag: '🇶🇦', startDate: '2026-02-18' },
    'KW': { name: 'Kuwait', flag: '🇰🇼', startDate: '2026-02-18' },
    'OM': { name: 'Oman', flag: '🇴🇲', startDate: '2026-02-18' },
    'BH': { name: 'Bahrain', flag: '🇧🇭', startDate: '2026-02-18' },
    'US': { name: 'USA', flag: '🇺🇸', startDate: '2026-02-18' },
    'UK': { name: 'UK', flag: '🇬🇧', startDate: '2026-02-18' },
    'CA': { name: 'Canada', flag: '🇨🇦', startDate: '2026-02-18' },
    'AU': { name: 'Australia', flag: '🇦🇺', startDate: '2026-02-18' },
    'PK': { name: 'Pakistan', flag: '🇵🇰', startDate: '2026-02-19' },
    'BD': { name: 'Bangladesh', flag: '🇧🇩', startDate: '2026-02-19' },
    'LK': { name: 'Sri Lanka', flag: '🇱🇰', startDate: '2026-02-19' },
    'MY': { name: 'Malaysia', flag: '🇲🇾', startDate: '2026-02-19' },
    'SG': { name: 'Singapore', flag: '🇸🇬', startDate: '2026-02-19' },
    'EG': { name: 'Egypt', flag: '🇪🇬', startDate: '2026-02-18' },
    'JO': { name: 'Jordan', flag: '🇯🇴', startDate: '2026-02-18' },
    'LB': { name: 'Lebanon', flag: '🇱🇧', startDate: '2026-02-18' },
    'TR': { name: 'Turkey', flag: '🇹🇷', startDate: '2026-02-18' },
    'ID': { name: 'Indonesia', flag: '🇮🇩', startDate: '2026-02-19' },
};

const REGION_STORAGE_KEY = 'user_ramadan_region';

export const getUserRegion = (): Region => {
    const saved = localStorage.getItem(REGION_STORAGE_KEY) as Region;
    if (saved && REGION_CONFIGS[saved]) {
        return saved;
    }
    // Default to India as requested
    return 'IN';
};

export const setUserRegion = (region: Region): void => {
    localStorage.setItem(REGION_STORAGE_KEY, region);
};
