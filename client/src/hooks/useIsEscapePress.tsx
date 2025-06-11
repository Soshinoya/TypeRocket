import { useEffect } from 'react'

const useIsEscapePress = (handler: (isEscapePress: boolean) => void) => {
	useEffect(() => {
		const listener = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				handler(false)
			}
		}

		document.addEventListener('keydown', listener)

		return () => {
			document.removeEventListener('keydown', listener)
		}
	}, [handler])
}

export default useIsEscapePress
