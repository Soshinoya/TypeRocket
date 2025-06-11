import { experienceService } from '../services/experience.service.js'

const addExperience = async (req, res, errorsHandler) => {
	try {
		const { userId, level, progress } = req.body
		const result = await experienceService.addExperience(userId, level, progress)
		res.json(result)
	} catch (err) {
		errorsHandler(err)
	}
}

export { addExperience }
