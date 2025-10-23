import React from 'react';
import Accordion, { DayAccordionItem } from '../Accordion';
import DaySchedule from './DaySchedule';

export interface HourRange {
	startHour: string;
	startMin: string;
	endHour: string;
	endMin: string;
}

interface WeeklyScheduleProps {
	enableMonday: boolean;
	setEnableMonday: React.Dispatch<React.SetStateAction<boolean>>;
	enableTuesday: boolean;
	setEnableTuesday: React.Dispatch<React.SetStateAction<boolean>>;
	enableWednesday: boolean;
	setEnableWednesday: React.Dispatch<React.SetStateAction<boolean>>;
	enableThursday: boolean;
	setEnableThursday: React.Dispatch<React.SetStateAction<boolean>>;
	enableFriday: boolean;
	setEnableFriday: React.Dispatch<React.SetStateAction<boolean>>;
	enableSaturday: boolean;
	setEnableSaturday: React.Dispatch<React.SetStateAction<boolean>>;
	enableSunday: boolean;
	setEnableSunday: React.Dispatch<React.SetStateAction<boolean>>;
	weeklyHours: { [day: string]: HourRange[] };
	setWeeklyHours: React.Dispatch<
		React.SetStateAction<{
			[day: string]: HourRange[];
		}>
	>;
}

const WeeklySchedule: React.FC<WeeklyScheduleProps> = (props) => {
	const copyMondayToAll = (mondayHours: HourRange[]) => {
		props.setEnableTuesday(true);
		props.setEnableWednesday(true);
		props.setEnableThursday(true);
		props.setEnableFriday(true);
		props.setEnableSaturday(true);
		props.setEnableSunday(true);
		props.setWeeklyHours((prev) => ({
			...prev,
			tuesday: mondayHours.map((h) => ({ ...h })),
			wednesday: mondayHours.map((h) => ({ ...h })),
			thursday: mondayHours.map((h) => ({ ...h })),
			friday: mondayHours.map((h) => ({ ...h })),
			saturday: mondayHours.map((h) => ({ ...h })),
			sunday: mondayHours.map((h) => ({ ...h })),
		}));
	};

	const renderDay = (
		dayLabel: string,
		enable: boolean,
		setEnable: React.Dispatch<React.SetStateAction<boolean>>,
		key: string,
	) => (
		<DayAccordionItem
			day={dayLabel}
			checked={enable}
			onChange={setEnable}
			id={key}
			clearDaySchedule={() => {
				props.setWeeklyHours((prev) => ({
					...prev,
					[key]: [{ startHour: '', startMin: '', endHour: '', endMin: '' }],
				}));
			}}>
			{enable ? (
				<DaySchedule
					dayName={key}
					hours={props.weeklyHours[key]}
					setHours={(hours) =>
						props.setWeeklyHours((prev) => ({ ...prev, [key]: hours }))
					}
					onCopyToAll={key === 'monday' ? copyMondayToAll : undefined}
				/>
			) : (
				<span>Para poder configurar el horario, activa el día {dayLabel}</span>
			)}
		</DayAccordionItem>
	);

	return (
		<Accordion id='weekly-schedule' color='info' className='m-4'>
			{renderDay('Lunes', props.enableMonday, props.setEnableMonday, 'monday')}
			{renderDay('Martes', props.enableTuesday, props.setEnableTuesday, 'tuesday')}
			{renderDay('Miércoles', props.enableWednesday, props.setEnableWednesday, 'wednesday')}
			{renderDay('Jueves', props.enableThursday, props.setEnableThursday, 'thursday')}
			{renderDay('Viernes', props.enableFriday, props.setEnableFriday, 'friday')}
			{renderDay('Sábado', props.enableSaturday, props.setEnableSaturday, 'saturday')}
			{renderDay('Domingo', props.enableSunday, props.setEnableSunday, 'sunday')}
		</Accordion>
	);
};

export default WeeklySchedule;
