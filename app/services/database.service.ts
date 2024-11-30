import { Sqlite } from '@nativescript/sqlite';

export class DatabaseService {
    private database: Sqlite;

    async init() {
        this.database = await new Sqlite('nirvana.db');
        await this.createTables();
    }

    private async createTables() {
        await this.database.execSQL(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL,
                name TEXT,
                age INTEGER,
                birthDate TEXT,
                relationshipStatus TEXT,
                occupation TEXT,
                hobbies TEXT,
                sleepTime TEXT,
                wakeTime TEXT
            )
        `);

        await this.database.execSQL(`
            CREATE TABLE IF NOT EXISTS mood_entries (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                userId INTEGER,
                date TEXT,
                moodLevel INTEGER,
                weather INTEGER,
                wentOutside INTEGER,
                exercised INTEGER,
                socialInteraction INTEGER,
                stressLevel INTEGER,
                notes TEXT,
                FOREIGN KEY(userId) REFERENCES users(id)
            )
        `);
    }

    async createUser(userData) {
        const query = `
            INSERT INTO users (username, password, name, age, birthDate, relationshipStatus, occupation, hobbies)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        return await this.database.execSQL(query, [
            userData.username,
            userData.password,
            userData.name,
            userData.age,
            userData.birthDate.toISOString(),
            userData.relationshipStatus,
            userData.occupation,
            userData.hobbies
        ]);
    }

    async getUserByUsername(username: string) {
        const query = 'SELECT * FROM users WHERE username = ?';
        const result = await this.database.get(query, [username]);
        return result;
    }

    async getMoodHistory(userId: number, days: number = 7) {
        const query = `
            SELECT * FROM mood_entries 
            WHERE userId = ? 
            ORDER BY date DESC 
            LIMIT ?
        `;
        return await this.database.all(query, [userId, days]);
    }
}