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
		const { wpm, rawWpm, accuracy, consistency } = resultMetrics

		// 1. Вставляем метрики
		const result = await pool.query(
			`
            INSERT INTO result_metrics (wpm, rawWpm, accuracy, consistency)
            VALUES ($1, $2, $3, $4)
            RETURNING id;
        `,
			[wpm, rawWpm, accuracy, consistency]
		)
		const resultId = result.rows[0].id

		// 2. Обновляем/вставляем лучший результат
		await pool.query(`SELECT upsert_best_result($1, $2);`, [userId, testName])

		console.log('setBestResult resultId: ', resultId)

		return resultId
	},
}

export { resultsService }
