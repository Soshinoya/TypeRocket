import { FC, useEffect, useRef } from 'react'

import useClickOutside from 'hooks/useClickOutside'

import styles from './Modal.module.scss'

type Option = {
	id: string
	title: string
	onClick: Function
}

type ModalProps = {
	isOpen: boolean
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
	options: Option[]
}

const Modal: FC<ModalProps> = ({ isOpen, setIsOpen, options }) => {
	const modalRef = useRef(null)

	useEffect(() => {
		if (isOpen) {
			document.querySelector('body')?.classList.add('body--blur')
		} else {
			document.querySelector('body')?.classList.remove('body--blur')
		}

		return () => document.querySelector('body')?.classList.remove('body--blur')
	}, [isOpen])

	useClickOutside(modalRef, isClickOutside => setIsOpen(isClickOutside))

	return (
		<div ref={modalRef} className={`${styles['modal']} ${isOpen ? styles['modal--active'] : ''}`}>
			<ul>
				{options.map(({ id, title, onClick }) => (
					<li className={styles['modal__item']} onClick={() => onClick()} key={id}>
						{title}
					</li>
				))}
			</ul>
		</div>
	)
}

export default Modal
