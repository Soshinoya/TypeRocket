import { pool } from '../app.js'

const userService = {
	login: async email => {
		const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [email])
		console.log('login result: ', result)
		if (result.rowCount === 1) {
			return result.rows[0]
		}
		return null
	},
	getUserById: async id => {
		const result = await pool.query(`SELECT id FROM users WHERE id = $1`, [id])
		console.log('getUserById result: ', result)
		if (result.rowCount === 1) {
			return result.rows[0]
		}
		return null
	},
	isUserEmailExists: async email => {
		const result = await pool.query(`SELECT id FROM users WHERE email = $1`, [email])
		console.log('isUserEmailExists result: ', result)
		if (result.rowCount === 1) {
			return true
		}
		return false
	},
	isUserNameExists: async username => {
		const result = await pool.query(`SELECT id FROM users WHERE username = $1`, [username])
		console.log('isUserNameExists result: ', result)
		if (result.rowCount === 1) {
			return true
		}
		return false
	},
	register: async user => {
		const { username, email, password } = user

		const result1 = await pool.query(
			`
            INSERT INTO users (username, email, password, description)
            VALUES ($1, $2, $3, 'Hey there! I am using TypeRocket')
            RETURNING *;
            `,
			[username, email, password]
		)

		// Создаем строку в таблицах experience
		const result2 = await pool.query(
			`
            INSERT INTO experience (user_id, level, progress)
            VALUES ($1, 0, 0);
            `,
			[result1.rows[0].id]
		)

		// Создаем строку в таблицах user_metrics
		const result3 = await pool.query(
			`
            INSERT INTO user_metrics (user_id)
            VALUES ($1);
            `,
			[result1.rows[0].id]
		)

		// Добавить обработчик ошибки, если не получится создать строку в experience

		return result1.rows[0]
	},
	deleteUser: async userId => {
		const result = await pool.query(
			`
            BEGIN; -- Начало транзакции

            -- 1. Находим все result_id для пользователя
            WITH user_results AS (
                SELECT result_id FROM best_results WHERE user_id = $1
            )

            -- 2. Удаляем метрики результатов
            DELETE FROM result_metrics
            WHERE id IN (SELECT result_id FROM user_results);

            -- 3. Удаляем связи в best_results
            DELETE FROM best_results WHERE user_id = $1;

            -- 4. Удаляем связи в experience
            DELETE FROM experience WHERE user_id = $1;

            -- 5. Удаляем связи в user_activity
            DELETE FROM user_activity WHERE user_id = $1;

            -- 6. Удаляем связи в user_achievements
            DELETE FROM user_achievements WHERE user_id = $1;

            -- 7. Удаляем сам аккаунт
            DELETE FROM users WHERE id = $1;

            COMMIT; -- Подтверждаем транзакцию
            `,
			[userId]
		)
		console.log('result: ', result)

		return result.rows
	},
}

export { userService }
