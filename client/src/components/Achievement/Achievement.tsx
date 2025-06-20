import { FC } from 'react'

import { TAchievement } from 'types/Public'
import { TUserAchievement } from 'types/User'

import AchievementIcon from 'components/icons/Achievement/Achievement'

import styles from './Achievement.module.scss'

interface AchievementProps
	extends Partial<Pick<TUserAchievement, 'completionDate'>>,
		Omit<TAchievement, 'experienceGained'> {}

const Achievement: FC<AchievementProps> = ({ id, title, description, completionDate }) => {
	return (
		<div className={`${styles['achievement']} ${completionDate ? styles['achievement--completed'] : ''}`}>
			<span className={styles['achievement__number']}>#{id}</span>
			<div className={styles['achievement__icon']}>
				<AchievementIcon color='rgba(#D2FC04, 0.3)' />
			</div>
			<div className={styles['achievement-content']}>
				<div className={styles['achievement-content__header']}>
					<p className={styles['achievement-content__title']}>{title}</p>
					<p className={styles['achievement-content__date']}>{completionDate ?? 'Uncompleted'}</p>
				</div>
				<p className={styles['achievement-content__description']}>{description}</p>
			</div>
		</div>
	)
}

export default Achievement
