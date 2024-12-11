import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'

import { Paths } from './utils/paths.ts'

import Root from './layouts/Root/Root'
import Settings from './pages/Settings/Settings'

function App() {
	const router = createBrowserRouter([
		{
			path: Paths.root,
			element: <Root />,
			errorElement: <Navigate to={Paths.root} />,
		},
		{
			path: Paths.settings,
			element: <Settings />,
		},
	])

	return <RouterProvider router={router}></RouterProvider>
}

export default App
