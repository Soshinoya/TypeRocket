import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

import { hashPassword } from '../utils/utils.js'

import { userService } from '../services/user.service.js'

const refreshAccessToken = async (req, res, errorsHandler) => {
	try {
		const { userId } = req

		const user = await userService.getUserById(userId)
		if (!user) {
			return res.status(404).json({ error: 'USER_NOT_FOUND' })
		}

		const newAccessToken = jwt.sign({ userId: user.id }, process.env.ACCESS_SECRET, { expiresIn: '15m' })

		res.json({ accessToken: newAccessToken })
	} catch (err) {
		errorsHandler(err, res)
	}
}

const login = async (req, res, errorsHandler) => {
	try {
		const { email, password } = req.body

		const result = await userService.login(email, password)
		const validPassword = await bcrypt.compare(password, result.password)

		if (!validPassword) {
			return res.status(400).json({ error: 'Incorrect password' })
		}

		const accessToken = jwt.sign({ userId: result.id }, process.env.ACCESS_SECRET, { expiresIn: '15m' })
		const refreshToken = jwt.sign({ userId: result.id }, process.env.REFRESH_SECRET, { expiresIn: '7d' })

		res.cookie('refreshToken', refreshToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict',
			maxAge: 7 * 24 * 3600000,
		})

		res.json({ user: result, accessToken })
	} catch (err) {
		errorsHandler(err, res)
	}
}

const register = async (req, res, errorsHandler) => {
	try {
		const hashedPassword = await hashPassword(req.body.password)
		req.body.password = hashedPassword

		const result = await userService.register(req.body)

		// user.controller.js
		const accessToken = jwt.sign({ userId: result.id }, process.env.ACCESS_SECRET, { expiresIn: '15m' })
		const refreshToken = jwt.sign({ userId: result.id }, process.env.REFRESH_SECRET, { expiresIn: '7d' })

		res.cookie('refreshToken', refreshToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict',
			maxAge: 7 * 24 * 3600000,
		})

		res.json({ user: result, accessToken })
	} catch (err) {
		errorsHandler(err, res)
	}
}

const deleteUser = async (req, res, errorsHandler) => {
	try {
		const { userId } = req.body
		const result = await userService.deleteUser(userId)
		res.json(result)
	} catch (err) {
		errorsHandler(err, res)
	}
}

export { refreshAccessToken, login, register, deleteUser }
