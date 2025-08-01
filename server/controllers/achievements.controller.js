import { achievementService } from '../services/achievements.service.js'

const getAchievements = async (req, res, errorsHandler) => {
	try {
		const result = await achievementService.getAchievements()
		res.json(result)
	} catch (err) {
		errorsHandler(err, res)
	}
}

const getCompletedAchievements = async (req, res, errorsHandler) => {
	try {
		const { userId } = req.body
		const result = await achievementService.getCompletedAchievements(userId)
		res.json(result)
	} catch (err) {
		errorsHandler(err, res)
	}
}

const addCompletedAchievement = async (req, res, errorsHandler) => {
	try {
		const { userId, achievement_id } = req.body
		const result = await achievementService.addCompletedAchievement(userId, achievement_id)
		res.json(result)
	} catch (err) {
		errorsHandler(err, res)
	}
}

export { getAchievements, getCompletedAchievements, addCompletedAchievement }
