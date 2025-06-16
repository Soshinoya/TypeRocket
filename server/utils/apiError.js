// Централизованный обработчик ошибок
const errorsHandler = (err, res) => {
	console.error(err.stack)
	res.status(500).json({ message: `Internal Server Error ${err.message}` })
}

export { errorsHandler }
