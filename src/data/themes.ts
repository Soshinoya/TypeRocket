import { SingleTheme } from 'features/Themes/types'

export const themes: SingleTheme[] = [
	{
		id: 'default',
		title: 'Orange Green',
		primaryLight: '#eaf2c2',
		primary: '#d2fc04',
		primarySemiBold: '#404d01',
		primaryBold: '#111400',
		accentLight: '#f2d0c2',
		accent: '#fa5b17',
		accentSemiBold: '#4d1c07',
	},
	{
		id: 'ez_mode',
		title: 'ez mode',
		primaryLight: '#B0D9FC',
		primary: '#138BF7',
		primarySemiBold: '#004a8d',
		primaryBold: '#002e53',
		accentLight: '#FCB1E9',
		accent: '#FA62D5',
		accentSemiBold: '#63034B',
	},
	{
		id: 'sea_freshness',
		title: 'Sea Freshness',
		primaryLight: '#E1EBE7',
		primary: '#3e3f3e',
		primarySemiBold: '#717977',
		primaryBold: '#b2d2c8',
		accentLight: '#BD887F',
		accent: '#C13117',
		accentSemiBold: '#490909',
	},
	{
		id: 'dusty_rosewood',
		title: 'Dusty Rosewood',
		primaryLight: '#DAD3C8',
		primary: '#64374D',
		primarySemiBold: '#807463',
		primaryBold: '#C6B294',
		accentLight: '#838E8A',
		accent: '#405A52',
		accentSemiBold: '#091914',
	},
	{
		id: 'lime_surge',
		title: 'Lime Surge',
		primaryLight: '#EEF7FF',
		primary: '#BFCFDC',
		primarySemiBold: '#7C878E',
		primaryBold: '#4B5257',
		accentLight: '#B5C59C',
		accent: '#93C247',
		accentSemiBold: '#3A4A20',
	},
	{
		id: 'dark_beach',
		title: 'Dark Beach',
		primaryLight: '#972fff',
		primary: '#ebd7ff',
		primarySemiBold: '#633a8c',
		primaryBold: '#000',
		accentLight: '#D8B9F7',
		accent: '#c58aff',
		accentSemiBold: '#1e001e',
	},
	// {
	// 	id: '',
	// 	title: '',
	// 	primaryLight: '#',
	// 	primary: '#',
	// 	primarySemiBold: '#',
	// 	primaryBold: '#',
	// 	accentLight: '#',
	// 	accent: '#',
	// 	accentSemiBold: '#',
	// },
].sort((a, b) => {
	if (a.title.toLowerCase() < b.title.toLowerCase()) {
		return -1
	}
	if (a.title.toLowerCase() > b.title.toLowerCase()) {
		return 1
	}
	return 0
})
