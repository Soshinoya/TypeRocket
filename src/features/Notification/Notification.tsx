import { FC, useEffect, useState, useRef } from 'react'

import { useAppDispatch, useAppSelector } from 'store/index'

import { I_Notification } from './types'
import { deleteNotificationAction } from './reducer'

import { selectCurrentTheme } from 'features/Themes/selectors'

import styles from './Notification.module.scss'

const Notification: FC<I_Notification> = ({ id, title, subtitle, status, duration = 5000 }) => {
	const dispatch = useAppDispatch()

	const { accent } = useAppSelector(selectCurrentTheme)

	const [passedMS, setPassedMS] = useState(0)

	const notificationRef = useRef<HTMLDivElement | null>(null)

	const intervalRef = useRef<NodeJS.Timeout | null>(null)

	const renderIcon = () => {
		switch (status) {
			case 'success':
				return (
					<svg width='28' height='28' viewBox='0 0 28 28' fill='none' xmlns='http://www.w3.org/2000/svg'>
						<path
							d='M0.478271 15.645L6.99994 22.1667L8.64494 20.51L2.13494 14M25.9466 6.51001L13.6033 18.865L8.74994 14L7.0816 15.645L13.6033 22.1667L27.6033 8.16668M20.9999 8.16668L19.3549 6.51001L11.9466 13.9183L13.6033 15.5633L20.9999 8.16668Z'
							fill={accent}
						/>
					</svg>
				)
			case 'error':
				return (
					<svg width='28' height='28' viewBox='0 0 28 28' fill='none' xmlns='http://www.w3.org/2000/svg'>
						<path
							d='M10.9667 15.5038L14 12.4927L17.0333 15.5027L17.836 14.7L14.826 11.6667L17.836 8.63333L17.0333 7.8295L14 10.8418L10.9667 7.83183L10.1628 8.6345L13.174 11.6678L10.164 14.7012L10.9667 15.5038ZM3.5 23.4232V3.5H24.5V19.8333H7.08983L3.5 23.4232ZM6.59167 18.6667H23.3333V4.66667H4.66667V20.5847L6.59167 18.6667Z'
							fill='#A70000'
						/>
					</svg>
				)
			case 'info':
				return (
					<svg width='28' height='28' viewBox='0 0 28 28' fill='none' xmlns='http://www.w3.org/2000/svg'>
						<path
							d='M13.4167 19.25H14.5833V12.8333H13.4167V19.25ZM14 11.1732C14.2038 11.1732 14.3745 11.1043 14.5122 10.9667C14.6498 10.829 14.7183 10.6583 14.7175 10.4545C14.7167 10.2507 14.6479 10.0804 14.511 9.9435C14.3741 9.80661 14.2038 9.73778 14 9.737C13.7962 9.73622 13.6259 9.80506 13.489 9.9435C13.3521 10.0819 13.2833 10.2527 13.2825 10.4557C13.2817 10.6587 13.3506 10.829 13.489 10.9667C13.6274 11.1043 13.7978 11.1732 14 11.1732ZM14.0035 24.5C12.5514 24.5 11.1864 24.2247 9.9085 23.674C8.63061 23.1226 7.51878 22.3743 6.573 21.4293C5.62722 20.4843 4.87861 19.3737 4.32717 18.0973C3.77572 16.821 3.5 15.4564 3.5 14.0035C3.5 12.5506 3.77572 11.1856 4.32717 9.9085C4.87783 8.63061 5.62489 7.51878 6.56833 6.573C7.51178 5.62722 8.62283 4.87861 9.9015 4.32717C11.1802 3.77572 12.5452 3.5 13.9965 3.5C15.4478 3.5 16.8128 3.77572 18.0915 4.32717C19.3694 4.87783 20.4812 5.62528 21.427 6.5695C22.3728 7.51372 23.1214 8.62478 23.6728 9.90267C24.2243 11.1806 24.5 12.5452 24.5 13.9965C24.5 15.4478 24.2247 16.8128 23.674 18.0915C23.1233 19.3702 22.3751 20.482 21.4293 21.427C20.4836 22.372 19.3729 23.1206 18.0973 23.6728C16.8218 24.2251 15.4572 24.5008 14.0035 24.5ZM14 23.3333C16.6056 23.3333 18.8125 22.4292 20.6208 20.6208C22.4292 18.8125 23.3333 16.6056 23.3333 14C23.3333 11.3944 22.4292 9.1875 20.6208 7.37917C18.8125 5.57083 16.6056 4.66667 14 4.66667C11.3944 4.66667 9.1875 5.57083 7.37917 7.37917C5.57083 9.1875 4.66667 11.3944 4.66667 14C4.66667 16.6056 5.57083 18.8125 7.37917 20.6208C9.1875 22.4292 11.3944 23.3333 14 23.3333Z'
							fill='#42AAFF'
						/>
					</svg>
				)
			case 'warning':
				return (
					<svg width='28' height='28' viewBox='0 0 28 28' fill='none' xmlns='http://www.w3.org/2000/svg'>
						<path
							d='M3.18506 23.3334L14.0001 4.66669L24.8151 23.3334H3.18506ZM5.19173 22.1667H22.8084L14.0001 7.00002L5.19173 22.1667ZM14.0001 20.552C14.2038 20.552 14.3746 20.4832 14.5122 20.3455C14.6499 20.2079 14.7183 20.0371 14.7176 19.8334C14.7168 19.6296 14.6479 19.4592 14.5111 19.3224C14.3742 19.1855 14.2038 19.1162 14.0001 19.1147C13.7963 19.1131 13.626 19.182 13.4891 19.3212C13.3522 19.4604 13.2833 19.6311 13.2826 19.8334C13.2818 20.0356 13.3506 20.2063 13.4891 20.3455C13.6275 20.4847 13.7978 20.5536 14.0001 20.552ZM13.4167 17.9492H14.5834V12.1159H13.4167V17.9492Z'
							fill='#FA5B17'
						/>
					</svg>
				)

			default:
				return (
					<svg width='28' height='28' viewBox='0 0 28 28' fill='none' xmlns='http://www.w3.org/2000/svg'>
						<path
							d='M0.478271 15.645L6.99994 22.1667L8.64494 20.51L2.13494 14M25.9466 6.51001L13.6033 18.865L8.74994 14L7.0816 15.645L13.6033 22.1667L27.6033 8.16668M20.9999 8.16668L19.3549 6.51001L11.9466 13.9183L13.6033 15.5633L20.9999 8.16668Z'
							fill={accent}
						/>
					</svg>
				)
		}
	}

	const startTimer = () => {
		if (intervalRef.current !== null) return // already running
		intervalRef.current = setInterval(() => {
			setPassedMS(ms => ms + 50)
		}, 50)
	}

	const pauseTimer = () => {
		if (intervalRef.current) {
			clearInterval(intervalRef.current)
			intervalRef.current = null
		}
	}

	const customClearInterval = () => {
		pauseTimer()
		if (notificationRef.current) {
			notificationRef.current.classList.remove(styles['notification--active'])
		}
		const timeout = setTimeout(() => {
			dispatch(deleteNotificationAction(id))
		}, 300)

		return () => {
			clearTimeout(timeout)
		}
	}

	useEffect(() => {
		startTimer()
	}, [])

	useEffect(() => {
		if (passedMS >= duration) {
			customClearInterval()
		}
	}, [passedMS])

	useEffect(() => {
		return () => {
			pauseTimer()
		}
	}, [])

	useEffect(() => {
		const timeout = setTimeout(() => {
			if (notificationRef.current) {
				notificationRef.current.classList.add(styles['notification--active'])
			}
		}, 300)

		return () => {
			clearTimeout(timeout)
		}
	}, [])

	return (
		<div
			ref={notificationRef}
			className={`${styles['notification']} ${styles[`notification--${status}`]}`}
			onMouseEnter={pauseTimer}
			onMouseLeave={startTimer}
		>
			<div className={styles['notification__inner']}>
				<div className={styles['notification__icon']}>{renderIcon()}</div>
				<div className={styles['notification__info']}>
					<p className={styles['notification__title']}>{title}</p>
					<p className={styles['notification__subtitle']}>{subtitle}</p>
				</div>
			</div>
			<div
				className={styles['notification__cross']}
				onClick={() => {
					if (notificationRef.current) {
						notificationRef.current.classList.remove(styles['notification--active'])
					}
					customClearInterval()
				}}
			>
				<svg width='34' height='34' viewBox='0 0 34 34' fill='none' xmlns='http://www.w3.org/2000/svg'>
					<path
						fillRule='evenodd'
						clipRule='evenodd'
						d='M25.3654 9.56727C25.4398 9.49289 25.4988 9.4046 25.539 9.30743C25.5793 9.21026 25.6 9.10611 25.6 9.00093C25.6 8.89575 25.5793 8.7916 25.539 8.69443C25.4988 8.59726 25.4398 8.50897 25.3654 8.4346C25.291 8.36022 25.2028 8.30123 25.1056 8.26098C25.0084 8.22073 24.9043 8.20001 24.7991 8.20001C24.6939 8.20001 24.5898 8.22073 24.4926 8.26098C24.3954 8.30123 24.3071 8.36022 24.2327 8.4346L16.8 15.8689L9.36725 8.4346C9.29288 8.36022 9.20459 8.30123 9.10742 8.26098C9.01024 8.22073 8.9061 8.20001 8.80092 8.20001C8.69574 8.20001 8.59159 8.22073 8.49442 8.26098C8.39725 8.30123 8.30896 8.36022 8.23458 8.4346C8.16021 8.50897 8.10122 8.59726 8.06097 8.69443C8.02072 8.7916 8 8.89575 8 9.00093C8 9.10611 8.02072 9.21026 8.06097 9.30743C8.10122 9.4046 8.16021 9.49289 8.23458 9.56727L15.6689 17L8.23458 24.4328C8.08438 24.583 8 24.7867 8 24.9991C8 25.2115 8.08438 25.4152 8.23458 25.5654C8.38478 25.7156 8.5885 25.8 8.80092 25.8C9.01334 25.8 9.21705 25.7156 9.36725 25.5654L16.8 18.1311L24.2327 25.5654C24.3829 25.7156 24.5867 25.8 24.7991 25.8C25.0115 25.8 25.2152 25.7156 25.3654 25.5654C25.5156 25.4152 25.6 25.2115 25.6 24.9991C25.6 24.7867 25.5156 24.583 25.3654 24.4328L17.9311 17L25.3654 9.56727Z'
						fill={accent}
					/>
				</svg>
			</div>
			<div
				className={styles['notification__progressbar']}
				style={{ width: `${(passedMS / duration) * 100}%` }}
			></div>
		</div>
	)
}

export default Notification
