import { useFormik } from 'formik';
import React, { useState } from 'react';
import FormGroup from '../bootstrap/forms/FormGroup';
import Input from '../bootstrap/forms/Input';
import Button from '../bootstrap/Button';
import Spinner from '../bootstrap/Spinner';

export interface ChangePasswordFormValues {
	password: string;
	verifyPassword: string;
}

interface ChangePasswordProps {
	changePassword: (email: string) => void;
}

export const ChangePassword = ({ changePassword }: ChangePasswordProps) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const formikChangePassword = useFormik<ChangePasswordFormValues>({
		initialValues: {
			password: '',
			verifyPassword: '',
		},
		validate: (values) => {
			const errors: Partial<Record<keyof ChangePasswordFormValues, string>> = {};

			if (!values.password) {
				errors.password = 'Requerido';
			} else if (values.password.length < 6) {
				errors.password = 'La contraseña debe tener al menos 6 caracteres';
			}
			// password must contain at least one uppercase letter, one lowercase letter, one number and one special character
			else if (
				!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}/.test(
					values.password,
				)
			) {
				errors.password =
					'La contraseña debe contener al menos una letra mayúscula, una letra minúscula, un número y uno de estos caracteres especiales (@ $ ! % * ? &)';
			}

			if (!values.verifyPassword) {
				errors.verifyPassword = 'Requerido';
			} else if (values.verifyPassword !== values.password) {
				errors.verifyPassword = 'Las contraseñas no coinciden';
			}
			return errors;
		},
		validateOnChange: false,
		validateOnBlur: true,
		onSubmit: async (values) => {
			// setIsLoading(true);
			console.log(values);

			// await sendCode(values.email);
			// setIsLoading(false);
		},
	});

	return (
		<>
			<div className='row g-4'>
				<div className='col-12 col-sm-12'>
					<span className='text-muted small'>
						La contraseña debe tener al menos 6 caracteres y debe contener al menos una
						letra mayúscula, una letra minúscula, un número y uno de estos caracteres
						especiales (@ $ ! % * ? &)
					</span>
				</div>
				<div className='col-12'>
					<FormGroup id='password' isFloating label='Contraseña'>
						<Input
							type='password'
							autoComplete='password'
							value={formikChangePassword.values.password}
							isTouched={formikChangePassword.touched.password}
							invalidFeedback={formikChangePassword.errors.password}
							validFeedback='Looks good!'
							isValid={formikChangePassword.isValid}
							onChange={formikChangePassword.handleChange}
							onBlur={formikChangePassword.handleBlur}
						/>
					</FormGroup>
				</div>
				<div className='col-12'>
					<FormGroup id='verifyPassword' isFloating label='Repetir contraseña'>
						<Input
							type='password'
							autoComplete='verifyPassword'
							value={formikChangePassword.values.verifyPassword}
							isTouched={formikChangePassword.touched.verifyPassword}
							invalidFeedback={formikChangePassword.errors.verifyPassword}
							validFeedback='Looks good!'
							isValid={formikChangePassword.isValid}
							onChange={formikChangePassword.handleChange}
							onBlur={formikChangePassword.handleBlur}
						/>
					</FormGroup>
				</div>
				<div className='col-12'>
					<Button
						color='primary'
						className='w-100 py-3'
						isDisable={isLoading}
						onClick={formikChangePassword.handleSubmit}>
						{isLoading && <Spinner isSmall inButton isGrow />}
						Recuperar contraseña
					</Button>
				</div>
			</div>
		</>
	);
};
