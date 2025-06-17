import jwt from 'jsonwebtoken'

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
	verifyRefreshToken: async (req, res, next) => {
		try {
			const refreshToken = req.cookies.refreshToken

			if (!refreshToken) {
				console.log('!refreshToken')
				return res.status(401).json({ error: 'REFRESH_TOKEN_MISSING' })
			}

			const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET)
			req.userId = decoded.userId
			next()
		} catch (error) {
			console.log('error: ', error)
			if (error.name === 'TokenExpiredError') {
				return res.status(403).json({ error: 'REFRESH_TOKEN_EXPIRED' })
			}
			res.status(401).json({ error: 'INVALID_REFRESH_TOKEN' })
		}
	},
}
