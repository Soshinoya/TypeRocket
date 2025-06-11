import { pool } from '../app.js'

// Проверка существования пользователя
const checkUserExists = async (email, res) => {
	const userExists = await pool.query('SELECT id FROM users WHERE email = $1', [email])
	if (userExists.rows.length) {
		return res.status(404).json({ error: 'The user with this email or username already exists' })
	}
}

const userService = {
	createUser: async (user, res) => {
		const { username, email, password, description, currentTheme } = user

		await checkUserExists(email, res)

		const result1 = await pool.query(
			`
            INSERT INTO users (username, email, password, description, currentTheme)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id;
            `,
			[username, email, password, description, currentTheme]
		)
		console.log('result1: ', result1)

		// Создаем строку в таблицах experience
		const result2 = await pool.query(
			`
            INSERT INTO experience (user_id, level, progress)
            VALUES ($1, 0, 0);
            `,
			[result1.rows[0]]
		)
		// Добавить обработчик ошибки, если не получится создать строку в experience
		console.log('result2: ', result2)

		return result1.rows
	},
	deleteUser: async (user, res) => {
		const { userId, email } = user

		await checkUserExists(email, res)

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
