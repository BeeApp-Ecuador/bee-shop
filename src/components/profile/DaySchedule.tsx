import React from 'react';
import showNotification from '../extras/showNotification';
import Icon from '../icon/Icon';
import { HourRange } from './WeeklySchedule';
import Button from '../bootstrap/Button';

interface DayScheduleProps {
	dayName: string;
	hours: HourRange[];
	setHours: (hours: HourRange[]) => void;
	onCopyToAll?: (hours: HourRange[]) => void;
}

const DaySchedule: React.FC<DayScheduleProps> = ({ dayName, hours, setHours, onCopyToAll }) => {
	const hoursOptions = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
	const baseMinutesOptions = ['00', '15', '30', '45'];

	const getMinutesOptions = (hour: string) =>
		hour === '23' ? [...baseMinutesOptions, '59'] : baseMinutesOptions;

	const addHour = () => {
		const last = hours[hours.length - 1];
		if (!last.endHour || !last.endMin) {
			showNotification(
				<span className='d-flex align-items-center'>
					<Icon icon='Error' size='lg' className='me-1' />
					<span>Error</span>
				</span>,
				'Debes completar la franja horaria anterior antes de agregar otra',
				'danger',
			);
			return;
		}
		setHours([
			...hours,
			{ startHour: last.endHour, startMin: last.endMin, endHour: '', endMin: '' },
		]);
	};

	const handleChange = (index: number, field: keyof HourRange, value: string) => {
		const newHours = [...hours];
		const current = { ...newHours[index], [field]: value };

		const start =
			current.startHour && current.startMin
				? current.startHour + ':' + current.startMin
				: null;
		const end =
			current.endHour && current.endMin ? current.endHour + ':' + current.endMin : null;

		if (start && end && start >= end) {
			showNotification(
				<span className='d-flex align-items-center'>
					<Icon icon='Error' size='lg' className='me-1' />
					<span>Error</span>
				</span>,
				'La hora de inicio debe ser menor que la hora de fin',
				'danger',
			);
			return;
		}

		if (index > 0) {
			const prevEnd = newHours[index - 1].endHour + ':' + newHours[index - 1].endMin;
			if (start && prevEnd && start <= prevEnd) {
				showNotification(
					<span className='d-flex align-items-center'>
						<Icon icon='Error' size='lg' className='me-1' />
						<span>Error</span>
					</span>,
					'La hora de inicio debe ser mayor que la hora de fin de la franja anterior',
					'danger',
				);
				return;
			}
		}

		newHours[index] = current;
		setHours(newHours);
	};

	const removeHour = (index: number) => {
		setHours(hours.filter((_, i) => i !== index));
	};

	return (
		<div className='d-flex flex-column gap-2 align-items-center'>
			{hours.map((h, index) => (
				<div
					key={index}
					className='d-grid align-items-center'
					style={{
						gridTemplateColumns: 'auto auto auto auto auto auto auto 90px',
						gap: '8px',
					}}>
					<select
						value={h.startHour}
						onChange={(e) => handleChange(index, 'startHour', e.target.value)}
						className='form-control w-auto'>
						<option value=''>HH</option>
						{hoursOptions.map((hh) => (
							<option key={hh} value={hh}>
								{hh}
							</option>
						))}
					</select>
					<span>:</span>
					<select
						value={h.startMin}
						onChange={(e) => handleChange(index, 'startMin', e.target.value)}
						className='form-control w-auto'>
						<option value=''>MM</option>
						{getMinutesOptions(h.startHour).map((mm) => (
							<option key={mm} value={mm}>
								{mm}
							</option>
						))}
					</select>
					<span>hasta</span>
					<select
						value={h.endHour}
						onChange={(e) => handleChange(index, 'endHour', e.target.value)}
						className='form-control w-auto'>
						<option value=''>HH</option>
						{hoursOptions.map((hh) => (
							<option key={hh} value={hh}>
								{hh}
							</option>
						))}
					</select>
					<span>:</span>
					<select
						value={h.endMin}
						onChange={(e) => handleChange(index, 'endMin', e.target.value)}
						className='form-control w-auto'>
						<option value=''>MM</option>
						{getMinutesOptions(h.endHour).map((mm) => (
							<option key={mm} value={mm}>
								{mm}
							</option>
						))}
					</select>
					<div className='d-flex gap-1'>
						{hours.length > 1 && index === hours.length - 1 && (
							<Button
								icon='Remove'
								onClick={() => removeHour(index)}
								color='danger'
								isOutline
								size='sm'
							/>
						)}
						{index === hours.length - 1 && index < 2 && (
							<Button
								icon='Add'
								onClick={addHour}
								color='success'
								isOutline
								size='sm'
							/>
						)}
					</div>
				</div>
			))}

			{dayName === 'monday' && onCopyToAll && (
				<div className='d-flex justify-content-end w-100'>
					<Button color='info' onClick={() => onCopyToAll(hours)}>
						Copiar horario para todos los días
					</Button>
				</div>
			)}
		</div>
	);
};

export default DaySchedule;
