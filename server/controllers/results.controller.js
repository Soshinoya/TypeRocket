import { resultsService } from '../services/results.service.js'

const getBestResult = async (req, res, errorsHandler) => {
	try {
		const { userId, testName } = req.body

		const result = await resultsService.getBestResult(userId, testName)
		res.json(result)
	} catch (err) {
		errorsHandler(err)
	}
}

const getAllBestResult = async (req, res, errorsHandler) => {
	try {
		const { userId } = req.params

		const result = await resultsService.getAllBestResults(userId)
		res.json(
			result.map(({ name, wpm, rawWpm, accuracy, consistency, date }) => ({
				testName: name,
				resultMetrics: { wpm, rawWpm, accuracy, consistency, date },
			}))
		)
	} catch (err) {
		errorsHandler(err)
	}
}

const setBestResult = async (req, res, errorsHandler) => {
	try {
		const { userId, testName, resultMetrics } = req.body

		const result = await resultsService.setBestResult(userId, testName, resultMetrics)
		res.json(result)
	} catch (err) {
		errorsHandler(err)
	}
}

export { getBestResult, getAllBestResult, setBestResult }
