import { useEffect, useState } from 'react'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'

import { Paths } from './utils/paths.ts'

import { useAppDispatch, useAppSelector } from 'store/index.ts'

import { useGetMetricsMutation, useUpdateStreakMutation } from 'api/UserMetrics/UserMetrics.ts'

import { setMetrics } from 'features/CurrentUser/reducer.ts'
import { selectAccessToken, selectMetrics } from 'features/CurrentUser/selectors.ts'

import { getDaysDiff } from 'utils/utils.ts'

import Root from './layouts/Root/Root'

import Home from 'pages/Home/Home.tsx'
import Settings from './pages/Settings/Settings'
import Login from 'pages/Login/Login.tsx'
import Register from 'pages/Register/Register.tsx'
import Profile from 'pages/Profile/Profile.tsx'

function App() {
	const dispatch = useAppDispatch()

	const userMetrics = useAppSelector(selectMetrics)

	const [isPlayIntro, setIsPlayIntro] = useState(true)

	useEffect(() => {
		if (window.location.pathname !== Paths.root) {
			setIsPlayIntro(false)
		}
	}, [])

	const accessToken = useAppSelector(selectAccessToken)

	const [updateStreak] = useUpdateStreakMutation()

	const [getMetrics] = useGetMetricsMutation()

	useEffect(() => {
		if (!accessToken) return
		;(async () => {
			const { data } = await getMetrics({ accessToken })
			dispatch(setMetrics(data || null))
		})()
	}, [])

	useEffect(() => {
		;(async () => {
			if (!userMetrics) return

			const today = new Date().toISOString().split('T')[0]
			const daysDiff = getDaysDiff(userMetrics.last_activity_date, today)

			if (daysDiff >= 2) {
				const { data } = await updateStreak({ accessToken, streak: 0, last_activity_date: today })
				dispatch(setMetrics(data || null))
			} else if (daysDiff === 1) {
				const { data } = await updateStreak({
					accessToken,
					streak: userMetrics.streak + 1,
					last_activity_date: today,
				})
				dispatch(setMetrics(data || null))
			}
		})()
	}, [userMetrics])

	const router = createBrowserRouter([
		{
			path: Paths.root,
			element: <Root isPlayIntro={isPlayIntro} setIsPlayIntro={setIsPlayIntro} />,
			errorElement: <Navigate to={Paths.root} />,
			children: [
				{
					index: true,
					element: <Home />,
				},
				{
					path: Paths.profile,
					element: <Profile />,
				},
				{
					path: Paths.login,
					element: <Login />,
				},
				{
					path: Paths.register,
					element: <Register />,
				},
			],
		},
		{
			path: Paths.settings,
			element: <Settings />,
		},
	])

	return <RouterProvider router={router}></RouterProvider>
}

export default App
