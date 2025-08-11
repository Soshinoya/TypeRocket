import express from 'express'
import cors from 'cors'
import dotEnv from 'dotenv'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'

import pkg from 'pg'

import { errorsHandler } from './utils/apiError.js'

import { refreshAccessToken, login, register, deleteUser } from './controllers/user.controller.js'

import { getBestResult, getAllBestResult, setBestResult } from './controllers/results.controller.js'

import { getMetrics, updateKeystrokes, updateStreak } from './controllers/userMetrics.controller.js'

import {
	addCompletedAchievement,
	getAchievements,
	getCompletedAchievements,
} from './controllers/achievements.controller.js'

import { addExperience, getExperience } from './controllers/experience.controller.js'

import { getActivity, setActivity } from './controllers/activity.controller.js'

import { authMiddleware } from './middlewares/auth.middleware.js'

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
	// origin: 'https://799f91kk-5173.euw.devtunnels.ms',
	methods: ['GET', 'POST', 'PATCH', 'DELETE'],
	credentials: true,
	allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
}

app.use(express.json())
app.use(cookieParser())
app.use(helmet())
app.use(cors(corsOptions))

app.post(
	'/user/refresh',
	async (req, res, next) => await authMiddleware.verifyRefreshToken(req, res, next),
	async (req, res) => await refreshAccessToken(req, res, errorsHandler)
)

// Логин
app.post(
	'/user/login',
	async (req, res, next) => await authMiddleware.login(req, res, next),
	async (req, res) => await login(req, res, errorsHandler)
)

// Регистрация
app.post(
	'/user/register',
	async (req, res, next) => await authMiddleware.register(req, res, next),
	async (req, res) => await register(req, res, errorsHandler)
)

// Логаут
app.post('/user/logout', (req, res) => {
	res.clearCookie('token')
	res.clearCookie('refreshToken')
	res.status(200).json({ message: 'Logged out' })
})

// Удаление пользователя (с учетом удаления зависящих полей в таблицах с результатами)
app.delete('/user/delete_user', async (req, res) => await deleteUser(req, res, errorsHandler))

// Получение опыта
app.post(
	'/user/get_experience',
	async (req, res, next) => await authMiddleware.verifyAccessToken(req, res, next),
	async (req, res) => await getExperience(req, res, errorsHandler)
)

// Увеличение опыта
app.patch(
	'/user/add_experience',
	async (req, res, next) => await authMiddleware.verifyAccessToken(req, res, next),
	async (req, res) => await addExperience(req, res, errorsHandler)
)

// Выборка лучшего результата
app.get('/user/get_best_result', async (req, res) => await getBestResult(req, res, errorsHandler))

// Выборка всех лучших результатов
app.get('/user/get_all_best_results', async (req, res) => await getAllBestResult(req, res, errorsHandler))

// Добавление лучшего результата
app.post(
	'/user/set_best_result',
	async (req, res, next) => await authMiddleware.verifyAccessToken(req, res, next),
	async (req, res) => await setBestResult(req, res, errorsHandler)
)

// Выборка всех достижений
app.get('/user/get_achievements', async (req, res) => await getAchievements(req, res, errorsHandler))

// Выборка полученных достижений
app.post(
	'/user/get_completed_achievements',
	async (req, res, next) => await authMiddleware.verifyAccessToken(req, res, next),
	async (req, res) => await getCompletedAchievements(req, res, errorsHandler)
)

// Добавление полученного достижения
app.post(
	'/user/add_completed_achievement',
	async (req, res, next) => await authMiddleware.verifyAccessToken(req, res, next),
	async (req, res) => await addCompletedAchievement(req, res, errorsHandler)
)

// Выборка метрик
app.post(
	'/user/get_metrics',
	async (req, res, next) => await authMiddleware.verifyAccessToken(req, res, next),
	async (req, res) => await getMetrics(req, res, errorsHandler)
)

// Обновление метрики ежедневного входа
app.patch(
	'/user/update_metrics_streak',
	async (req, res, next) => await authMiddleware.verifyAccessToken(req, res, next),
	async (req, res) => await updateStreak(req, res, errorsHandler)
)

// Обновление метрики нажатия клавиш
app.patch(
	'/user/update_metrics_keystrokes',
	async (req, res, next) => await authMiddleware.verifyAccessToken(req, res, next),
	async (req, res) => await updateKeystrokes(req, res, errorsHandler)
)

// Получить данные календаря активности
app.post(
	'/user/get_activity',
	async (req, res, next) => await authMiddleware.verifyAccessToken(req, res, next),
	async (req, res) => await getActivity(req, res, errorsHandler)
)

// Добавить данные календаря активности
app.post(
	'/user/set_activity',
	async (req, res, next) => await authMiddleware.verifyAccessToken(req, res, next),
	async (req, res) => await setActivity(req, res, errorsHandler)
)

export { app, pool, SERVER_PORT }
