import { pool } from '../app.js'

const activityService = {
	getActivity: async (userId, from, to) => {
		const result = await pool.query(
			`
            SELECT activity_date, count, level
            FROM user_activity
            WHERE 
                user_id = $1 AND
                activity_date BETWEEN $2 AND $3;
            `,
			[userId, from, to]
		)
		console.log('result: ', result)
		return result.rows[0]
	},
	setActivity: async userId => {
		const result = await pool.query(
			`
            INSERT INTO user_activity (user_id, count)
            VALUES ($1, 1)
            ON CONFLICT (user_id, date) -- конфликт по PRIMARY KEY
            DO UPDATE SET count = user_activity.count + 1;
            `,
			[userId]
		)
		console.log('result: ', result)
		return result.rows[0]
	},
}

export { activityService }
