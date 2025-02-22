import { ReactNode, FC, useEffect, useRef } from 'react'

import useClickOutside from 'hooks/useClickOutside'

import styles from './Modal.module.scss'

type ModalProps = {
	isOpen: boolean
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
	children: ReactNode
	style: React.CSSProperties
}

const Modal: FC<ModalProps> = ({ isOpen, setIsOpen, children, style }) => {
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
		<div ref={modalRef} className={`${styles['modal']} ${isOpen ? styles['modal--active'] : ''}`} style={style}>
			{children}
		</div>
	)
}

export default Modal
