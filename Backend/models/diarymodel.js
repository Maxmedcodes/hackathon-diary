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

}

module.exports = DiaryModel;