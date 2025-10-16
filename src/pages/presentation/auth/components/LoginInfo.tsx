import React, { useState } from 'react';
import { FormikProps } from 'formik';
import { LoginFormValues } from '../Login';
import FormGroup from '../../../../components/bootstrap/forms/FormGroup';
import Input from '../../../../components/bootstrap/forms/Input';
import Icon from '../../../../components/icon/Icon';
import Button from '../../../../components/bootstrap/Button';

const LoginInfo = ({ formikLogin }: { formikLogin: FormikProps<LoginFormValues> }) => {
	// const [showPassword, setShowPassword] = useState<boolean>(false);
	// const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

	return (
		<>
			<div className='col-12'>
				<FormGroup id='email' isFloating label='Correo'>
					<Input
						autoComplete='email'
						type='email'
						value={formikLogin.values.email}
						isTouched={formikLogin.touched.email}
						invalidFeedback={formikLogin.errors.email}
						isValid={formikLogin.isValid}
						onChange={formikLogin.handleChange}
						onBlur={formikLogin.handleBlur}
						onFocus={() => {
							formikLogin.setErrors({});
						}}
					/>
				</FormGroup>
			</div>
			<div className='col-12'>
				<FormGroup id='password' isFloating label='Password'>
					<Input
						type='password'
						autoComplete='password'
						value={formikLogin.values.password}
						isTouched={formikLogin.touched.password}
						invalidFeedback={formikLogin.errors.password}
						validFeedback='Looks good!'
						isValid={formikLogin.isValid}
						onChange={formikLogin.handleChange}
						onBlur={formikLogin.handleBlur}
					/>
				</FormGroup>
			</div>
		</>
	);
};
export default LoginInfo;
