import { FC } from 'react'

import { useAppSelector } from 'store/index'

import { selectCurrentTheme } from 'features/Themes/selectors'

type UserIconProps = {
	isStroke?: boolean
	style?: React.CSSProperties
	color?: string
}

const UserIcon: FC<UserIconProps> = ({ isStroke = false, style, color }) => {
	const { accent } = useAppSelector(selectCurrentTheme)

	return (
		<svg style={style} width='54' height='57' viewBox='0 0 54 57' fill='none' xmlns='http://www.w3.org/2000/svg'>
			<path
				className='stroke-primary'
				d='M52.7567 56.1566C51.24 51.9033 47.89 48.1466 43.2334 45.4666C38.5767 42.7866 32.87 41.3333 27 41.3333C21.13 41.3333 15.4233 42.7866 10.7667 45.4666C6.11 48.1466 2.76 51.9033 1.24333 56.1566'
				fill={!isStroke ? color ?? accent : ''}
				stroke={isStroke ? color ?? accent : ''}
				strokeLinecap='round'
			/>
			<path
				className='stroke-primary'
				d='M27 28C34.3638 28 40.3333 22.0304 40.3333 14.6666C40.3333 7.30285 34.3638 1.33331 27 1.33331C19.6362 1.33331 13.6667 7.30285 13.6667 14.6666C13.6667 22.0304 19.6362 28 27 28Z'
				fill={!isStroke ? color ?? accent : ''}
				stroke={isStroke ? color ?? accent : ''}
				strokeLinecap='round'
			/>
		</svg>
	)
}

export default UserIcon
