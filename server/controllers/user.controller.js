import { userService } from '../services/user.service.js'

const createUser = async (req, res, errorsHandler) => {
	try {
		const result = await userService.createUser(req.body, res)
		res.json(result)
	} catch (err) {
		errorsHandler(err, res)
	}
}

const deleteUser = async (req, res, errorsHandler) => {
	try {
		const result = await userService.deleteUser(req.body, res)
		res.json(result)
	} catch (err) {
		errorsHandler(err, res)
	}
}

export { createUser, deleteUser }
