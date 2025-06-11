import express from 'express'
import cors from 'cors'
import dotEnv from 'dotenv'

import pkg from 'pg'

import { errorsHandler } from './utils/apiError.js'

import { createUser, deleteUser } from './controllers/user.controller.js'

import { getBestResult, getAllBestResult, setBestResult } from './controllers/results.controller.js'

import {
	addCompletedAchievement,
	getAchievements,
	getCompletedAchievements,
} from './controllers/achievements.controller.js'

import { addExperience } from './controllers/experience.controller.js'

import { getActivity, setActivity } from './controllers/activity.controller.js'

const { Pool } = pkg

dotEnv.config({ path: './config/.env' })

const SERVER_PORT = process.env.SERVER_PORT

const app = express()

const pool = new Pool({
	user: process.env.DB_USER,
	host: process.env.DB_HOST,
	database: process.env.DB_NAME,
	password: process.env.DB_PASSWORD,
	port: process.env.DB_PORT,
})

const corsOptions = {
	origin: 'http://localhost:5173',
	methods: ['GET', 'POST', 'PATCH', 'DELETE'],
}

app.use(express.json())
app.use(cors(corsOptions))

// Создание нового пользователя
app.post('/user/create_user', async (req, res) => await createUser(req, res, errorsHandler))

// Удаление пользователя (с учетом удаления зависящих полей в таблицах с результатами)
app.delete('/user/delete_user', async (req, res) => await deleteUser(req, res, errorsHandler))

// Увеличение опыта
app.patch('/user/add_experience', async (req, res) => await addExperience(req, res, errorsHandler))

// Получить данные календаря активности
app.get('/user/get_activity/:userId/:from/:to', async (req, res) => await getActivity(req, res, errorsHandler))

// Добавить данные календаря активности
app.post('/user/set_activity', async (req, res) => await setActivity(req, res, errorsHandler))

app.get('/user/get_achievements', async (req, res) => await getAchievements(req, res, errorsHandler))

app.get(
	'/user/get_completed_achievements/:userId',
	async (req, res) => await getCompletedAchievements(req, res, errorsHandler)
)

app.post('/user/add_completed_achievement', async (req, res) => await addCompletedAchievement(req, res, errorsHandler))

// Выборка лучшего результата
app.get('/user/get_best_result', async (req, res) => await getBestResult(req, res, errorsHandler))

// Выборка всех лучших результатов
app.get('/user/get_all_best_results', async (req, res) => await getAllBestResult(req, res, errorsHandler))

// Добавление лучшего результата
app.post('/user/set_best_result', async (req, res) => await setBestResult(req, res, errorsHandler))

export { app, pool, SERVER_PORT }
