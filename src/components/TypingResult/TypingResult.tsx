import React, { FC, useEffect } from 'react'

import { useAppSelector } from 'store/index'

import styles from './TypingResult.module.scss'

import Modal from 'components/Modal/Modal'

import Ad from 'components/icons/Ad/Ad'

import Chart from 'components/Chart/Chart'

import {
	selectIsPunctuation,
	selectIsNumbers,
	selectMode,
	selectWordOptions,
	selectTimeOptions,
} from 'features/TypingZone/selectors'

import { getDate } from 'utils/utils'
import { computeExperience } from 'utils/experience'

type TypingResultProps = {
	wpm: number
	rawWpm: number
	acc: number
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
	acc,
	consistency,
	errorCount,
	time,
	wpmPerTimeArr,
	isOpen,
	setIsOpen,
}) => {
	const isPunctuation = useAppSelector(selectIsPunctuation)
	const isNumbers = useAppSelector(selectIsNumbers)
	const mode = useAppSelector(selectMode)
	const wordOptions = useAppSelector(selectWordOptions)
	const timeOptions = useAppSelector(selectTimeOptions)

	useEffect(() => {
		if (isOpen) {
			const earnedXP = computeExperience({
				hasPunctuation: isPunctuation,
				hasNumbers: isNumbers,
				mode: mode,
				count:
					[...wordOptions, ...timeOptions].find(({ enabled }) => enabled === true)?.count ||
					wordOptions[0].count,
				wpm,
				acc,
				consistency,
				errorCount,
			})

			console.log(earnedXP)
		}
	}, [isOpen])

	return (
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
									<h3 className={styles['result-stats-item__title']}>{acc}%</h3>
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
							<Chart
								verticalDataArrays={[
									{
										dataset: wpmPerTimeArr.map(item => item.wpm),
										options: {
											label: 'wpm',
											borderColor: '#fa5b17',
											backgroundColor: '#fa5b17',
										},
									},
									{
										dataset: wpmPerTimeArr.map(item => item.rawWpm),
										options: {
											label: 'raw wpm',
											borderColor: '#d2fc04',
											backgroundColor: '#d2fc04',
										},
									},
								]}
								horizontalDataArr={wpmPerTimeArr.map(item => item.time)}
							/>
						</div>
					</div>
				</>
			}
		/>
	)
}

export default TypingResult
