import { FC } from 'react'

type RestartIconProps = {
	style?: React.CSSProperties
	color?: string
}

const RestartIcon: FC<RestartIconProps> = ({ style, color = '#404D01' }) => {
	return (
		<svg style={style} width='18' height='19' viewBox='0 0 18 19' fill='none' xmlns='http://www.w3.org/2000/svg'>
			<path
				d='M15.2581 0.507966C15.3951 0.564735 15.5123 0.660878 15.5947 0.784233C15.6771 0.907588 15.7211 1.05261 15.7211 1.20097V5.44397C15.7211 5.64288 15.642 5.83364 15.5014 5.9743C15.3607 6.11495 15.17 6.19397 14.9711 6.19397H10.7281C10.5798 6.19384 10.4349 6.14978 10.3117 6.06736C10.1885 5.98494 10.0925 5.86785 10.0358 5.73089C9.97906 5.59393 9.96421 5.44323 9.99309 5.29783C10.022 5.15243 10.0933 5.01885 10.1981 4.91397L11.8001 3.30997C10.3285 2.69374 8.69479 2.5801 7.1521 2.98666C5.60941 3.39322 4.2439 4.29728 3.26718 5.55871C2.29047 6.82015 1.75711 8.36852 1.74976 9.96387C1.7424 11.5592 2.26146 13.1124 3.2265 14.3828C4.19154 15.6532 5.54866 16.5698 7.08754 16.9906C8.62641 17.4114 10.2611 17.3128 11.7383 16.7102C13.2154 16.1075 14.4526 15.0345 15.258 13.6574C16.0634 12.2802 16.3921 10.6759 16.1931 9.09297C16.1724 8.89772 16.2292 8.70217 16.3512 8.54832C16.4732 8.39447 16.6506 8.29457 16.8454 8.27009C17.0402 8.24561 17.2368 8.29849 17.3931 8.41738C17.5493 8.53627 17.6527 8.71169 17.6811 8.90597C17.9245 10.8421 17.5137 12.8041 16.514 14.48C15.5143 16.1559 13.9831 17.4495 12.1637 18.1552C10.3444 18.8609 8.34135 18.9382 6.47305 18.3748C4.60475 17.8113 2.9784 16.6396 1.85255 15.0457C0.726689 13.4518 0.165942 11.5273 0.259445 9.57815C0.352947 7.62898 1.09533 5.767 2.36859 4.28821C3.64184 2.80942 5.37288 1.79869 7.28654 1.4167C9.20019 1.0347 11.1866 1.30336 12.9301 2.17997L14.4401 0.669966C14.545 0.565243 14.6786 0.493963 14.824 0.465129C14.9694 0.436296 15.1211 0.451202 15.2581 0.507966Z'
				fill={color}
			/>
		</svg>
	)
}

export default RestartIcon