import { userMetricsService } from '../services/userMetrics.service.js'

const getMetrics = async (req, res, errorsHandler) => {
	try {
		const { userId } = req.body
		const result = await userMetricsService.getMetrics(userId)
		res.json(result)
	} catch (err) {
		errorsHandler(err)
	}
}

const updateStreak = async (req, res, errorsHandler) => {
	try {
		const { userId, streak, last_activity_date } = req.body
		const result = await userMetricsService.updateStreak(userId, streak, last_activity_date)
		res.json(result)
	} catch (err) {
		errorsHandler(err)
	}
}

const updateKeystrokes = async (req, res, errorsHandler) => {
	try {
		const { userId, keystrokes } = req.body
		const result = await userMetricsService.updateKeystrokes(userId, keystrokes)
		res.json(result)
	} catch (err) {
		errorsHandler(err)
	}
}

export { getMetrics, updateKeystrokes, updateStreak }
