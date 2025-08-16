import { FC } from 'react'

type CrossProps = {
	style?: React.CSSProperties
	color?: string
}

const Cross: FC<CrossProps> = ({ style, color = 'rgba(#fff, 0.3)' }) => {
	return (
		<svg style={style} xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'>
			<path fill='none' stroke={color} strokeLinecap='round' strokeWidth='2' d='M20 20L4 4m16 0L4 20' />
		</svg>
	)
}

export default Cross
