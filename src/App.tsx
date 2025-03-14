import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'

import { Paths } from './utils/paths.ts'

import Root from './layouts/Root/Root'
import Home from 'pages/Home/Home.tsx'
import Settings from './pages/Settings/Settings'
import Login from 'pages/Login/Login.tsx'
import Register from 'pages/Register/Register.tsx'

function App() {
	const router = createBrowserRouter([
		{
			path: Paths.root,
			element: <Root />,
			errorElement: <Navigate to={Paths.root} />,
			children: [
				{
					index: true,
					element: <Home />,
				},
			],
		},
		{
			path: Paths.login,
			element: <Login />,
		},
		{
			path: Paths.register,
			element: <Register />,
		},
		{
			path: Paths.settings,
			element: <Settings />,
		},
	])

	return <RouterProvider router={router}></RouterProvider>
}

export default App
