import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App.tsx'

// Global styles
import './styles/base/global.scss'
import './styles/base/reset.scss'
import './styles/base/typography.scss'
import './styles/base/fonts.scss'

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<App />
	</StrictMode>
)
