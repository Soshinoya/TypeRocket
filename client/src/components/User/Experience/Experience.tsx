import { FC } from 'react'

import s from './Experience.module.scss'

import { TUserExperience } from 'types/User'

import CircularProgress from 'components/CircularProgressbar/CircularProgressbar'

type ExperienceProps = {
	info: TUserExperience
}

const Experience: FC<ExperienceProps> = ({ info: { level, progress } }) => {
	return (
		<div className={s['experience']}>
			<div className={s['experience__inner']}>
				<h2 className={s['experience__level']}>Level {level}</h2>
				<p className={s['experience__text']}>{progress} / 1000</p>
			</div>
			<div className={s['experience__diagram']}>
				<CircularProgress value={Math.floor((progress / 1000) * 100)} />
			</div>
		</div>
	)
}

export default Experience
