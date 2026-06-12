import { useFormik } from 'formik';
import React, { useState } from 'react';
import FormGroup from '../bootstrap/forms/FormGroup';
import Input from '../bootstrap/forms/Input';
import Button from '../bootstrap/Button';
import Spinner from '../bootstrap/Spinner';

export interface ForgotPasswordFormValues {
	email: string;
}

interface ForgotPasswordProps {
	sendCode: (email: string) => void;
}

export const ForgotPassword = ({ sendCode }: ForgotPasswordProps) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const formikForgotPassword = useFormik<ForgotPasswordFormValues>({
		initialValues: {
			email: '',
		},
		validate: (values) => {
			const errors: { email?: string } = {};
			if (!values.email) {
				errors.email = 'Email is required';
			} else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
				errors.email = 'Invalid email address';
			}
			return errors;
		},
		validateOnChange: false,
		validateOnBlur: true,
		onSubmit: async (values) => {
			setIsLoading(true);
			await sendCode(values.email);
			setIsLoading(false);
		},
	});

	return (
		<>
			<div className='row g-4'>
				<div className='col-12'>
					<FormGroup id='email' isFloating label='Correo'>
						<Input
							autoComplete='email'
							type='email'
							value={formikForgotPassword.values.email}
							isTouched={formikForgotPassword.touched.email}
							invalidFeedback={formikForgotPassword.errors.email}
							isValid={formikForgotPassword.isValid}
							onChange={formikForgotPassword.handleChange}
							onBlur={formikForgotPassword.handleBlur}
							onFocus={() => {
								formikForgotPassword.setErrors({});
							}}
						/>
					</FormGroup>
				</div>
				<div className='col-12'>
					<Button
						color='primary'
						className='w-100 py-3'
						isDisable={isLoading}
						onClick={formikForgotPassword.handleSubmit}>
						{isLoading && <Spinner isSmall inButton isGrow />}
						Recuperar contraseña
					</Button>
				</div>
			</div>
		</>
	);
};
