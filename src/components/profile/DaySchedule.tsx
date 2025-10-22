import React from 'react';

// 🔹 Componente reutilizable para los horarios de un día
const DaySchedule = () => {
	const [hours, setHours] = React.useState([{ start: '', end: '' }]);

	const addHour = () => setHours([...hours, { start: '', end: '' }]);

	const handleChange = (index, field, value) => {
		const updated = [...hours];
		updated[index][field] = value;
		setHours(updated);
	};

	const removeHour = (index) => {
		setHours(hours.filter((_, i) => i !== index));
	};

	return (
		<div className='d-flex flex-column gap-2 align-items-center'>
			{hours.map((h, index) => (
				<div
					key={index}
					className='d-grid align-items-center'
					style={{
						gridTemplateColumns: 'auto auto auto 90px',
						alignItems: 'center',
						gap: '8px',
					}}>
					<input
						type='time'
						className='form-control w-auto'
						step='900'
						min='00:00'
						max='23:59'
						value={h.start}
						onChange={(e) => handleChange(index, 'start', e.target.value)}
					/>
					<span>hasta</span>
					<input
						type='time'
						className='form-control w-auto'
						step='900'
						min='00:00'
						max='23:59'
						value={h.end}
						onChange={(e) => handleChange(index, 'end', e.target.value)}
					/>

					{/* Botones siempre en la misma columna */}
					<div className='d-flex gap-1 justify-content-start'>
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
