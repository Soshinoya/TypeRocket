import { useEffect, useState } from 'react'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'

import { Paths } from './utils/paths.ts'

import Root from './layouts/Root/Root'
import Home from 'pages/Home/Home.tsx'
import Settings from './pages/Settings/Settings'
import Login from 'pages/Login/Login.tsx'
import Register from 'pages/Register/Register.tsx'
import Profile from 'pages/Profile/Profile.tsx'

function App() {
	const [isPlayIntro, setIsPlayIntro] = useState(true)

	useEffect(() => {
		if (window.location.pathname !== Paths.root) {
			setIsPlayIntro(false)
		}
	}, [])

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
