import { activityService } from '../services/activity.service.js'

const getActivity = async (req, res, errorsHandler) => {
	try {
		const { userId, from, to } = req.params

		const result = await activityService.getActivity(userId, from, to)
		res.json(result)
	} catch (err) {
		errorsHandler(err)
	}
}

const setActivity = async (req, res, errorsHandler) => {
	try {
		const { userId } = req.body

		const result = await activityService.setActivity(userId)
		res.json(result)
	} catch (err) {
		errorsHandler(err)
	}
}

export { getActivity, setActivity }
