import { pool } from '../app.js'

const activityService = {
	getActivity: async userId => {
		const year = new Date().getFullYear()

		const { rows } = await pool.query(
			`SELECT date::text, count 
			FROM user_activity 
			WHERE user_id = $1 
			AND date >= $2 AND date <= $3`,
			[userId, `${year}-01-01`, `${year}-12-31`]
		)
		return rows
	},
	setActivity: async userId => {
		const result = await pool.query(
			`
        WITH 
		updated AS (
			UPDATE user_activity 
			SET count = count + 1 
			WHERE user_id = $1 AND date = CURRENT_DATE
			RETURNING user_id, count, to_char(date, 'YYYY-MM-DD') AS date
		),
		inserted AS (
			INSERT INTO user_activity (user_id, count, date)
			SELECT $1, 1, CURRENT_DATE
			WHERE NOT EXISTS (SELECT 1 FROM updated)
			RETURNING user_id, count, to_char(date, 'YYYY-MM-DD') AS date
		)
		SELECT * FROM updated UNION ALL SELECT * FROM inserted;
        `,
			[userId]
		)

		console.log('setActivity result: ', result)
		return result.rows[0] || null
	},
}

export { activityService }
