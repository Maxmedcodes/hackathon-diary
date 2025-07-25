const db = require('../db/connect');

class DiaryModel {
    constructor({ id, title, content, date, category, created_at }) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.category = category;
        this.createdAt = new Date(created_at).toISOString();
        
    }

    static async getAllDiaries() {
        const response = await db.query('SELECT * FROM diaryentries ORDER BY created_at DESC');
        
        if (response.rows.length === 0) {
            throw new Error("No diaries available.");
        }

        return response.rows.map(row => new DiaryModel(row));
    }

    static async createDiary({ title, content, category }) {
        const response = await db.query(
            'INSERT INTO diaryentries (title, content, category) VALUES ($1, $2, $3) RETURNING *',
            [title, content, category]
        );

        if (response.rows.length === 0) {
            throw new Error("Failed to create diary entry.");
        }

        return new DiaryModel(response.rows[0]);
    }

    static async getEntryById(id) {
        const response = await db.query("SELECT * FROM diaryentries WHERE id = $1;", [id]);

        if (response.rows.length != 1) {
            throw new Error("Unable to locate diary entry.")
        }

        return new DiaryModel(response.rows[0]);
    }

    async update(data) {
        const response = await db.query("UPDATE diaryentries SET content = $1 WHERE id = $2 RETURNING id, title, content, category, created_at;",
        [data.content, this.id]);

        if (response.rows.length != 1) {
        throw new Error("Unable to update content.")
        }

        return new DiaryModel(response.rows[0]);
    }

    static async getEntriesByDate(date) {
        const response = await db.query(
            'SELECT * FROM diaryentries WHERE DATE(created_at) = $1 ORDER BY created_at DESC',
            [date]
        );
        
        if (response.rows.length === 0) {
            throw new Error(`No diary entries found for date: ${date}`);
        }
        
        return response.rows.map(row => new DiaryModel(row));
    }

    static async getEntriesByCategory(category) {
        const response = await db.query(
            'SELECT * FROM diaryentries WHERE LOWER(category) = LOWER($1) ORDER BY created_at DESC',
            [category]
        );
        
        if (response.rows.length === 0) {
            throw new Error(`No diary entries found for category: ${category}`);
        }
        
        return response.rows.map(row => new DiaryModel(row));
    }

    async destroy() {
        const response = await db.query('DELETE FROM diaryentries WHERE id = $1 RETURNING *;', [this.id]);

        if (response.rows.length != 1) {
            throw new Error("Unable to delete diary entry.")
        }

        return new DiaryModel(response.rows[0]);
    }
    }



module.exports = DiaryModel;