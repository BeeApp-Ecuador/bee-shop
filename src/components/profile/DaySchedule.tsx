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
		<div className='d-flex flex-column gap-2'>
			{hours.map((h, index) => (
				<div key={index} className='d-flex align-items-center gap-2'>
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

					{/* Botón para eliminar una fila */}
					{hours.length > 1 && (
						<button
							type='button'
							className='btn btn-outline-danger btn-sm'
							onClick={() => removeHour(index)}>
							🗑
						</button>
					)}

					{/* Botón para agregar una nueva fila solo en la última */}
					{index === hours.length - 1 && (
						<button
							type='button'
							className='btn btn-outline-primary btn-sm'
							onClick={addHour}>
							+
						</button>
					)}
				</div>
			))}
		</div>
	);
};

export default DaySchedule;
