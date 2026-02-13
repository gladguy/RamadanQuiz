// Ramadan 2026 - Adjusted to start TODAY (Feb 13)
const RAMADAN_START_DATE = new Date('2026-02-13');
const RAMADAN_DAYS = 30;

// Toggle: set to true to unlock all 30 days, false to release days per Ramadan calendar
export const UNLOCK_ALL_DAYS = true;

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

export const isDayUnlocked = (dayNumber: number): boolean => {
    if (UNLOCK_ALL_DAYS) return true;
    const currentDay = getRamadanDay();
    // A day is unlocked if it's the current day or a past day
    return dayNumber <= currentDay;
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
