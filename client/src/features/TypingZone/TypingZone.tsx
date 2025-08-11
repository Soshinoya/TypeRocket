import { FC, useEffect, useRef, useState } from 'react'

import { useAppDispatch, useAppSelector } from 'store/index'

import { resetTestStateAction, setIsTestFinishedAction, setIsTestStartedAction } from './reducer'
import { selectIsTestStarted, selectIsTestFinished } from './selectors'

import { Mode, I_ModeOption } from '../Text/types'
import { selectMode, selectTimeOptions } from '../Text/selectors'

import { calculateWPM, calculateRawWPM, calculateAcc, calculateConsistency } from 'utils/calculateStats'

import Text from 'features/Text/Text'
import { selectCurrentCharIndex, selectMistakes } from 'features/Text/selectors'

import {
	setAccuracyAction,
	setConsistencyAction,
	setCorrectWordsAction,
	setKeystrokesAction,
	setRawWpmAction,
	setTypedWordsAction,
	setWpmAction,
	setWpmPerTimeArrAction,
} from 'features/Statistics/reducer'

import { selectWpmPerTimeArr, selectTypedWords, selectCorrectWords } from 'features/Statistics/selectors'

import MobileConfigBar from 'features/MobileConfigBar/MobileConfigBar'

import TypingResult from 'components/TypingResult/TypingResult'

import RestartIcon from 'components/icons/RestartIcon/RestartIcon'
import Settings from 'components/icons/Settings/Settings'

import styles from './TypingZone.module.scss'

const TypingZone: FC = () => {
	const dispatch = useAppDispatch()

	const currentMode = useAppSelector(selectMode)
	const timeOptions: I_ModeOption[] = useAppSelector(selectTimeOptions)

	const isTestStarted = useAppSelector(selectIsTestStarted)
	const isTestFinished = useAppSelector(selectIsTestFinished)

	const currentCharIndex = useAppSelector(selectCurrentCharIndex)
	const mistakes = useAppSelector(selectMistakes)

	const wpmPerTimeArr = useAppSelector(selectWpmPerTimeArr)
	const typedWords = useAppSelector(selectTypedWords)
	const correctWords = useAppSelector(selectCorrectWords)

	const restartIconElRef = useRef<HTMLDivElement | null>(null)

	const [isResultOpen, setIsResultOpen] = useState(false)
	const [isMobileConfigOpen, setIsMobileConfigOpen] = useState(false)

	const [t1, setT1] = useState(0)
	const [timeBetweenKeyStrokes, setTimeBetweenKeyStrokes] = useState<number[]>([])

	const [timer, setTimer] = useState(0)
	const [isTimerActive, setIsTimerActive] = useState(false)

	const isMobile = window.matchMedia('(max-width: 1024px)').matches

	// Recording the time between keystrokes
	useEffect(() => {
		let t2 = performance.now()
		let deltaT = Math.round(t2 - t1)
		setTimeBetweenKeyStrokes(prev => [...prev, deltaT])
		setT1(t2)
	}, [currentCharIndex])

	// Starting the timer
	useEffect(() => {
		let intervalId: NodeJS.Timeout | undefined

		if (!isTimerActive) return

		intervalId = setInterval(() => {
			const newTimer = timer + 1
			setTimer(newTimer)
			dispatch(
				setWpmPerTimeArrAction([
					...wpmPerTimeArr,
					{
						time: newTimer,
						wpm: calculateWPM(correctWords, newTimer),
						rawWpm: calculateRawWPM(typedWords, newTimer),
					},
				])
			)
		}, 1000)

		const targetTime = timeOptions.find(option => option.enabled)?.count || timeOptions[0].count

		if (timer >= targetTime && currentMode === Mode.time) {
			dispatch(setIsTestStartedAction(false))
			dispatch(setIsTestFinishedAction(true))
		}

		return () => {
			if (intervalId) {
				clearInterval(intervalId)
			}
		}
	}, [isTimerActive, timer])

	useEffect(() => {
		if (!isResultOpen) {
			dispatch(resetTestStateAction())
		}
	}, [isResultOpen])

	// Focus on restart icon when pressing tab
	useEffect(() => {
		const tabPressHandler = (e: KeyboardEvent) => {
			if (restartIconElRef.current && e.key === 'Tab') {
				e.preventDefault()
				restartIconElRef.current.focus()
			}
		}

		document.addEventListener('keydown', tabPressHandler)

		return () => document.removeEventListener('keydown', tabPressHandler)
	}, [restartIconElRef])

	const restartIconHandler = () => {
		dispatch(resetTestStateAction())
	}

	// Test start
	useEffect(() => {
		if (!isTestStarted || isResultOpen || isMobileConfigOpen) return
		setIsTimerActive(true)
	}, [isTestStarted])

	// Test reset
	useEffect(() => {
		if (isTestStarted || isTestFinished) return
		dispatch(setWpmAction(0))
		dispatch(setRawWpmAction(0))
		dispatch(setAccuracyAction(0))
		dispatch(setConsistencyAction(0))
		dispatch(setWpmPerTimeArrAction([]))
		dispatch(setTypedWordsAction([]))
		dispatch(setCorrectWordsAction([]))
		dispatch(setKeystrokesAction(0))

		setIsTimerActive(false)
		setTimer(0)
		setTimeBetweenKeyStrokes([])
		setT1(0)
	}, [isTestStarted, isTestFinished])

	// Test finished
	useEffect(() => {
		if (!isTestFinished) return
		setIsTimerActive(false)

		dispatch(setWpmAction(calculateWPM(correctWords, timer)))
		dispatch(setRawWpmAction(calculateRawWPM(typedWords, timer)))
		dispatch(setAccuracyAction(calculateAcc(typedWords, mistakes)))
		dispatch(setConsistencyAction(calculateConsistency(timeBetweenKeyStrokes)))

		setIsResultOpen(true)
	}, [isTestFinished])

	return (
		<>
			<div className={styles['typing-zone']}>
				{window.matchMedia('(max-width: 1024px)').matches && (
					<div className={styles['typing-zone-header']}>
						{currentMode === Mode.time && (
							<p className={styles['typing-zone-header__countdown']}>
								{(timeOptions.find(option => option.enabled)?.count || timeOptions[0].count) - timer}
							</p>
						)}
						<div
							className={styles['typing-zone-header__settings']}
							onClick={() => setIsMobileConfigOpen(true)}
						>
							<Settings />
						</div>
					</div>
				)}
				<Text />
				<div
					ref={restartIconElRef}
					tabIndex={0}
					className={styles['restart']}
					onClick={restartIconHandler}
					onKeyDown={e => {
						if (e.key === 'Enter') {
							restartIconHandler()
							restartIconElRef.current?.blur()
						}
					}}
				>
					<RestartIcon style={{ width: '24px', height: '24px' }} />
				</div>
				{!isMobile && currentMode === Mode.time && (
					<p className={`${styles['countdown']} ${isTimerActive ? '' : styles['countdown--hide']}`}>
						{(timeOptions.find(option => option.enabled)?.count || timeOptions[0].count) - timer}
					</p>
				)}
			</div>
			<TypingResult time={timer} isOpen={isResultOpen} setIsOpen={setIsResultOpen} />
			<MobileConfigBar isOpen={isMobileConfigOpen} setIsOpen={setIsMobileConfigOpen} />
		</>
	)
}

export default TypingZone
