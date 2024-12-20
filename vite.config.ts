import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			components: path.resolve(__dirname, 'src/components'),
			features: path.resolve(__dirname, 'src/features'),
			images: path.resolve(__dirname, 'src/images'),
			layouts: path.resolve(__dirname, 'src/layouts'),
			pages: path.resolve(__dirname, 'src/pages'),
			store: path.resolve(__dirname, 'src/store'),
			styles: path.resolve(__dirname, 'src/styles'),
			utils: path.resolve(__dirname, 'src/utils'),
			data: path.resolve(__dirname, 'src/data'),
			hooks: path.resolve(__dirname, 'src/hooks'),
		},
	},
})
