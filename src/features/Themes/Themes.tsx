import React, { FC } from 'react'

import styles from './Themes.module.scss'

import { useAppSelector, useAppDispatch } from 'store/index'

import { selectAllThemes, selectCurrentTheme } from './selectors'
import { themeChangeAction } from './reducer'

import Modal from 'components/Modal/Modal'

type ThemesProps = {
	isOpen: boolean
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const Themes: FC<ThemesProps> = ({ isOpen, setIsOpen }) => {
	const dispatch = useAppDispatch()

	const currentTheme = useAppSelector(selectCurrentTheme)
	const allThemes = useAppSelector(selectAllThemes)

	return (
		<Modal
			isOpen={isOpen}
			setIsOpen={setIsOpen}
			children={
				<ul>
					{allThemes.map(theme => (
						<li
							key={theme.id}
							className={`${styles['themes__item']} ${
								theme.id === currentTheme.id ? styles['themes__item--active'] : ''
							}`}
							onClick={() => {
								dispatch(themeChangeAction(theme))
								setIsOpen(false)
							}}
						>
							<p>{theme.title}</p>
						</li>
					))}
				</ul>
			}
		/>
	)
}

export default Themes
