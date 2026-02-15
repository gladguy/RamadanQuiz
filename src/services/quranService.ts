export interface AyahData {
    text: string;
    arabicText: string;
    audio: string;
    numberInSurah: number;
    surahName: string;
}

export const fetchAyahForMulk = async (day: number): Promise<AyahData> => {
    try {
        const verseKey = `67:${day}`;

        // Fetch text (Uthmani)
        const textResponse = await fetch(`https://api.quran.com/api/v4/quran/verses/uthmani?verse_key=${verseKey}`);
        const textData = await textResponse.json();

        // Fetch translation (Tamil - ID 133)
        const transResponse = await fetch(`https://api.quran.com/api/v4/quran/translations/133?verse_key=${verseKey}`);
        const transData = await transResponse.json();

        // Fetch audio (Alafasy - ID 7)
        const audioResponse = await fetch(`https://api.quran.com/api/v4/recitations/7/by_ayah/${verseKey}`);
        const audioData = await audioResponse.json();

        if (textData.verses?.[0] && transData.translations?.[0] && audioData.audio_files?.[0]) {
            return {
                text: transData.translations[0].text,
                arabicText: textData.verses[0].text_uthmani,
                audio: `https://verses.quran.com/${audioData.audio_files[0].url}`,
                numberInSurah: day,
                surahName: 'Al-Mulk'
            };
        } else {
            throw new Error('Failed to fetch Ayah data from Quran.com');
        }
    } catch (error) {
        console.error('Error fetching Ayah:', error);
        throw error;
    }
};
