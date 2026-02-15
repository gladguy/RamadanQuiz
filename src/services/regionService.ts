export type Region =
    | 'IN' | 'UAE' | 'SA' | 'QA' | 'KW' | 'OM' | 'BH'
    | 'US' | 'UK' | 'CA' | 'AU' | 'PK' | 'BD' | 'LK'
    | 'MY' | 'SG' | 'EG' | 'JO' | 'LB' | 'TR' | 'ID';

export interface RegionConfig {
    name: string;
    flag: string;
    isGulf: boolean;
}

export const REGION_CONFIGS: Record<Region, RegionConfig> = {
    'IN': { name: 'India', flag: '🇮🇳', isGulf: false },
    'UAE': { name: 'UAE', flag: '🇦🇪', isGulf: true },
    'SA': { name: 'Saudi Arabia', flag: '🇸🇦', isGulf: true },
    'QA': { name: 'Qatar', flag: '🇶🇦', isGulf: true },
    'KW': { name: 'Kuwait', flag: '🇰🇼', isGulf: true },
    'OM': { name: 'Oman', flag: '🇴🇲', isGulf: true },
    'BH': { name: 'Bahrain', flag: '🇧🇭', isGulf: true },
    'US': { name: 'USA', flag: '🇺🇸', isGulf: true }, // Assuming US follows Gulf/Mainstream? User said "Gulf countries" vs "Rest of the world". I'll treat non-Gulf as lagged.
    'UK': { name: 'UK', flag: '🇬🇧', isGulf: true },
    'CA': { name: 'Canada', flag: '🇨🇦', isGulf: true },
    'AU': { name: 'Australia', flag: '🇦🇺', isGulf: true },
    'PK': { name: 'Pakistan', flag: '🇵🇰', isGulf: false },
    'BD': { name: 'Bangladesh', flag: '🇧🇩', isGulf: false },
    'LK': { name: 'Sri Lanka', flag: '🇱🇰', isGulf: false },
    'MY': { name: 'Malaysia', flag: '🇲🇾', isGulf: false },
    'SG': { name: 'Singapore', flag: '🇸🇬', isGulf: false },
    'EG': { name: 'Egypt', flag: '🇪🇬', isGulf: true },
    'JO': { name: 'Jordan', flag: '🇯🇴', isGulf: true },
    'LB': { name: 'Lebanon', flag: '🇱🇧', isGulf: true },
    'TR': { name: 'Turkey', flag: '🇹🇷', isGulf: true },
    'ID': { name: 'Indonesia', flag: '🇮🇩', isGulf: false },
};

/**
 * Calculate regional start date based on global Gulf start date.
 * Non-Gulf countries lag by one day.
 */
export const getRegionalStartDate = (baseGulfDate: string, region: Region): string => {
    const config = REGION_CONFIGS[region];
    if (!config) return baseGulfDate;
    if (config.isGulf) return baseGulfDate;

    // Add 1 day lag
    const date = new Date(baseGulfDate);
    date.setDate(date.getDate() + 1);
    return date.toISOString().split('T')[0];
};

const REGION_STORAGE_KEY = 'user_ramadan_region';

export const getUserRegion = (): Region | null => {
    const saved = localStorage.getItem(REGION_STORAGE_KEY) as Region;
    if (saved && REGION_CONFIGS[saved]) {
        return saved;
    }
    return null;
};

export const setUserRegion = (region: Region): void => {
    localStorage.setItem(REGION_STORAGE_KEY, region);
};
