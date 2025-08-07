import React, { FC, useEffect } from 'react'
import { nanoid } from '@reduxjs/toolkit'

import { useAppDispatch, useAppSelector } from 'store/index'

import { setNotificationAction } from 'features/Notification/reducer'
import {
	selectAccessToken,
	selectBestResults,
	selectExperience,
	selectAchievements,
	selectUserAchievements,
	selectMetrics,
} from 'features/CurrentUser/selectors'
import {
	setActivity,
	setBestResults,
	setExperience,
	setMetrics,
	setUserAchievements,
} from 'features/CurrentUser/reducer'

import { TAchievement, TUserAchievement } from 'types/Public'
import { Mode } from 'features/TypingZone/types'

import { useAddExperienceMutation } from 'api/Experience/ExperienceApiSlice'
import { useSetActivityMutation } from 'api/Activity/ActivityApiSlice'
import { useSetBestResultsMutation } from 'api/BestResults/BestResultsApiSlice'
import { useUpdateKeystrokesMutation } from 'api/UserMetrics/UserMetrics'
import { useAddCompletedAchievementMutation } from 'api/Achievements/Achievements'

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

type TypingResultProps = {
	wpm: number
	rawWpm: number
	accuracy: number
	consistency: number
	errorCount: number
	time: number
	wpmPerTimeArr: { time: number; wpm: number; rawWpm: number }[]
	keystrokes: number
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
	keystrokes,
	isOpen,
	setIsOpen,
}) => {
	const dispatch = useAppDispatch()

	const hasPunctuation = useAppSelector(selectIsPunctuation)
	const hasNumbers = useAppSelector(selectIsNumbers)
	const mode = useAppSelector(selectMode)
	const wordOptions = useAppSelector(selectWordOptions)
	const timeOptions = useAppSelector(selectTimeOptions)

	const accessToken = useAppSelector(selectAccessToken)

	const bestResults = useAppSelector(selectBestResults)

	const currentExperience = useAppSelector(selectExperience)

	const oldMetrics = useAppSelector(selectMetrics)

	const achievements = useAppSelector(selectAchievements)
	const userAchievements = useAppSelector(selectUserAchievements)

	const [addExperienceMutation] = useAddExperienceMutation()

	const [setActivityMutation] = useSetActivityMutation()

	const [setBestResultsMutation] = useSetBestResultsMutation()

	const [addKeystrokesMutation] = useUpdateKeystrokesMutation()

	const [addCompletedAchievementMutation] = useAddCompletedAchievementMutation()

	useIsEscapePress(setIsOpen)

	const defineTestName = () => {
		let testName = 'test_15s'

		;[...wordOptions, ...timeOptions].forEach(({ count, enabled }) => {
			if (!enabled) return
			testName = `test_${count}${mode === Mode['words'] ? 'w' : 's'}`
		})

		return testName
	}

	const addExperience = async (earnedXP: number) => {
		if (!currentExperience) return

		const { level, progress } = increaseExperience(earnedXP, currentExperience.progress)

		const { data } = await addExperienceMutation({
			accessToken,
			level: currentExperience.level + level,
			progress,
		})

		if (data) dispatch(setExperience({ level: data.level, progress: data.progress }))
	}

	const addActivityPoint = async () => {
		const { data } = await setActivityMutation({ accessToken })
		if (data) dispatch(setActivity(data))
	}

	const addBestResult = async () => {
		const testName = defineTestName()
		const currentBestResult = bestResults.find(result => result.testName === testName)
		if (currentBestResult?.resultMetrics.wpm || 0 < wpm) {
			const newBestResult = {
				accessToken,
				testName,
				resultMetrics: { wpm, rawWpm, accuracy, consistency },
			}
			await setBestResultsMutation(newBestResult)
			dispatch(setBestResults(newBestResult))
		}
	}

	const addKeystrokes = async () => {
		const { data } = await addKeystrokesMutation({ accessToken, keystrokes })
		if (data) dispatch(setMetrics(data || null))
	}

	const defineAchievements = (): TAchievement[] => {
		if (!achievements || !oldMetrics) return []

		const completedIds = userAchievements?.map(ua => ua.achievement_id) || []
		const completedSet = new Set(completedIds)

		return achievements.filter(achievement => {
			if (completedSet.has(achievement.id)) return false

			switch (achievement.type) {
				case 'keystrokes':
					return oldMetrics.keystrokes + keystrokes >= achievement.target
				default:
					return false
			}
		})
	}

	const addCompletedAchievement = async (achievement: TAchievement): Promise<TUserAchievement | null> => {
		const { id, title, description } = achievement
		const { data } = await addCompletedAchievementMutation({
			accessToken,
			achievement_id: id,
		})

		return data
			? {
					achievement_id: id,
					completion_date: data.completion_date,
					title,
					description,
			  }
			: null
	}

	useEffect(() => {
		if (!isOpen || !accessToken) return

		const completeTest = async () => {
			const earnedXP = computeExperience({
				hasPunctuation,
				hasNumbers,
				mode,
				count: [...wordOptions, ...timeOptions].find(({ enabled }) => enabled)?.count || wordOptions[0].count,
				wpm,
				accuracy,
				consistency,
				errorCount,
				xpMultiplier: 25,
			})

			let experienceForAchievements = 0

			await addActivityPoint()
			await addBestResult()
			await addKeystrokes()

			const newAchievements = defineAchievements()
			if (!newAchievements.length) {
				showCompletionNotification(earnedXP)
				return
			}

			const newUserAchievements: TUserAchievement[] = []

			for (const achievement of newAchievements) {
				const completed = await addCompletedAchievement(achievement)

				if (!completed) continue

				newUserAchievements.push(completed)
				experienceForAchievements += achievement.experience_gained
				showAchievementNotification(achievement.experience_gained)
			}

			await addExperience(earnedXP + experienceForAchievements)

			dispatch(setUserAchievements([...(userAchievements || []), ...newUserAchievements]))

			showCompletionNotification(earnedXP)
		}

		completeTest()
	}, [isOpen, accessToken])

	// Вспомогательные функции для уведомлений
	const showAchievementNotification = (xp: number) => {
		dispatch(
			setNotificationAction({
				id: nanoid(10),
				title: 'New Achievement',
				subtitle: `You have gained ${xp} experience points`,
				status: 'success',
			})
		)
	}

	const showCompletionNotification = (xp: number) => {
		dispatch(
			setNotificationAction({
				id: nanoid(10),
				title: 'Test completed',
				subtitle: `You have gained ${xp} experience points`,
				status: 'success',
			})
		)
	}

	return isOpen ? (
		<Modal
			isOpen={isOpen}
			setIsOpen={setIsOpen}
			style={{
				width: window.matchMedia('(max-width: 1024px)').matches ? '90%' : 'auto',
				height: 'auto',
				padding: '30px',
			}}
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
