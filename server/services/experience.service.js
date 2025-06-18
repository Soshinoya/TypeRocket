import { pool } from '../app.js'

const experienceService = {
	getExperience: async userId => {
		const result = await pool.query(`SELECT level, progress FROM experience WHERE user_id = $1`, [userId])
		console.log('result: ', result)
		if (result.rowCount === 1) {
			return result.rows[0]
		}
		return null
	},
	addExperience: async (userId, level, progress) => {
		const result = await pool.query(
			`
            INSERT INTO experience (user_id, level, progress)
            VALUES ($1, $2, $3)
            ON CONFLICT (user_id) 
            DO UPDATE SET 
                level = EXCLUDED.level,
                progress = EXCLUDED.progress
            RETURNING *;
            `,
			[userId, level, progress]
		)
		console.log('result: ', result)
		return result.rows[0]
	},
}

export { experienceService }
