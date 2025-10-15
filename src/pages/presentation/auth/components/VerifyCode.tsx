import React, { useState, useRef, useEffect } from 'react';
import Card, { CardBody } from '../../../../components/bootstrap/Card';
import FormGroup from '../../../../components/bootstrap/forms/FormGroup';
import Input from '../../../../components/bootstrap/forms/Input';
import { useVerifyCodeMutation } from '../../../../store/api/authApi';

interface VerifyCodeProps {
	onComplete: () => void;
	resendCode: () => void;
	email: string;
}

const VerifyCode = ({ onComplete, resendCode, email }: VerifyCodeProps) => {
	const [values, setValues] = useState(['', '', '', '']);
	const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
	const [verifyCode] = useVerifyCodeMutation();

	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	const [timeLeft, setTimeLeft] = useState(120);
	const [isRunning, setIsRunning] = useState(true);

	// ✅ Timer corregido
	useEffect(() => {
		if (!isRunning) return;
		if (timeLeft <= 0) {
			setIsRunning(false);
			return;
		}

		const interval = setInterval(() => {
			setTimeLeft((prev) => prev - 1);
		}, 1000);

		return () => clearInterval(interval);
	}, [isRunning]);

	const handleChange = async (index: number, value: string) => {
		if (!/^[0-9]?$/.test(value)) return; // Solo números
		const newValues = [...values];
		newValues[index] = value;
		setValues(newValues);

		if (value && index < 3) {
			inputRefs.current[index + 1]?.focus();
		}

		const code = newValues.join('');
		if (code.length === 4 && !newValues.includes('')) {
			setIsLoading(true);
			setError(null);

			const { data, error } = await verifyCode({ email, code });

			setIsLoading(false);

			if (error) {
				setError('Código de verificación inválido.');
				return;
			}

			if (data && data.statusCode === 200) {
				setSuccess('Un momento, estamos creando tu cuenta...');
				onComplete();
			}
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
				<p className='text-muted mb-4'>
					Ingresa el código de 4 dígitos que te enviamos a tu correo
				</p>
				<p className='text-muted mb-4'>
					{timeLeft > 0
						? `El código expira en ${Math.floor(timeLeft / 60)
								.toString()
								.padStart(2, '0')}:${(timeLeft % 60).toString().padStart(2, '0')}`
						: 'El código ha expirado. '}
					{timeLeft === 0 && (
						<button
							className='btn btn-link p-0 ms-1 align-baseline'
							onClick={() => {
								resendCode();
								setValues(['', '', '', '']);
								setTimeLeft(120);
								setIsRunning(true);
								setError(null);
								inputRefs.current[0]?.focus();
							}}>
							Reenviar código
						</button>
					)}
				</p>

				<div className='d-flex justify-content-center gap-3'>
					{[0, 1, 2, 3].map((index) => (
						<FormGroup key={index} className='text-center' id={`digit-${index}`}>
							<Input
								type='text'
								maxLength={1}
								value={values[index]}
								onChange={(e) => handleChange(index, e.target.value)}
								onKeyDown={(e) => handleKeyDown(e, index)}
								ref={(el) => (inputRefs.current[index] = el)}
								className='text-center fs-4'
								style={{
									width: '3rem',
									height: '3rem',
									borderRadius: '0.5rem',
									fontWeight: 600,
								}}
								disabled={isLoading}
							/>
						</FormGroup>
					))}
				</div>

				<div className='mt-3'>
					{isLoading && <p className='text-primary'>Verificando código...</p>}
					{error && (
						<p className='text-danger' role='alert'>
							{error}
						</p>
					)}
					{success && (
						<p className='text-success' role='alert'>
							{success}
						</p>
					)}
				</div>
			</CardBody>
		</Card>
	);
};

export default VerifyCode;
