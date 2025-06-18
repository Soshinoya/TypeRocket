import { pool } from '../app.js'

const experienceService = {
	getExperience: async userId => {
		const result = await pool.query(`SELECT level, progress FROM experience WHERE user_id = $1`, [userId])
		console.log('getExperience result: ', result)
		if (result.rowCount === 1) {
			return result.rows[0]
		}
		return null
	},
	addExperience: async (userId, level, progress) => {
		const checkResult = await pool.query('SELECT * FROM experience WHERE user_id = $1', [userId])

		if (checkResult.rows.length === 0) {
			return res.status(404).json({ error: 'Запись не найдена' })
		}

		// Обновляем данные
		const updateQuery = `
		UPDATE experience
		SET level = $1, progress = $2
		WHERE user_id = $3
		RETURNING *;
		`

		const result = await pool.query(updateQuery, [level, progress, userId])
		console.log('addExperience result: ', result)
		if (result.rowCount === 1) {
			return result.rows[0]
		}
		return null
	},
}

export { experienceService }
