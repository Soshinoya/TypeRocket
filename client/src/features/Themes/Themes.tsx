import React, { FC, useEffect, useRef } from 'react'

import styles from './Themes.module.scss'

import { useAppSelector, useAppDispatch } from 'store/index'

import { selectAllThemes, selectCurrentTheme } from './selectors'
import { themeChangeAction } from './reducer'

import Modal from 'components/Modal/Modal'

import useIsEscapePress from 'hooks/useIsEscapePress'

type ThemesProps = {
	isOpen: boolean
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const Themes: FC<ThemesProps> = ({ isOpen, setIsOpen }) => {
	const dispatch = useAppDispatch()

	const currentTheme = useAppSelector(selectCurrentTheme)
	const allThemes = useAppSelector(selectAllThemes)

	const themesList = useRef<HTMLUListElement>(null)

	useIsEscapePress(setIsOpen)

	useEffect(() => {
		if (!isOpen) return
		const themesNavHandler = (e: KeyboardEvent) => {
			if (!themesList.current) return

			const active = themesList.current.querySelector('[data-theme-current="true"]')
			if (!active) return

			// We get all the theme elements at once to avoid problems with the DOM.
			const allThemeElements = Array.from(themesList.current.querySelectorAll('[data-id]'))
			const currentIndex = allThemeElements.indexOf(active)

			if (currentIndex === -1) return

			const changeCurrentTheme = (newIndex: number) => {
				if (newIndex < 0 || newIndex >= allThemeElements.length) return

				const newActive = allThemeElements[newIndex]
				if (newActive === active) return

				active.removeAttribute('data-theme-current')
				newActive.setAttribute('data-theme-current', 'true')

				const themeId = newActive.getAttribute('data-id')
				if (themeId) {
					const newTheme = allThemes.find(({ id }) => id === themeId)
					newTheme && dispatch(themeChangeAction(newTheme))
				}
			}

			switch (e.key) {
				case 'ArrowUp':
					e.preventDefault()
					changeCurrentTheme(currentIndex - 1)
					break
				case 'ArrowDown':
					e.preventDefault()
					changeCurrentTheme(currentIndex + 1)
					break
			}
		}

		document.addEventListener('keydown', themesNavHandler)

		return () => document.removeEventListener('keydown', themesNavHandler)
	}, [isOpen, currentTheme])

	return (
		<Modal
			isOpen={isOpen}
			setIsOpen={setIsOpen}
			style={{ padding: 0, height: 'auto' }}
			children={
				<ul ref={themesList}>
					{allThemes.map(theme => (
						<li
							key={theme.id}
							data-id={theme.id}
							data-theme-current={theme.id === currentTheme.id}
							className={styles['themes-item']}
							onClick={() => {
								dispatch(themeChangeAction(theme))
								setIsOpen(false)
							}}
						>
							<p>{theme.title}</p>
							<div className={styles['themes-item__palette']}>
								<span style={{ backgroundColor: theme.primaryBold }}></span>
								<span style={{ backgroundColor: theme.primary }}></span>
								<span style={{ backgroundColor: theme.accent }}></span>
							</div>
						</li>
					))}
				</ul>
			}
		/>
	)
}

export default Themes
