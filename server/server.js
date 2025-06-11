import { app, SERVER_PORT } from './app.js'

app.listen(SERVER_PORT, () => {
	console.log(`Server running on port ${SERVER_PORT}`)
})
