export function calculateNextReviewDate(masteryLevel: number): string {
    const now = new Date();
    const intervals = [1, 3, 7, 14, 30]; 

    if (masteryLevel < 1 || masteryLevel > intervals.length) {
        // For new words or mastered words, review in 1 day
        now.setDate(now.getDate() + 1);
        return now.toISOString();
    }

    const interval = intervals[masteryLevel - 1];
    now.setDate(now.getDate() + interval);
    return now.toISOString();
}
