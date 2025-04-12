import { FC } from 'react'

import s from './Experience.module.scss'

import { UserExperience } from 'types/User'

import CircularProgress from 'components/CircularProgressbar/CircularProgressbar'

type ExperienceProps = {
	info: UserExperience
}

const Experience: FC<ExperienceProps> = ({ info: { level, experience } }) => {
	return (
		<div className={s['experience']}>
			<div className={s['experience__inner']}>
				<h2 className={s['experience__level']}>Level {level}</h2>
				{/* <p className={s['experience__text']}>{experience} / 1000</p> */}
			</div>
			<CircularProgress value={Math.floor((experience / 1000) * 100)} />
		</div>
	)
}

export default Experience
