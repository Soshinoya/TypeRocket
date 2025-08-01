import { pool } from '../app.js'

const achievementService = {
	// Выборка всех достижений
	getAchievements: async () => {
		const result = await pool.query(`SELECT * FROM achievements`)
		console.log('getAchievements result: ', result)
		return result.rows
	},

	// Выборка всех полученных достижений
	getCompletedAchievements: async userId => {
		const result = await pool.query(
			`
            SELECT 
                ua.achievement_id,
                ua.completion_date,
                a.title,
                a.description
            FROM user_achievements ua
            LEFT JOIN achievements a 
                ON ua.achievement_id = a.id
            WHERE ua.user_id = $1
            `,
			[userId]
		)
		console.log('getCompletedAchievements result: ', result)
		return result.rows
	},

	// Добавление полученного достижения
	addCompletedAchievement: async (userId, achievementId) => {
		const result = await pool.query(
			`
            INSERT INTO
                user_achievements (user_id, achievement_id)
            VALUES ($1, $2)
			RETURNING *;
            `,
			[userId, achievementId]
		)
		console.log('addCompletedAchievement result: ', result)
		return result.rows[0]
	},
}

export { achievementService }
