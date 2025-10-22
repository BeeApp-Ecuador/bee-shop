import React from 'react';
import showNotification from '../extras/showNotification';
import Icon from '../icon/Icon';

const DaySchedule = () => {
	const [hours, setHours] = React.useState([
		{ startHour: '', startMin: '', endHour: '', endMin: '' },
	]);

	const hoursOptions = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));
	const minutesOptions = ['00', '15', '30', '45'];

	const addHour = () => {
		setHours((prev) => {
			const last = prev[prev.length - 1];
			if (!last.endHour || !last.endMin) {
				showNotification(
					<span className='d-flex align-items-center'>
						<Icon icon='Error' size='lg' className='me-1' />
						<span>Error</span>
					</span>,
					'Debes completar la franja horaria anterior antes de agregar otra',
					'danger',
				);
				return prev;
			}
			return [
				...prev,
				{ startHour: last.endHour, startMin: last.endMin, endHour: '', endMin: '' },
			];
		});
	};

	const handleChange = (
		index: number,
		field: 'startHour' | 'startMin' | 'endHour' | 'endMin',
		value: string,
	) => {
		setHours((prev) => {
			const newHours = [...prev];
			const current = { ...newHours[index] };
			current[field] = value;

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
				return prev;
			}

			if (index > 0) {
				const prevEnd = prev[index - 1].endHour + ':' + prev[index - 1].endMin;
				if (start && prevEnd && start <= prevEnd) {
					showNotification(
						<span className='d-flex align-items-center'>
							<Icon icon='Error' size='lg' className='me-1' />
							<span>Error</span>
						</span>,
						'La hora de inicio debe ser mayor que la hora de fin de la franja anterior',
						'danger',
					);
					return prev;
				}
			}

			newHours[index] = current;
			return newHours;
		});
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
						gridTemplateColumns: 'auto auto auto auto auto auto auto  90px',
						alignItems: 'center',
						gap: '8px',
					}}>
					{/* Start Hour */}
					<select
						className='form-control w-auto'
						value={h.startHour}
						onChange={(e) => handleChange(index, 'startHour', e.target.value)}>
						<option value=''>HH</option>
						{hoursOptions.map((hh) => (
							<option key={hh} value={hh}>
								{hh}
							</option>
						))}
					</select>

					<span>:</span>

					{/* Start Minute */}
					<select
						className='form-control w-auto'
						value={h.startMin}
						onChange={(e) => handleChange(index, 'startMin', e.target.value)}>
						<option value=''>MM</option>
						{minutesOptions.map((mm) => (
							<option key={mm} value={mm}>
								{mm}
							</option>
						))}
					</select>

					<span>hasta</span>

					{/* End Hour */}
					<select
						className='form-control w-auto'
						value={h.endHour}
						onChange={(e) => handleChange(index, 'endHour', e.target.value)}>
						<option value=''>HH</option>
						{hoursOptions.map((hh) => (
							<option key={hh} value={hh}>
								{hh}
							</option>
						))}
					</select>

					<span>:</span>

					{/* End Minute */}
					<select
						className='form-control w-auto'
						value={h.endMin}
						onChange={(e) => handleChange(index, 'endMin', e.target.value)}>
						<option value=''>MM</option>
						{minutesOptions.map((mm) => (
							<option key={mm} value={mm}>
								{mm}
							</option>
						))}
					</select>

					{/* Botones alineados horizontalmente */}
					<div className='d-flex gap-1'>
						{hours.length > 1 && index === hours.length - 1 && (
							<button
								type='button'
								className='btn btn-outline-danger btn-sm'
								onClick={() => removeHour(index)}>
								-
							</button>
						)}
						{index === hours.length - 1 && index < 2 && (
							<button
								type='button'
								className='btn btn-outline-primary btn-sm'
								onClick={addHour}>
								+
							</button>
						)}
					</div>
				</div>
			))}
		</div>
	);
};

export default DaySchedule;
