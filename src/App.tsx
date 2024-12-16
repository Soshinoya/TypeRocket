import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'

import { Paths } from './utils/paths.ts'

import Root from './layouts/Root/Root'
import Home from 'pages/Home/Home.tsx'
import Settings from './pages/Settings/Settings'

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
				// {
				// 	path: 'about',
				// 	element: <About />,
				// },
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
