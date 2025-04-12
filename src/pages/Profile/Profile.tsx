import { FC } from 'react'

import s from './Profile.module.scss'

import { UserExperience } from 'types/User'

import UserIcon from 'components/icons/UserIcon/UserIcon'
import Experience from 'components/User/Experience/Experience'

type ProfileProps = {}

const Profile: FC<ProfileProps> = () => {
	const experienceInfo: UserExperience = {
		level: 114,
		experience: 721,
	}

	return (
		<div className={s['profile__wrapper']}>
			<div className={s['header']}>
				<div className={s['profile']}>
					<div className={s['profile__img']}>
						<UserIcon isStroke={true} color='#d2fc04' />
					</div>
					<div className={s['profile__inner']}>
						<h2 className={s['profile__name']}>Soshinoya</h2>
						<p className={s['profile__text']}>Joined 08 Dec 2023</p>
					</div>
				</div>
				<div className={s['experience']}>
					<Experience info={experienceInfo} />
				</div>
			</div>
			<div className={s['detailed-info']}></div>
		</div>
	)
}

export default Profile
