// Ramadan 2026 - Adjusted for testing (Day 1 unlocked)
const RAMADAN_START_DATE = new Date('2026-02-12');
const RAMADAN_DAYS = 30;

export const getRamadanDay = (): number => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const ramadanStart = new Date(RAMADAN_START_DATE);
    ramadanStart.setHours(0, 0, 0, 0);

    // Check if we're before Ramadan starts
    if (today < ramadanStart) {
        return 0;
    }

    // Calculate the difference in days
    const diffTime = today.getTime() - ramadanStart.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    // Return the current day (1-30) or 30 if past Ramadan
    return Math.min(diffDays + 1, RAMADAN_DAYS);
};

export const isDayUnlocked = (_dayNumber: number): boolean => {
    // Return true for all days as requested to enable 30-day view
    return true;
};

export const getRamadanInfo = () => {
    const currentDay = getRamadanDay();
    const today = new Date();
    const ramadanStart = new Date(RAMADAN_START_DATE);

    return {
        currentDay,
        isRamadan: currentDay > 0 && currentDay <= RAMADAN_DAYS,
        daysUntilStart: currentDay === 0 ? Math.ceil((ramadanStart.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)) : 0,
        daysRemaining: currentDay > 0 ? Math.max(0, RAMADAN_DAYS - currentDay) : RAMADAN_DAYS
    };
};
