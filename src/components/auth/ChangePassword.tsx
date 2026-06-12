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
			// const errors: { email?: string } = {};
			// if (!values.email) {
			// 	errors.email = 'Email is required';
			// } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
			// 	errors.email = 'Invalid email address';
			// }
			// return errors;
		},
		validateOnChange: false,
		validateOnBlur: true,
		onSubmit: async (values) => {
			setIsLoading(true);
			// await sendCode(values.email);
			// setIsLoading(false);
		},
	});

	return (
		<>
			<div className='row g-4'>
				<div className='col-12'>
					<FormGroup id='password' isFloating label='Password'>
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
					<FormGroup id='verifyPassword' isFloating label='Password'>
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
