import React, { FC, useMemo } from 'react'
import ActivityCalendar, { Activity, Props as ActivityCalendarProps } from 'react-activity-calendar'
import { Tooltip } from 'react-tooltip'

type ActivityGraphProps = {
	dataTooltipId: string
	dataTooltipHTML?: string
	config: ActivityCalendarProps
}

// Функция для определения уровня активности
const calculateActivityLevel = (count: number): number => {
	if (count === 0) return 0
	if (count <= 5) return 1
	if (count <= 10) return 2
	if (count <= 15) return 3
	return 4
}

// Утилита для получения даты в локальном формате YYYY-MM-DD
const getLocalDateString = (date: Date = new Date()): string => {
	const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
	return localDate.toISOString().split('T')[0]
}

// Генерация всех дат года
const generateYearDates = (year: number) => {
	const dates = []
	const date = new Date(year, 0, 1)

	while (date.getFullYear() === year) {
		dates.push(getLocalDateString(date))
		date.setDate(date.getDate() + 1)
	}

	return dates
}

// Объединение данных
const mergeActivities = (allDates: string[], actualActivity: Activity[]): Activity[] => {
	const activityMap = new Map(actualActivity.map(item => [item.date, item.count]))
	return allDates.map(date => ({
		date,
		count: activityMap.get(date) || 0,
		level: 0,
	}))
}

const ActivityGraph: FC<ActivityGraphProps> = ({ dataTooltipId, dataTooltipHTML, config }) => {
	const year = new Date().getFullYear()
	const allYearDates = generateYearDates(year)

	// Объединяем и рассчитываем level
	const data = useMemo(() => {
		const merged = mergeActivities(allYearDates, config.data)
		return merged.map(obj => ({
			...obj,
			level: calculateActivityLevel(obj.count),
		}))
	}, [config.data, year])

	return (
		<div>
			<ActivityCalendar
				{...config}
				data={data}
				renderBlock={(block, activity) =>
					React.cloneElement(block, {
						'data-tooltip-id': dataTooltipId,
						'data-tooltip-html': dataTooltipHTML
							? dataTooltipHTML
							: `${activity.count} activities on ${activity.date}`,
					})
				}
			/>
			<Tooltip id={dataTooltipId} />
		</div>
	)
}

export default ActivityGraph
