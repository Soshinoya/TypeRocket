import { FC } from 'react'

import { TAchievement, TUserAchievement } from 'types/Public'

import AchievementIcon from 'components/icons/Achievement/Achievement'

import { getDate } from 'utils/utils'

import styles from './Achievement.module.scss'

interface AchievementProps extends Omit<TAchievement, 'experienceGained'> {
	completedAchievement: TUserAchievement | null
}

const Achievement: FC<AchievementProps> = ({ id, title, description, completedAchievement }) => {
	const completion_date = completedAchievement?.completion_date || 'Uncompleted'
	return (
		<div className={`${styles['achievement']} ${completedAchievement ? styles['achievement--completed'] : ''}`}>
			<span className={styles['achievement__number']}>#{id}</span>
			<div className={styles['achievement__icon']}>
				<AchievementIcon color='rgba(#D2FC04, 0.3)' />
			</div>
			<div className={styles['achievement-content']}>
				<div className={styles['achievement-content__header']}>
					<p className={styles['achievement-content__title']}>{title}</p>
					<p className={styles['achievement-content__date']}>
						{completedAchievement ? getDate(new Date(completion_date)) : completion_date}
					</p>
				</div>
				<p className={styles['achievement-content__description']}>{description}</p>
			</div>
		</div>
	)
}

export default Achievement
