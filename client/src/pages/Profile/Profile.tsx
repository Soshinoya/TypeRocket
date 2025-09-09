import { FC, useEffect, useState } from 'react'

import s from './Profile.module.scss'

import { useAppSelector } from 'store/index'

import {
	selectAchievements,
	selectActivity,
	selectBestResults,
	selectCurrentUser,
	selectExperience,
	selectUserAchievements,
} from 'features/CurrentUser/selectors'
import { selectCurrentTheme } from 'features/Themes/selectors'

import { TAchievement } from 'types/Public'

import { limitText } from 'utils/utils'

import Experience from 'components/User/Experience/Experience'
import Achievement from 'components/Achievement/Achievement'
import Progressbar from 'components/Progressbar/Progressbar'
import ActivityGraph from 'components/ActivityGraph/ActivityGraph'
import UserIcon from 'components/icons/UserIcon/UserIcon'

type ProfileProps = {}

const Profile: FC<ProfileProps> = () => {
	const { primary, primarySemiBold, accent } = useAppSelector(selectCurrentTheme)

	const currentUser = useAppSelector(selectCurrentUser)
	const experience = useAppSelector(selectExperience)
	const activity = useAppSelector(selectActivity)
	const bestResults = useAppSelector(selectBestResults)
	const achievements = useAppSelector(selectAchievements)
	const userAchievements = useAppSelector(selectUserAchievements)

	const [userFormattedCreationDate, setUserFormattedCreationDate] = useState('')

	useEffect(() => {
		if (!currentUser?.creation_date) return
		const date = new Date(currentUser.creation_date)
		const formattedDate = new Intl.DateTimeFormat('en-GB', {
			day: 'numeric',
			month: 'short',
			year: 'numeric',
		}).format(date)
		setUserFormattedCreationDate(formattedDate)
	}, [currentUser?.creation_date])

	const getCompletedAchievement = (id: TAchievement['id']) => {
		if (!userAchievements) return null
		return userAchievements.find(({ achievement_id }) => achievement_id === id) || null
	}

	const limitTextHandler = () => {
		let text = limitText(currentUser?.username || 'TypeRocket User', 30)
		if (window.matchMedia('(max-width: 920px)').matches) {
			text = limitText(currentUser?.username || 'TypeRocket User', 10)
		} else if (window.matchMedia('(max-width: 1060px)').matches) {
			text = limitText(currentUser?.username || 'TypeRocket User', 20)
		}
		return text
	}

	return (
		<div className={s['profile__wrapper']}>
			<div className={s['header']}>
				<div className={s['profile']}>
					<div className={s['profile__img']}>
						<UserIcon isStroke={true} color={primary} />
					</div>
					<div className={s['profile__inner']}>
						<h2 className={s['profile__name']}>{limitTextHandler()}</h2>
						{userFormattedCreationDate && (
							<p className={s['profile__text']}>Joined {userFormattedCreationDate}</p>
						)}
					</div>
				</div>
				<Experience info={experience || { level: 0, progress: 0 }} />
			</div>
			<div className={s['detailed-info']}>
				<div className={s['bio']}>
					<h3 className={s['bio__title']}>Bio</h3>
					<p className={s['bio__description']}>
						{currentUser?.description || 'Hey there! I am using TypeRocket'}
					</p>
				</div>
				{activity && (
					<ActivityGraph
						dataTooltipId='activity-calendar-tooltip'
						config={{
							data: activity,
							blockMargin: 6,
							blockSize: 10,
							fontSize: 16,
							colorScheme: 'dark',
							theme: {
								light: ['#f0f0f0', accent],
								dark: [primarySemiBold, accent],
							},
							weekStart: 1,
							showWeekdayLabels: true,
							style: {
								color: primary,
								textTransform: 'lowercase',
								gap: '160px !important',
							},
							// loading: true
						}}
					/>
				)}
			</div>
			<div className={s['statistic__wrapper']}>
				<div className={s['statistic']}>
					<div className={s['statistic__item']}>
						<h4 className={s['statistic__title']}>
							{bestResults.find(({ testName }) => testName === 'test_10w')?.resultMetrics.wpm || '-'}
						</h4>
						<p className={s['statistic__subtitle']}>10 words</p>
					</div>
					<div className={s['statistic__item']}>
						<h4 className={s['statistic__title']}>
							{bestResults.find(({ testName }) => testName === 'test_20w')?.resultMetrics.wpm || '-'}
						</h4>
						<p className={s['statistic__subtitle']}>20 words</p>
					</div>
					<div className={s['statistic__item']}>
						<h4 className={s['statistic__title']}>
							{bestResults.find(({ testName }) => testName === 'test_40w')?.resultMetrics.wpm || '-'}
						</h4>
						<p className={s['statistic__subtitle']}>40 words</p>
					</div>
					<div className={s['statistic__item']}>
						<h4 className={s['statistic__title']}>
							{bestResults.find(({ testName }) => testName === 'test_80w')?.resultMetrics.wpm || '-'}
						</h4>
						<p className={s['statistic__subtitle']}>80 words</p>
					</div>
				</div>
				<div className={s['statistic']}>
					<div className={s['statistic__item']}>
						<h4 className={s['statistic__title']}>
							{bestResults.find(({ testName }) => testName === 'test_15s')?.resultMetrics.wpm || '-'}
						</h4>
						<p className={s['statistic__subtitle']}>15 seconds</p>
					</div>
					<div className={s['statistic__item']}>
						<h4 className={s['statistic__title']}>
							{bestResults.find(({ testName }) => testName === 'test_30s')?.resultMetrics.wpm || '-'}
						</h4>
						<p className={s['statistic__subtitle']}>30 seconds</p>
					</div>
					<div className={s['statistic__item']}>
						<h4 className={s['statistic__title']}>
							{bestResults.find(({ testName }) => testName === 'test_60s')?.resultMetrics.wpm || '-'}
						</h4>
						<p className={s['statistic__subtitle']}>60 seconds</p>
					</div>
					<div className={s['statistic__item']}>
						<h4 className={s['statistic__title']}>
							{bestResults.find(({ testName }) => testName === 'test_120s')?.resultMetrics.wpm || '-'}
						</h4>
						<p className={s['statistic__subtitle']}>120 seconds</p>
					</div>
				</div>
			</div>
			{achievements && (
				<div className={s['achievements']}>
					<div className={s['achievements-header']}>
						<h2 className={s['achievements-header__title']}>Achievements</h2>
						{userAchievements ? (
							<div className={s['achievements-header__progress']}>
								<p>
									Completed {userAchievements.length}/{achievements.length}{' '}
								</p>
								<span>{((userAchievements.length / achievements.length) * 100).toFixed(0)}%</span>
								<Progressbar percentage={(userAchievements.length / achievements.length) * 100} />
							</div>
						) : (
							<div className={s['achievements-header__progress']}>
								Completed 0/{achievements.length} <span>0%</span>
								<Progressbar percentage={0} />
							</div>
						)}
					</div>
					<div className={s['achievements__items']}>
						{achievements.map(({ ...newAchievement }) => (
							<Achievement
								key={newAchievement.id}
								{...newAchievement}
								completedAchievement={getCompletedAchievement(newAchievement.id)}
							/>
						))}
					</div>
				</div>
			)}
		</div>
	)
}

export default Profile
