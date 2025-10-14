import React, { useState, useRef } from 'react';
import Card, { CardBody } from '../../../../components/bootstrap/Card';
import FormGroup from '../../../../components/bootstrap/forms/FormGroup';
import Input from '../../../../components/bootstrap/forms/Input';

interface VerifyCodeProps {
	onComplete: (code: string) => void;
}

const VerifyCode = ({ onComplete }: VerifyCodeProps) => {
	const [values, setValues] = useState(['', '', '', '']);
	const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

	const handleChange = (index: number, value: string) => {
		if (!/^[0-9]?$/.test(value)) return; // Solo números
		const newValues = [...values];
		newValues[index] = value;
		setValues(newValues);

		if (value && index < 3) {
			inputRefs.current[index + 1]?.focus(); // Pasa al siguiente input
		}

		const code = newValues.join('');
		if (code.length === 4 && !newValues.includes('')) {
			onComplete(code);
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
		if (e.key === 'Backspace' && !values[index] && index > 0) {
			inputRefs.current[index - 1]?.focus();
		}
	};

	return (
		<Card className='shadow-3d-dark p-4 mb-4 text-center'>
			<CardBody>
				<h5 className='mb-3'>Verificar código</h5>
				<p className='text-muted mb-4'>Ingresa el código de 4 dígitos que te enviamos a tu correo</p>

				<div className='d-flex justify-content-center gap-3'>
					{[0, 1, 2, 3].map((index) => (
						<FormGroup key={index} className='text-center' id={`digit-${index}`}>
							<Input
								type='text'
								maxLength={1}
								value={values[index]} // 👈 se controla el valor
								onChange={(e) => handleChange(index, e.target.value)}
								onKeyDown={(e) => handleKeyDown(e, index)}
								ref={(el) => (inputRefs.current[index] = el)}
								className='text-center fs-4'
								style={{
									width: '3rem',
									height: '3rem',
									borderRadius: '0.5rem',
									textAlign: 'center',
									fontWeight: 600,
								}}
							/>
						</FormGroup>
					))}
				</div>
			</CardBody>
		</Card>
	);
};

export default VerifyCode;
