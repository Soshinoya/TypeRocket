import { userService } from '../services/user.service.js'

import { errorsHandler } from '../utils/apiError.js'

export const authMiddleware = {
	register: async (req, res, next) => {
		try {
			const { email, username } = req.body
			const isEmail = await userService.isUserEmailExists(email)
			const isUsername = await userService.isUserNameExists(username)
			if (!isEmail && !isUsername) {
				next()
			} else if (isEmail) {
				return res.status(409).send('Email already exists')
			} else if (isUsername) {
				return res.status(409).send('Username already exists')
			}
		} catch (err) {
			errorsHandler(err, res)
		}
	},
	login: async (req, res, next) => {
		try {
			const { email } = req.params
			const isEmail = await userService.isUserEmailExists(email)
			if (isEmail) {
				next()
			} else {
				return res.status(404).send('The email address has not been registered yet')
			}
		} catch (err) {
			errorsHandler(err, res)
		}
	},
}
