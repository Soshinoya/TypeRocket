import { nanoid } from '@reduxjs/toolkit'
import React, { FC, useEffect } from 'react'

import { useAppDispatch, useAppSelector } from 'store/index'

import { setNotificationAction } from 'features/Notification/reducer'
import { selectAccessToken, selectBestResults, selectExperience } from 'features/CurrentUser/selectors'
import { setActivity, setBestResults, setExperience } from 'features/CurrentUser/reducer'

import { useAddExperienceMutation } from 'api/Experience/ExperienceApiSlice'
import { useSetActivityMutation } from 'api/Activity/ActivityApiSlice'
import { useSetBestResultsMutation } from 'api/BestResults/BestResultsApiSlice'

import styles from './TypingResult.module.scss'

import Modal from 'components/Modal/Modal'
import ResultWpmChart from 'components/Chart/ResultWpmChart'
import Ad from 'components/icons/Ad/Ad'

import {
	selectIsPunctuation,
	selectIsNumbers,
	selectMode,
	selectWordOptions,
	selectTimeOptions,
} from 'features/TypingZone/selectors'

import useIsEscapePress from 'hooks/useIsEscapePress'

import { getDate } from 'utils/utils'
import { computeExperience, increaseExperience } from 'utils/experience'
import { Mode } from 'features/TypingZone/types'

type TypingResultProps = {
	wpm: number
	rawWpm: number
	accuracy: number
	consistency: number
	errorCount: number
	time: number
	wpmPerTimeArr: { time: number; wpm: number; rawWpm: number }[]
	isOpen: boolean
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const TypingResult: FC<TypingResultProps> = ({
	wpm,
	rawWpm,
	accuracy,
	consistency,
	errorCount,
	time,
	wpmPerTimeArr,
	isOpen,
	setIsOpen,
}) => {
	const dispatch = useAppDispatch()

	const hasPunctuation = useAppSelector(selectIsPunctuation)
	const hasNumbers = useAppSelector(selectIsNumbers)
	const mode = useAppSelector(selectMode)
	const wordOptions = useAppSelector(selectWordOptions)
	const timeOptions = useAppSelector(selectTimeOptions)

	const bestResults = useAppSelector(selectBestResults)

	const accessToken = useAppSelector(selectAccessToken)
	const currentExperience = useAppSelector(selectExperience)

	const [addExperience] = useAddExperienceMutation()

	const [setActivityMutation] = useSetActivityMutation()

	const [setBestResultsMutation] = useSetBestResultsMutation()

	useIsEscapePress(setIsOpen)

	const defineTestName = () => {
		let testName = 'test_15s'

		;[...wordOptions, ...timeOptions].forEach(({ count, enabled }) => {
			if (!enabled) return
			testName = `test_${count}${mode === Mode['words'] ? 'w' : 's'}`
		})

		return testName
	}

	useEffect(() => {
		if (!accessToken || !currentExperience) return
		if (isOpen) {
			const earnedXP = computeExperience({
				hasPunctuation,
				hasNumbers,
				mode,
				count:
					[...wordOptions, ...timeOptions].find(({ enabled }) => enabled === true)?.count ||
					wordOptions[0].count,
				wpm,
				accuracy,
				consistency,
				errorCount,
				xpMultiplier: 25,
			})

			// Добавляем опыт
			;(async () => {
				const { level, progress } = increaseExperience(earnedXP, currentExperience.progress)

				const { data } = await addExperience({
					accessToken,
					level: currentExperience.level + level,
					progress,
				})

				if (data) dispatch(setExperience({ level: data.level, progress: data.progress }))
			})()
			// Добавляем очко активности
			;(async () => {
				const { data } = await setActivityMutation({ accessToken })

				if (data) dispatch(setActivity(data))
			})()

			// Добавляем лучший результат
			const testName = defineTestName()
			const currentBestResult = bestResults.find(result => result.testName === testName)
			if (currentBestResult?.resultMetrics.wpm || 0 < wpm) {
				;(async () => {
					const newBestResult = {
						accessToken,
						testName,
						resultMetrics: { wpm, rawWpm, accuracy, consistency },
					}
					await setBestResultsMutation(newBestResult)
					dispatch(setBestResults(newBestResult))
				})()
			}

			dispatch(
				setNotificationAction({
					id: nanoid(10),
					title: 'Test completed',
					subtitle: `You have gained ${earnedXP} experience points`,
					status: 'success',
				})
			)
		}
	}, [isOpen, accessToken])

	return isOpen ? (
		<Modal
			isOpen={isOpen}
			setIsOpen={setIsOpen}
			style={{ width: 'auto', height: 'auto', padding: '30px' }}
			children={
				<>
					<div className={styles['result-header']}>
						<h2 className={styles['result-header__title']}>Results</h2>
						<p className={styles['result-header__date']}>{getDate(new Date())}</p>
					</div>
					<div className={styles['result-body']}>
						<div className={styles['result-stats']}>
							<ul className={styles['result-stats__inner']}>
								<li className={styles['result-stats-item']}>
									<h3 className={styles['result-stats-item__title']}>{wpm}</h3>
									<p className={styles['result-stats-item__desc']}>wpm</p>
								</li>
								<li className={styles['result-stats-item']}>
									<h3 className={styles['result-stats-item__title']}>{rawWpm}</h3>
									<p className={styles['result-stats-item__desc']}>raw wpm</p>
								</li>
								<li className={styles['result-stats-item']}>
									<h3 className={styles['result-stats-item__title']}>{errorCount}</h3>
									<p className={styles['result-stats-item__desc']}>errors</p>
								</li>
								<li className={styles['result-stats-item']}>
									<h3 className={styles['result-stats-item__title']}>{accuracy}%</h3>
									<p className={styles['result-stats-item__desc']}>accuracy</p>
								</li>
								<li className={styles['result-stats-item']}>
									<h3 className={styles['result-stats-item__title']}>{consistency}%</h3>
									<p className={styles['result-stats-item__desc']}>consistency</p>
								</li>
								<li className={styles['result-stats-item']}>
									<h3 className={styles['result-stats-item__title']}>{time}s</h3>
									<p className={styles['result-stats-item__desc']}>time</p>
								</li>
							</ul>
						</div>
						<div className={styles['result-ad']}>
							<Ad />
						</div>
						<div className={styles['result-chart']}>
							<ResultWpmChart wpmPerTimeArr={wpmPerTimeArr} />
						</div>
					</div>
				</>
			}
		/>
	) : (
		<></>
	)
}

export default TypingResult
