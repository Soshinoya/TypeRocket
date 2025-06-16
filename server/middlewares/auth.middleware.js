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
			const { email } = req.body
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
	authenticateToken: (req, res, next) => {
		const token = req.cookies.token

		if (!token) {
			return res.status(401).json({ error: 'The token is missing' })
		}

		jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
			if (err) {
				return res.status(403).json({ error: 'Invalid token' })
			}
			req.user = user
			console.log('(jwt.verify) user: ', user)
			next()
		})
	},
	verifyRefreshToken: async (req, res, next) => {
		try {
			const refreshToken = req.cookies.refreshToken

			if (!refreshToken) {
				return res.status(401).json({ error: 'REFRESH_TOKEN_MISSING' })
			}

			const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET)
			req.userId = decoded.userId
			next()
		} catch (error) {
			if (error.name === 'TokenExpiredError') {
				return res.status(403).json({ error: 'REFRESH_TOKEN_EXPIRED' })
			}
			res.status(401).json({ error: 'INVALID_REFRESH_TOKEN' })
		}
	},
}
