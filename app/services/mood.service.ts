import { DatabaseService } from './database.service';
import { format, subDays } from 'date-fns';

export class MoodService {
    private database: DatabaseService;

    constructor() {
        this.database = new DatabaseService();
    }

    async recordMood(userId: number, moodLevel: number) {
        const query = `
            INSERT INTO mood_entries (userId, date, moodLevel)
            VALUES (?, ?, ?)
        `;
        const date = format(new Date(), 'yyyy-MM-dd');
        await this.database.database.execSQL(query, [userId, date, moodLevel]);
    }

    async getWeeklyMood(userId: number) {
        const dates = Array.from({ length: 7 }, (_, i) => 
            format(subDays(new Date(), i), 'yyyy-MM-dd')
        );

        const query = `
            SELECT date, moodLevel 
            FROM mood_entries 
            WHERE userId = ? AND date IN (${dates.map(() => '?').join(',')})
            ORDER BY date DESC
        `;

        const results = await this.database.database.all(query, [userId, ...dates]);
        return this.processWeeklyMood(results, dates);
    }

    private processWeeklyMood(results: any[], dates: string[]) {
        return dates.map(date => {
            const entry = results.find(r => r.date === date);
            return {
                day: format(new Date(date), 'EEE'),
                moodLevel: entry ? entry.moodLevel : null,
                moodIcon: entry ? `~/assets/mood-${entry.moodLevel}.png` : '~/assets/mood-none.png'
            };
        });
    }
}