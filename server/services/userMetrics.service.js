import { pool } from '../app.js'

import { convertDateToSameFormatWithServer } from '../utils/utils.js'

const userMetricsService = {
	getMetrics: async id => {
		const result = await pool.query(`SELECT * FROM user_metrics WHERE user_id = $1`, [id])
		if (result.rowCount === 1) {
			result.rows[0].last_activity_date = convertDateToSameFormatWithServer(result.rows[0].last_activity_date)
			return result.rows[0]
		}
		return null
	},
	updateKeystrokes: async (id, keystrokes) => {
		const result = await pool.query(
			`
            UPDATE user_metrics
            SET keystrokes = keystrokes + $2
            WHERE user_id = $1
            RETURNING *;
            `,
			[id, keystrokes]
		)

		if (result.rowCount === 1) {
			result.rows[0].last_activity_date = convertDateToSameFormatWithServer(result.rows[0].last_activity_date)
			return result.rows[0]
		}
		return null
	},
	updateStreak: async (id, streak, last_activity_date) => {
		const result = await pool.query(
			`
            UPDATE user_metrics
            SET streak = $2, last_activity_date = $3
            WHERE user_id = $1
            RETURNING *;
            `,
			[id, streak, last_activity_date]
		)
		if (result.rowCount === 1) {
			result.rows[0].last_activity_date = convertDateToSameFormatWithServer(result.rows[0].last_activity_date)
			return result.rows[0]
		}
		return null
	},
}

export { userMetricsService }
