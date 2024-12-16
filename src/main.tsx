import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'

import store from 'store/index.ts'

import App from './App.tsx'

// Global styles
import './styles/base/global.scss'
import './styles/base/reset.scss'
import './styles/base/typography.scss'
import './styles/base/fonts.scss'

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<Provider store={store}>
			<App />
		</Provider>
	</StrictMode>
)
