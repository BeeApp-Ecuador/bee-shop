import React from 'react';
import { FormikProps } from 'formik';
import Card, { CardBody } from '../../../../components/bootstrap/Card';
import { RegisterFormValues } from '../Login';
import FormGroup from '../../../../components/bootstrap/forms/FormGroup';
import Input from '../../../../components/bootstrap/forms/Input';

const SessionInfo = ({ formikRegister }: { formikRegister: FormikProps<RegisterFormValues> }) => {
	return (
		<Card className='shadow-3d-dark p-4 mb-4'>
			<CardBody className='g-2 row'>
				<div className='col-12'>
					<h5>Datos de Inicio de Sesión</h5>
				</div>

				<div className='col-12'>
					<FormGroup id='email' isFloating label='Email'>
						<Input
							type='email'
							autoComplete='email'
							value={formikRegister.values.email}
							isTouched={formikRegister.touched.email}
							invalidFeedback={formikRegister.errors.email}
							isValid={formikRegister.isValid}
							onChange={formikRegister.handleChange}
							onBlur={formikRegister.handleBlur}
						/>
					</FormGroup>
				</div>

				<div className='col-12 col-sm-6'>
					<FormGroup id='password' isFloating label='Contraseña'>
						<Input
							type='text'
							autoComplete='password'
							value={formikRegister.values.password}
							isTouched={formikRegister.touched.password}
							invalidFeedback={formikRegister.errors.password}
							isValid={formikRegister.isValid}
							onChange={formikRegister.handleChange}
							onBlur={formikRegister.handleBlur}
						/>
					</FormGroup>
				</div>
				<div className='col-12 col-sm-6'>
					<FormGroup id='confirmPassword' isFloating label='Confirmar Contraseña'>
						<Input
							type='text'
							autoComplete='confirmPassword'
							value={formikRegister.values.confirmPassword}
							isTouched={formikRegister.touched.confirmPassword}
							invalidFeedback={formikRegister.errors.confirmPassword}
							isValid={formikRegister.isValid}
							onChange={formikRegister.handleChange}
							onBlur={formikRegister.handleBlur}
						/>
					</FormGroup>
				</div>
			</CardBody>
		</Card>
	);
};
export default SessionInfo;
