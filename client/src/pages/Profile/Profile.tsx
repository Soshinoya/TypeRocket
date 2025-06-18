import { FC } from 'react'

import s from './Profile.module.scss'

import { useAppSelector } from 'store/index'

import { selectCurrentUser, selectExperience } from 'features/CurrentUser/selectors'

import { selectCurrentTheme } from 'features/Themes/selectors'

import { TAchievement } from 'types/Public'
import { TUserAchievement } from 'types/User'

import Experience from 'components/User/Experience/Experience'
import Achievement from 'components/Achievement/Achievement'
import Progressbar from 'components/Progressbar/Progressbar'
import ActivityGraph from 'components/ActivityGraph/ActivityGraph'
import UserIcon from 'components/icons/UserIcon/UserIcon'

const data = [
	{
		count: 0,
		date: '2022-06-01',
		level: 0,
	},
	{
		count: 0,
		date: '2022-06-02',
		level: 0,
	},
	{
		count: 0,
		date: '2022-06-03',
		level: 0,
	},
	{
		count: 1,
		date: '2022-06-04',
		level: 1,
	},
	{
		count: 10,
		date: '2022-06-05',
		level: 2,
	},
	{
		count: 0,
		date: '2022-06-06',
		level: 0,
	},
	{
		count: 7,
		date: '2022-06-07',
		level: 2,
	},
	{
		count: 0,
		date: '2022-06-08',
		level: 0,
	},
	{
		count: 0,
		date: '2022-06-09',
		level: 0,
	},
	{
		count: 0,
		date: '2022-06-10',
		level: 0,
	},
	{
		count: 9,
		date: '2022-06-11',
		level: 2,
	},
	{
		count: 7,
		date: '2022-06-12',
		level: 2,
	},
	{
		count: 0,
		date: '2022-06-13',
		level: 0,
	},
	{
		count: 1,
		date: '2022-06-14',
		level: 1,
	},
	{
		count: 3,
		date: '2022-06-15',
		level: 1,
	},
	{
		count: 6,
		date: '2022-06-16',
		level: 2,
	},
	{
		count: 6,
		date: '2022-06-17',
		level: 2,
	},
	{
		count: 0,
		date: '2022-06-18',
		level: 0,
	},
	{
		count: 4,
		date: '2022-06-19',
		level: 1,
	},
	{
		count: 0,
		date: '2022-06-20',
		level: 0,
	},
	{
		count: 5,
		date: '2022-06-21',
		level: 1,
	},
	{
		count: 3,
		date: '2022-06-22',
		level: 1,
	},
	{
		count: 18,
		date: '2022-06-23',
		level: 4,
	},
	{
		count: 9,
		date: '2022-06-24',
		level: 2,
	},
	{
		count: 10,
		date: '2022-06-25',
		level: 2,
	},
	{
		count: 1,
		date: '2022-06-26',
		level: 1,
	},
	{
		count: 9,
		date: '2022-06-27',
		level: 2,
	},
	{
		count: 6,
		date: '2022-06-28',
		level: 2,
	},
	{
		count: 0,
		date: '2022-06-29',
		level: 0,
	},
	{
		count: 6,
		date: '2022-06-30',
		level: 2,
	},
	{
		count: 16,
		date: '2022-07-01',
		level: 4,
	},
	{
		count: 3,
		date: '2022-07-02',
		level: 1,
	},
	{
		count: 8,
		date: '2022-07-03',
		level: 2,
	},
	{
		count: 0,
		date: '2022-07-04',
		level: 0,
	},
	{
		count: 10,
		date: '2022-07-05',
		level: 2,
	},
	{
		count: 0,
		date: '2022-07-06',
		level: 0,
	},
	{
		count: 0,
		date: '2022-07-07',
		level: 0,
	},
	{
		count: 6,
		date: '2022-07-08',
		level: 2,
	},
	{
		count: 0,
		date: '2022-07-09',
		level: 0,
	},
	{
		count: 5,
		date: '2022-07-10',
		level: 1,
	},
	{
		count: 0,
		date: '2022-07-11',
		level: 0,
	},
	{
		count: 2,
		date: '2022-07-12',
		level: 1,
	},
	{
		count: 12,
		date: '2022-07-13',
		level: 3,
	},
	{
		count: 0,
		date: '2022-07-14',
		level: 0,
	},
	{
		count: 7,
		date: '2022-07-15',
		level: 2,
	},
	{
		count: 2,
		date: '2022-07-16',
		level: 1,
	},
	{
		count: 14,
		date: '2022-07-17',
		level: 3,
	},
	{
		count: 6,
		date: '2022-07-18',
		level: 2,
	},
	{
		count: 2,
		date: '2022-07-19',
		level: 1,
	},
	{
		count: 0,
		date: '2022-07-20',
		level: 0,
	},
	{
		count: 11,
		date: '2022-07-21',
		level: 3,
	},
	{
		count: 2,
		date: '2022-07-22',
		level: 1,
	},
	{
		count: 2,
		date: '2022-07-23',
		level: 1,
	},
	{
		count: 13,
		date: '2022-07-24',
		level: 3,
	},
	{
		count: 5,
		date: '2022-07-25',
		level: 1,
	},
	{
		count: 0,
		date: '2022-07-26',
		level: 0,
	},
	{
		count: 0,
		date: '2022-07-27',
		level: 0,
	},
	{
		count: 5,
		date: '2022-07-28',
		level: 1,
	},
	{
		count: 11,
		date: '2022-07-29',
		level: 3,
	},
	{
		count: 0,
		date: '2022-07-30',
		level: 0,
	},
	{
		count: 5,
		date: '2022-07-31',
		level: 1,
	},
	{
		count: 12,
		date: '2022-08-01',
		level: 3,
	},
	{
		count: 0,
		date: '2022-08-02',
		level: 0,
	},
	{
		count: 0,
		date: '2022-08-03',
		level: 0,
	},
	{
		count: 10,
		date: '2022-08-04',
		level: 2,
	},
	{
		count: 0,
		date: '2022-08-05',
		level: 0,
	},
	{
		count: 5,
		date: '2022-08-06',
		level: 1,
	},
	{
		count: 5,
		date: '2022-08-07',
		level: 1,
	},
	{
		count: 2,
		date: '2022-08-08',
		level: 1,
	},
	{
		count: 0,
		date: '2022-08-09',
		level: 0,
	},
	{
		count: 2,
		date: '2022-08-10',
		level: 1,
	},
	{
		count: 0,
		date: '2022-08-11',
		level: 0,
	},
	{
		count: 0,
		date: '2022-08-12',
		level: 0,
	},
	{
		count: 7,
		date: '2022-08-13',
		level: 2,
	},
	{
		count: 14,
		date: '2022-08-14',
		level: 3,
	},
	{
		count: 8,
		date: '2022-08-15',
		level: 2,
	},
	{
		count: 0,
		date: '2022-08-16',
		level: 0,
	},
	{
		count: 0,
		date: '2022-08-17',
		level: 0,
	},
	{
		count: 11,
		date: '2022-08-18',
		level: 3,
	},
	{
		count: 6,
		date: '2022-08-19',
		level: 2,
	},
	{
		count: 5,
		date: '2022-08-20',
		level: 1,
	},
	{
		count: 0,
		date: '2022-08-21',
		level: 0,
	},
	{
		count: 2,
		date: '2022-08-22',
		level: 1,
	},
	{
		count: 0,
		date: '2022-08-23',
		level: 0,
	},
	{
		count: 5,
		date: '2022-08-24',
		level: 1,
	},
	{
		count: 0,
		date: '2022-08-25',
		level: 0,
	},
	{
		count: 0,
		date: '2022-08-26',
		level: 0,
	},
	{
		count: 13,
		date: '2022-08-27',
		level: 3,
	},
	{
		count: 0,
		date: '2022-08-28',
		level: 0,
	},
	{
		count: 17,
		date: '2022-08-29',
		level: 4,
	},
	{
		count: 9,
		date: '2022-08-30',
		level: 2,
	},
	{
		count: 0,
		date: '2022-08-31',
		level: 0,
	},
	{
		count: 0,
		date: '2022-09-01',
		level: 0,
	},
	{
		count: 4,
		date: '2022-09-02',
		level: 1,
	},
	{
		count: 10,
		date: '2022-09-03',
		level: 2,
	},
	{
		count: 0,
		date: '2022-09-04',
		level: 0,
	},
	{
		count: 0,
		date: '2022-09-05',
		level: 0,
	},
	{
		count: 12,
		date: '2022-09-06',
		level: 3,
	},
	{
		count: 0,
		date: '2022-09-07',
		level: 0,
	},
	{
		count: 5,
		date: '2022-09-08',
		level: 1,
	},
	{
		count: 0,
		date: '2022-09-09',
		level: 0,
	},
	{
		count: 0,
		date: '2022-09-10',
		level: 0,
	},
	{
		count: 10,
		date: '2022-09-11',
		level: 2,
	},
	{
		count: 0,
		date: '2022-09-12',
		level: 0,
	},
	{
		count: 5,
		date: '2022-09-13',
		level: 1,
	},
	{
		count: 6,
		date: '2022-09-14',
		level: 2,
	},
	{
		count: 16,
		date: '2022-09-15',
		level: 4,
	},
	{
		count: 12,
		date: '2022-09-16',
		level: 3,
	},
	{
		count: 0,
		date: '2022-09-17',
		level: 0,
	},
	{
		count: 0,
		date: '2022-09-18',
		level: 0,
	},
	{
		count: 0,
		date: '2022-09-19',
		level: 0,
	},
	{
		count: 8,
		date: '2022-09-20',
		level: 2,
	},
	{
		count: 6,
		date: '2022-09-21',
		level: 2,
	},
	{
		count: 0,
		date: '2022-09-22',
		level: 0,
	},
	{
		count: 0,
		date: '2022-09-23',
		level: 0,
	},
	{
		count: 9,
		date: '2022-09-24',
		level: 2,
	},
	{
		count: 0,
		date: '2022-09-25',
		level: 0,
	},
	{
		count: 0,
		date: '2022-09-26',
		level: 0,
	},
	{
		count: 4,
		date: '2022-09-27',
		level: 1,
	},
	{
		count: 11,
		date: '2022-09-28',
		level: 3,
	},
	{
		count: 4,
		date: '2022-09-29',
		level: 1,
	},
	{
		count: 10,
		date: '2022-09-30',
		level: 2,
	},
	{
		count: 3,
		date: '2022-10-01',
		level: 1,
	},
	{
		count: 0,
		date: '2022-10-02',
		level: 0,
	},
	{
		count: 9,
		date: '2022-10-03',
		level: 2,
	},
	{
		count: 0,
		date: '2022-10-04',
		level: 0,
	},
	{
		count: 8,
		date: '2022-10-05',
		level: 2,
	},
	{
		count: 0,
		date: '2022-10-06',
		level: 0,
	},
	{
		count: 0,
		date: '2022-10-07',
		level: 0,
	},
	{
		count: 0,
		date: '2022-10-08',
		level: 0,
	},
	{
		count: 9,
		date: '2022-10-09',
		level: 2,
	},
	{
		count: 0,
		date: '2022-10-10',
		level: 0,
	},
	{
		count: 1,
		date: '2022-10-11',
		level: 1,
	},
	{
		count: 0,
		date: '2022-10-12',
		level: 0,
	},
	{
		count: 0,
		date: '2022-10-13',
		level: 0,
	},
	{
		count: 0,
		date: '2022-10-14',
		level: 0,
	},
	{
		count: 4,
		date: '2022-10-15',
		level: 1,
	},
	{
		count: 9,
		date: '2022-10-16',
		level: 2,
	},
	{
		count: 0,
		date: '2022-10-17',
		level: 0,
	},
	{
		count: 0,
		date: '2022-10-18',
		level: 0,
	},
	{
		count: 2,
		date: '2022-10-19',
		level: 1,
	},
	{
		count: 13,
		date: '2022-10-20',
		level: 3,
	},
	{
		count: 0,
		date: '2022-10-21',
		level: 0,
	},
	{
		count: 2,
		date: '2022-10-22',
		level: 1,
	},
	{
		count: 0,
		date: '2022-10-23',
		level: 0,
	},
	{
		count: 4,
		date: '2022-10-24',
		level: 1,
	},
	{
		count: 11,
		date: '2022-10-25',
		level: 3,
	},
	{
		count: 0,
		date: '2022-10-26',
		level: 0,
	},
	{
		count: 8,
		date: '2022-10-27',
		level: 2,
	},
	{
		count: 1,
		date: '2022-10-28',
		level: 1,
	},
	{
		count: 3,
		date: '2022-10-29',
		level: 1,
	},
	{
		count: 0,
		date: '2022-10-30',
		level: 0,
	},
	{
		count: 4,
		date: '2022-10-31',
		level: 1,
	},
	{
		count: 1,
		date: '2022-11-01',
		level: 1,
	},
	{
		count: 0,
		date: '2022-11-02',
		level: 0,
	},
	{
		count: 4,
		date: '2022-11-03',
		level: 1,
	},
	{
		count: 0,
		date: '2022-11-04',
		level: 0,
	},
	{
		count: 8,
		date: '2022-11-05',
		level: 2,
	},
	{
		count: 0,
		date: '2022-11-06',
		level: 0,
	},
	{
		count: 8,
		date: '2022-11-07',
		level: 2,
	},
	{
		count: 0,
		date: '2022-11-08',
		level: 0,
	},
	{
		count: 5,
		date: '2022-11-09',
		level: 1,
	},
	{
		count: 1,
		date: '2022-11-10',
		level: 1,
	},
	{
		count: 14,
		date: '2022-11-11',
		level: 3,
	},
	{
		count: 3,
		date: '2022-11-12',
		level: 1,
	},
	{
		count: 4,
		date: '2022-11-13',
		level: 1,
	},
	{
		count: 3,
		date: '2022-11-14',
		level: 1,
	},
	{
		count: 0,
		date: '2022-11-15',
		level: 0,
	},
	{
		count: 5,
		date: '2022-11-16',
		level: 1,
	},
	{
		count: 13,
		date: '2022-11-17',
		level: 3,
	},
	{
		count: 4,
		date: '2022-11-18',
		level: 1,
	},
	{
		count: 0,
		date: '2022-11-19',
		level: 0,
	},
	{
		count: 16,
		date: '2022-11-20',
		level: 4,
	},
	{
		count: 5,
		date: '2022-11-21',
		level: 1,
	},
	{
		count: 10,
		date: '2022-11-22',
		level: 2,
	},
	{
		count: 0,
		date: '2022-11-23',
		level: 0,
	},
	{
		count: 6,
		date: '2022-11-24',
		level: 2,
	},
	{
		count: 0,
		date: '2022-11-25',
		level: 0,
	},
	{
		count: 7,
		date: '2022-11-26',
		level: 2,
	},
	{
		count: 0,
		date: '2022-11-27',
		level: 0,
	},
	{
		count: 0,
		date: '2022-11-28',
		level: 0,
	},
	{
		count: 6,
		date: '2022-11-29',
		level: 2,
	},
	{
		count: 2,
		date: '2022-11-30',
		level: 1,
	},
	{
		count: 3,
		date: '2022-12-01',
		level: 1,
	},
	{
		count: 0,
		date: '2022-12-02',
		level: 0,
	},
	{
		count: 0,
		date: '2022-12-03',
		level: 0,
	},
	{
		count: 0,
		date: '2022-12-04',
		level: 0,
	},
	{
		count: 0,
		date: '2022-12-05',
		level: 0,
	},
	{
		count: 0,
		date: '2022-12-06',
		level: 0,
	},
	{
		count: 0,
		date: '2022-12-07',
		level: 0,
	},
	{
		count: 5,
		date: '2022-12-08',
		level: 1,
	},
	{
		count: 4,
		date: '2022-12-09',
		level: 1,
	},
	{
		count: 9,
		date: '2022-12-10',
		level: 2,
	},
	{
		count: 4,
		date: '2022-12-11',
		level: 1,
	},
	{
		count: 7,
		date: '2022-12-12',
		level: 2,
	},
	{
		count: 8,
		date: '2022-12-13',
		level: 2,
	},
	{
		count: 2,
		date: '2022-12-14',
		level: 1,
	},
	{
		count: 0,
		date: '2022-12-15',
		level: 0,
	},
	{
		count: 0,
		date: '2022-12-16',
		level: 0,
	},
	{
		count: 15,
		date: '2022-12-17',
		level: 3,
	},
	{
		count: 7,
		date: '2022-12-18',
		level: 2,
	},
	{
		count: 4,
		date: '2022-12-19',
		level: 1,
	},
	{
		count: 12,
		date: '2022-12-20',
		level: 3,
	},
	{
		count: 11,
		date: '2022-12-21',
		level: 3,
	},
	{
		count: 5,
		date: '2022-12-22',
		level: 1,
	},
	{
		count: 13,
		date: '2022-12-23',
		level: 3,
	},
	{
		count: 0,
		date: '2022-12-24',
		level: 0,
	},
	{
		count: 0,
		date: '2022-12-25',
		level: 0,
	},
	{
		count: 1,
		date: '2022-12-26',
		level: 1,
	},
	{
		count: 2,
		date: '2022-12-27',
		level: 1,
	},
	{
		count: 4,
		date: '2022-12-28',
		level: 1,
	},
	{
		count: 7,
		date: '2022-12-29',
		level: 2,
	},
	{
		count: 7,
		date: '2022-12-30',
		level: 2,
	},
	{
		count: 6,
		date: '2022-12-31',
		level: 2,
	},
	{
		count: 4,
		date: '2023-01-01',
		level: 1,
	},
	{
		count: 0,
		date: '2023-01-02',
		level: 0,
	},
	{
		count: 11,
		date: '2023-01-03',
		level: 3,
	},
	{
		count: 13,
		date: '2023-01-04',
		level: 3,
	},
	{
		count: 0,
		date: '2023-01-05',
		level: 0,
	},
	{
		count: 3,
		date: '2023-01-06',
		level: 1,
	},
	{
		count: 6,
		date: '2023-01-07',
		level: 2,
	},
	{
		count: 0,
		date: '2023-01-08',
		level: 0,
	},
	{
		count: 7,
		date: '2023-01-09',
		level: 2,
	},
	{
		count: 15,
		date: '2023-01-10',
		level: 3,
	},
	{
		count: 9,
		date: '2023-01-11',
		level: 2,
	},
	{
		count: 9,
		date: '2023-01-12',
		level: 2,
	},
	{
		count: 0,
		date: '2023-01-13',
		level: 0,
	},
	{
		count: 6,
		date: '2023-01-14',
		level: 2,
	},
	{
		count: 0,
		date: '2023-01-15',
		level: 0,
	},
	{
		count: 6,
		date: '2023-01-16',
		level: 2,
	},
	{
		count: 2,
		date: '2023-01-17',
		level: 1,
	},
	{
		count: 15,
		date: '2023-01-18',
		level: 3,
	},
	{
		count: 8,
		date: '2023-01-19',
		level: 2,
	},
	{
		count: 0,
		date: '2023-01-20',
		level: 0,
	},
	{
		count: 6,
		date: '2023-01-21',
		level: 2,
	},
	{
		count: 1,
		date: '2023-01-22',
		level: 1,
	},
	{
		count: 4,
		date: '2023-01-23',
		level: 1,
	},
	{
		count: 4,
		date: '2023-01-24',
		level: 1,
	},
	{
		count: 0,
		date: '2023-01-25',
		level: 0,
	},
	{
		count: 2,
		date: '2023-01-26',
		level: 1,
	},
	{
		count: 0,
		date: '2023-01-27',
		level: 0,
	},
	{
		count: 0,
		date: '2023-01-28',
		level: 0,
	},
	{
		count: 0,
		date: '2023-01-29',
		level: 0,
	},
	{
		count: 0,
		date: '2023-01-30',
		level: 0,
	},
	{
		count: 4,
		date: '2023-01-31',
		level: 1,
	},
	{
		count: 4,
		date: '2023-02-01',
		level: 1,
	},
	{
		count: 10,
		date: '2023-02-02',
		level: 2,
	},
	{
		count: 15,
		date: '2023-02-03',
		level: 3,
	},
	{
		count: 1,
		date: '2023-02-04',
		level: 1,
	},
	{
		count: 5,
		date: '2023-02-05',
		level: 1,
	},
	{
		count: 0,
		date: '2023-02-06',
		level: 0,
	},
	{
		count: 0,
		date: '2023-02-07',
		level: 0,
	},
	{
		count: 6,
		date: '2023-02-08',
		level: 2,
	},
	{
		count: 15,
		date: '2023-02-09',
		level: 3,
	},
	{
		count: 10,
		date: '2023-02-10',
		level: 2,
	},
	{
		count: 3,
		date: '2023-02-11',
		level: 1,
	},
	{
		count: 0,
		date: '2023-02-12',
		level: 0,
	},
	{
		count: 0,
		date: '2023-02-13',
		level: 0,
	},
	{
		count: 3,
		date: '2023-02-14',
		level: 1,
	},
	{
		count: 0,
		date: '2023-02-15',
		level: 0,
	},
	{
		count: 0,
		date: '2023-02-16',
		level: 0,
	},
	{
		count: 3,
		date: '2023-02-17',
		level: 1,
	},
	{
		count: 0,
		date: '2023-02-18',
		level: 0,
	},
	{
		count: 9,
		date: '2023-02-19',
		level: 2,
	},
	{
		count: 0,
		date: '2023-02-20',
		level: 0,
	},
	{
		count: 0,
		date: '2023-02-21',
		level: 0,
	},
	{
		count: 10,
		date: '2023-02-22',
		level: 2,
	},
	{
		count: 10,
		date: '2023-02-23',
		level: 2,
	},
	{
		count: 13,
		date: '2023-02-24',
		level: 3,
	},
	{
		count: 0,
		date: '2023-02-25',
		level: 0,
	},
	{
		count: 13,
		date: '2023-02-26',
		level: 3,
	},
	{
		count: 2,
		date: '2023-02-27',
		level: 1,
	},
	{
		count: 2,
		date: '2023-02-28',
		level: 1,
	},
	{
		count: 0,
		date: '2023-03-01',
		level: 0,
	},
	{
		count: 0,
		date: '2023-03-02',
		level: 0,
	},
	{
		count: 5,
		date: '2023-03-03',
		level: 1,
	},
	{
		count: 0,
		date: '2023-03-04',
		level: 0,
	},
	{
		count: 0,
		date: '2023-03-05',
		level: 0,
	},
	{
		count: 2,
		date: '2023-03-06',
		level: 1,
	},
	{
		count: 4,
		date: '2023-03-07',
		level: 1,
	},
	{
		count: 0,
		date: '2023-03-08',
		level: 0,
	},
	{
		count: 0,
		date: '2023-03-09',
		level: 0,
	},
	{
		count: 0,
		date: '2023-03-10',
		level: 0,
	},
	{
		count: 10,
		date: '2023-03-11',
		level: 2,
	},
	{
		count: 9,
		date: '2023-03-12',
		level: 2,
	},
	{
		count: 0,
		date: '2023-03-13',
		level: 0,
	},
	{
		count: 0,
		date: '2023-03-14',
		level: 0,
	},
	{
		count: 5,
		date: '2023-03-15',
		level: 1,
	},
	{
		count: 6,
		date: '2023-03-16',
		level: 2,
	},
	{
		count: 3,
		date: '2023-03-17',
		level: 1,
	},
	{
		count: 1,
		date: '2023-03-18',
		level: 1,
	},
	{
		count: 0,
		date: '2023-03-19',
		level: 0,
	},
	{
		count: 7,
		date: '2023-03-20',
		level: 2,
	},
	{
		count: 2,
		date: '2023-03-21',
		level: 1,
	},
	{
		count: 16,
		date: '2023-03-22',
		level: 4,
	},
	{
		count: 7,
		date: '2023-03-23',
		level: 2,
	},
	{
		count: 0,
		date: '2023-03-24',
		level: 0,
	},
	{
		count: 9,
		date: '2023-03-25',
		level: 2,
	},
	{
		count: 7,
		date: '2023-03-26',
		level: 2,
	},
	{
		count: 1,
		date: '2023-03-27',
		level: 1,
	},
	{
		count: 5,
		date: '2023-03-28',
		level: 1,
	},
	{
		count: 4,
		date: '2023-03-29',
		level: 1,
	},
	{
		count: 1,
		date: '2023-03-30',
		level: 1,
	},
	{
		count: 5,
		date: '2023-03-31',
		level: 1,
	},
	{
		count: 2,
		date: '2023-04-01',
		level: 1,
	},
	{
		count: 0,
		date: '2023-04-02',
		level: 0,
	},
	{
		count: 3,
		date: '2023-04-03',
		level: 1,
	},
	{
		count: 0,
		date: '2023-04-04',
		level: 0,
	},
	{
		count: 3,
		date: '2023-04-05',
		level: 1,
	},
	{
		count: 0,
		date: '2023-04-06',
		level: 0,
	},
	{
		count: 0,
		date: '2023-04-07',
		level: 0,
	},
	{
		count: 0,
		date: '2023-04-08',
		level: 0,
	},
	{
		count: 3,
		date: '2023-04-09',
		level: 1,
	},
	{
		count: 5,
		date: '2023-04-10',
		level: 1,
	},
	{
		count: 5,
		date: '2023-04-11',
		level: 1,
	},
	{
		count: 0,
		date: '2023-04-12',
		level: 0,
	},
	{
		count: 0,
		date: '2023-04-13',
		level: 0,
	},
	{
		count: 6,
		date: '2023-04-14',
		level: 2,
	},
	{
		count: 0,
		date: '2023-04-15',
		level: 0,
	},
	{
		count: 7,
		date: '2023-04-16',
		level: 2,
	},
	{
		count: 0,
		date: '2023-04-17',
		level: 0,
	},
	{
		count: 0,
		date: '2023-04-18',
		level: 0,
	},
	{
		count: 10,
		date: '2023-04-19',
		level: 2,
	},
	{
		count: 4,
		date: '2023-04-20',
		level: 1,
	},
	{
		count: 16,
		date: '2023-04-21',
		level: 4,
	},
	{
		count: 0,
		date: '2023-04-22',
		level: 0,
	},
	{
		count: 9,
		date: '2023-04-23',
		level: 2,
	},
	{
		count: 0,
		date: '2023-04-24',
		level: 0,
	},
	{
		count: 0,
		date: '2023-04-25',
		level: 0,
	},
	{
		count: 0,
		date: '2023-04-26',
		level: 0,
	},
	{
		count: 0,
		date: '2023-04-27',
		level: 0,
	},
	{
		count: 0,
		date: '2023-04-28',
		level: 0,
	},
	{
		count: 0,
		date: '2023-04-29',
		level: 0,
	},
	{
		count: 0,
		date: '2023-04-30',
		level: 0,
	},
	{
		count: 0,
		date: '2023-05-01',
		level: 0,
	},
	{
		count: 4,
		date: '2023-05-02',
		level: 1,
	},
	{
		count: 4,
		date: '2023-05-03',
		level: 1,
	},
	{
		count: 14,
		date: '2023-05-04',
		level: 3,
	},
	{
		count: 0,
		date: '2023-05-05',
		level: 0,
	},
	{
		count: 0,
		date: '2023-05-06',
		level: 0,
	},
	{
		count: 0,
		date: '2023-05-07',
		level: 0,
	},
	{
		count: 0,
		date: '2023-05-08',
		level: 0,
	},
	{
		count: 7,
		date: '2023-05-09',
		level: 2,
	},
	{
		count: 0,
		date: '2023-05-10',
		level: 0,
	},
	{
		count: 0,
		date: '2023-05-11',
		level: 0,
	},
	{
		count: 0,
		date: '2023-05-12',
		level: 0,
	},
	{
		count: 0,
		date: '2023-05-13',
		level: 0,
	},
	{
		count: 6,
		date: '2023-05-14',
		level: 2,
	},
	{
		count: 0,
		date: '2023-05-15',
		level: 0,
	},
	{
		count: 6,
		date: '2023-05-16',
		level: 2,
	},
	{
		count: 7,
		date: '2023-05-17',
		level: 2,
	},
	{
		count: 6,
		date: '2023-05-18',
		level: 2,
	},
	{
		count: 8,
		date: '2023-05-19',
		level: 2,
	},
	{
		count: 3,
		date: '2023-05-20',
		level: 1,
	},
	{
		count: 2,
		date: '2023-05-21',
		level: 1,
	},
	{
		count: 9,
		date: '2023-05-22',
		level: 2,
	},
	{
		count: 0,
		date: '2023-05-23',
		level: 0,
	},
	{
		count: 0,
		date: '2023-05-24',
		level: 0,
	},
	{
		count: 0,
		date: '2023-05-25',
		level: 0,
	},
	{
		count: 0,
		date: '2023-05-26',
		level: 0,
	},
	{
		count: 5,
		date: '2023-05-27',
		level: 1,
	},
	{
		count: 4,
		date: '2023-05-28',
		level: 1,
	},
	{
		count: 10,
		date: '2023-05-29',
		level: 2,
	},
	{
		count: 0,
		date: '2023-05-30',
		level: 0,
	},
	{
		count: 12,
		date: '2023-05-31',
		level: 3,
	},
]

type ProfileProps = {}

const Profile: FC<ProfileProps> = () => {
	const { primary, primarySemiBold, accent } = useAppSelector(selectCurrentTheme)

	const currentUser = useAppSelector(selectCurrentUser)
	const experience = useAppSelector(selectExperience)

	// Прогресс достижений пользователя
	const achievementsProgress: Pick<TUserAchievement, 'achievementId' | 'completionDate'>[] = [
		{
			achievementId: 1,
			completionDate: 'Oct. 18 2017',
		},
		{
			achievementId: 2,
			completionDate: 'Oct. 18 2017',
		},
		{
			achievementId: 3,
			completionDate: 'Oct. 18 2017',
		},
		{
			achievementId: 4,
			completionDate: 'Oct. 18 2017',
		},
		{
			achievementId: 5,
			completionDate: 'Oct. 18 2017',
		},
		{
			achievementId: 6,
			completionDate: 'Oct. 18 2017',
		},
	]

	// Массив с достижениями
	const achievements: TAchievement[] = [
		{
			id: 1,
			title: 'First quick print',
			description: 'Type 80 words in one session.',
			experienceGained: 200,
		},
		{
			id: 2,
			title: 'Error—free Wizard',
			description: 'Complete the text without making a single mistake.',
			experienceGained: 100,
		},
		{
			id: 3,
			title: 'Great pace',
			description: 'Type 160 words in one session.',
			experienceGained: 600,
		},
		{
			id: 4,
			title: 'Multilingual',
			description: 'Type texts in 3 different languages.',
			experienceGained: 300,
		},
		{
			id: 5,
			title: 'Perfectionist',
			description: 'Fix 10 typos in one session.',
			experienceGained: 200,
		},
		{
			id: 6,
			title: 'Getting Started',
			description: 'Complete your first typing test.',
			experienceGained: 100,
		},
		{
			id: 7,
			title: 'Steady Hands',
			description: 'Complete a session with less than 5 mistakes.',
			experienceGained: 100,
		},
		{
			id: 8,
			title: 'Daily Sprinter',
			description: 'Practice typing 3 days in a row',
			experienceGained: 3000,
		},
		{
			id: 9,
			title: 'Steel endurance',
			description: 'Practice for 7 days in a row.',
			experienceGained: 5000,
		},
		{
			id: 10,
			title: 'Speed Racer',
			description: 'Type 100 words per minute and above.',
			experienceGained: 20000,
		},
		{
			id: 11,
			title: 'Keyboard shortcut',
			description: 'Perform 1,000 keystrokes.',
			experienceGained: 1000,
		},
		{
			id: 12,
			title: 'Keyboard shortcut',
			description: 'Perform 2,500 keystrokes.',
			experienceGained: 2500,
		},
	]

	const getCompletionDate = (id: TAchievement['id']) => {
		return achievementsProgress.find(achievement => achievement.achievementId === id)?.completionDate
	}

	return (
		<div className={s['profile__wrapper']}>
			<div className={s['header']}>
				<div className={s['profile']}>
					<div className={s['profile__img']}>
						<UserIcon isStroke={true} color={primary} />
					</div>
					<div className={s['profile__inner']}>
						<h2 className={s['profile__name']}>Soshinoya</h2>
						<p className={s['profile__text']}>Joined 08 Dec 2023</p>
					</div>
				</div>
				<div className={s['experience']}>
					<Experience info={experience || { level: 0, progress: 0 }} />
				</div>
			</div>
			<div className={s['detailed-info']}>
				<div className={s['bio']}>
					<h3 className={s['bio__title']}>Bio</h3>
					<p className={s['bio__description']}>
						mythical.rocket on TikTok
						<br />
						mythicalrocket on YT
						<br />
						mythicalrocket on Twitch
						<br />
						<br />
						QWERTY
						<br />
						<br />
						alt layout account: monkeytype.com/profile/rocketaltlayout
						<br />
						<br />
						keyboard Apex Pro
					</p>
				</div>
				<ActivityGraph
					dataTooltipId='activity-calendar-tooltip'
					config={{
						data: data,
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
			</div>
			<div className={s['statistic__wrapper']}>
				<div className={s['statistic']}>
					<div className={s['statistic__item']}>
						<h4 className={s['statistic__title']}>266</h4>
						<p className={s['statistic__subtitle']}>20 words</p>
					</div>
					<div className={s['statistic__item']}>
						<h4 className={s['statistic__title']}>238</h4>
						<p className={s['statistic__subtitle']}>40 words</p>
					</div>
					<div className={s['statistic__item']}>
						<h4 className={s['statistic__title']}>232</h4>
						<p className={s['statistic__subtitle']}>80 words</p>
					</div>
					<div className={s['statistic__item']}>
						<h4 className={s['statistic__title']}>208</h4>
						<p className={s['statistic__subtitle']}>160 words</p>
					</div>
				</div>
				<div className={s['statistic']}>
					<div className={s['statistic__item']}>
						<h4 className={s['statistic__title']}>403</h4>
						<p className={s['statistic__subtitle']}>15 seconds</p>
					</div>
					<div className={s['statistic__item']}>
						<h4 className={s['statistic__title']}>322</h4>
						<p className={s['statistic__subtitle']}>30 seconds</p>
					</div>
					<div className={s['statistic__item']}>
						<h4 className={s['statistic__title']}>251</h4>
						<p className={s['statistic__subtitle']}>60 seconds</p>
					</div>
					<div className={s['statistic__item']}>
						<h4 className={s['statistic__title']}>190</h4>
						<p className={s['statistic__subtitle']}>120 seconds</p>
					</div>
				</div>
			</div>
			<div className={s['achievements']}>
				<div className={s['achievements-header']}>
					<h2 className={s['achievements-header__title']}>Achievements</h2>
					<div className={s['achievements-header__progress']}>
						Completed 6/12 <span>50%</span>
						<Progressbar percentage={(achievementsProgress.length / achievements.length) * 100} />
					</div>
				</div>
				<div className={s['achievements__items']}>
					{achievements.map(({ experienceGained, ...newAchievement }) => (
						<Achievement
							key={newAchievement.id}
							{...newAchievement}
							completionDate={getCompletionDate(newAchievement.id)}
						/>
					))}
				</div>
			</div>
		</div>
	)
}

export default Profile
