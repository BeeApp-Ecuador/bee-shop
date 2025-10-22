import React from 'react';
import Accordion, { DayAccordionItem } from '../Accordion';
import DaySchedule from './DaySchedule';

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
}
const WeeklySchedule: React.FC<WeeklyScheduleProps> = ({
	enableMonday,
	setEnableMonday,
	enableTuesday,
	setEnableTuesday,
	enableWednesday,
	setEnableWednesday,
	enableThursday,
	setEnableThursday,
	enableFriday,
	setEnableFriday,
	enableSaturday,
	setEnableSaturday,
	enableSunday,
	setEnableSunday,
}) => {
	return (
		<Accordion id='weekly-schedule' color='info' className='m-4'>
			<DayAccordionItem
				day='Lunes'
				checked={enableMonday}
				onChange={setEnableMonday}
				id='monday'>
				{enableMonday ? (
					<DaySchedule />
				) : (
					<span>Para poder configurar el horario, activa el día Lunes</span>
				)}
			</DayAccordionItem>

			<DayAccordionItem
				day='Martes'
				checked={enableTuesday}
				onChange={setEnableTuesday}
				id='tuesday'>
				{enableTuesday ? (
					<DaySchedule />
				) : (
					<span>Para poder configurar el horario, activa el día Martes</span>
				)}
			</DayAccordionItem>

			<DayAccordionItem
				day='Miércoles'
				checked={enableWednesday}
				onChange={setEnableWednesday}
				id='wednesday'>
				{enableWednesday ? (
					<DaySchedule />
				) : (
					<span>Para poder configurar el horario, activa el día Miércoles</span>
				)}
			</DayAccordionItem>

			<DayAccordionItem
				day='Jueves'
				checked={enableThursday}
				onChange={setEnableThursday}
				id='thursday'>
				{enableThursday ? (
					<DaySchedule />
				) : (
					<span>Para poder configurar el horario, activa el día Jueves</span>
				)}
			</DayAccordionItem>

			<DayAccordionItem
				day='Viernes'
				checked={enableFriday}
				onChange={setEnableFriday}
				id='friday'>
				{enableFriday ? (
					<DaySchedule />
				) : (
					<span>Para poder configurar el horario, activa el día Viernes</span>
				)}
			</DayAccordionItem>

			<DayAccordionItem
				day='Sábado'
				checked={enableSaturday}
				onChange={setEnableSaturday}
				id='saturday'>
				{enableSaturday ? (
					<DaySchedule />
				) : (
					<span>Para poder configurar el horario, activa el día Sábado</span>
				)}
			</DayAccordionItem>

			<DayAccordionItem
				day='Domingo'
				checked={enableSunday}
				onChange={setEnableSunday}
				id='sunday'>
				{enableSunday ? (
					<DaySchedule />
				) : (
					<span>Para poder configurar el horario, activa el día Domingo</span>
				)}
			</DayAccordionItem>
		</Accordion>
	);
};

export default WeeklySchedule;
