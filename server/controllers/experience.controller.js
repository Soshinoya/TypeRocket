import { experienceService } from '../services/experience.service.js'

const getExperience = async (req, res, errorsHandler) => {
	try {
		const { userId } = req.body
		const result = await experienceService.getExperience(userId)
		res.json(result)
	} catch (error) {
		errorsHandler(err, res)
	}
}

const addExperience = async (req, res, errorsHandler) => {
	try {
		const { userId, level, progress } = req.body
		const result = await experienceService.addExperience(userId, level, progress)
		res.json(result)
	} catch (err) {
		errorsHandler(err, res)
	}
}

export { getExperience, addExperience }
