import React, { FC } from 'react'
import ActivityCalendar, { Props as ActivityCalendarProps } from 'react-activity-calendar'
import { Tooltip } from 'react-tooltip'

type ActivityGraphProps = {
	dataTooltipId: string
	dataTooltipHTML?: string
	config: ActivityCalendarProps
}

const ActivityGraph: FC<ActivityGraphProps> = ({ dataTooltipId, dataTooltipHTML, config }) => {
	return (
		<div>
			<ActivityCalendar
				{...config}
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
