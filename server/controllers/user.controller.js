import { userService } from '../services/user.service.js'

const getUser = async (req, res, errorsHandler) => {
	try {
		const { email, password } = req.params
		const result = await userService.getUser(email, password)
		res.json(result)
	} catch (err) {
		errorsHandler(err, res)
	}
}

const isUserNameExists = async (req, res, errorsHandler) => {
	try {
		const { username } = req.params
		const result = await userService.isUserNameExists(username)
		res.json(result)
	} catch (err) {
		errorsHandler(err, res)
	}
}

const isUserEmailExists = async (req, res, errorsHandler) => {
	try {
		const { email } = req.params
		const result = await userService.isUserEmailExists(email)
		res.json(result)
	} catch (err) {
		errorsHandler(err, res)
	}
}

const createUser = async (req, res, errorsHandler) => {
	try {
		const result = await userService.createUser(req.body)
		res.json(result)
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

export { isUserNameExists, isUserEmailExists, getUser, createUser, deleteUser }
