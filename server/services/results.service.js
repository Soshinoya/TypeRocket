import { pool } from '../app.js'

const resultsService = {
	getBestResult: async (userId, testName) => {
		const result = await pool.query(
			`
            SELECT result.*
            FROM best_results
            JOIN result_metrics result ON best_results.result_id = result.id
            WHERE
                best_results.user_id = $1
                AND best_results.test_name_id = (SELECT id FROM test_names WHERE name = '$2');
            `,
			[userId, testName]
		)
		console.log('results: ', result)
		return result.rows
	},
	getAllBestResults: async userId => {
		const results = await pool.query(
			`
            SELECT
                t.name,
                r.wpm,
                r.rawWpm,
                r.accuracy,
                r.consistency,
                r.date
            FROM
                best_results
            JOIN test_names ON best_results.test_name_id = test_names.id
            JOIN result_metrics ON best_results.result_id = result_metrics.id
            WHERE
                best_results.user_id = $1;
            `,
			[userId]
		)
		console.log('results: ', results)
		return results.rows
	},
	setBestResult: async (userId, testName, resultMetrics) => {
		const { wpm, rawWpm, accuracy, consistency, date } = resultMetrics

		// 1. Удаляем старую запись (если есть)
		const result1 = await pool.query(
			`
            DELETE FROM result_metrics
            WHERE id IN (
                SELECT result_id 
                FROM best_results 
                WHERE user_id = $1 
                AND test_name_id = (SELECT id FROM test_names WHERE name = '$2')
            );
            `,
			[userId, testName]
		)
		console.log('result1: ', result1)

		// 2. Вставляем новые метрики
		const result2 = await pool.query(
			`
            INSERT INTO result_metrics (wpm, rawWpm, accuracy, consistency, date)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id;
            `,
			[wpm, rawWpm, accuracy, consistency, date]
		)
		console.log('result2: ', result2)

		// 3. Обновляем best_results
		const result3 = await pool.query(
			`
            INSERT INTO best_results (user_id, test_name_id, result_id)
            VALUES (
                $1,
                (SELECT id FROM test_names WHERE name = '$2'),
                (SELECT id FROM result_metrics ORDER BY id DESC LIMIT 1)
            )
            ON CONFLICT (user_id, test_name_id)
            DO UPDATE SET result_id = EXCLUDED.result_id;
            `,
			[userId, testName]
		)
		console.log('result3: ', result3)

		return result3
	},
}

export { resultsService }
