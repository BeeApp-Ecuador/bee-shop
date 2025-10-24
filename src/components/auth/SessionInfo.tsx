import React, { useState } from 'react';
import { FormikProps } from 'formik';
import { RegisterFormValues } from '../../pages/presentation/auth/Login';
import Card, { CardBody } from '../bootstrap/Card';
import FormGroup from '../bootstrap/forms/FormGroup';
import Input from '../bootstrap/forms/Input';
import Icon from '../icon/Icon';

const SessionInfo = ({ formikRegister }: { formikRegister: FormikProps<RegisterFormValues> }) => {
	const [showPassword, setShowPassword] = useState<boolean>(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
	const hasError = !!(formikRegister.touched.password && formikRegister.errors.password);
	const hasConfirmError = !!(
		formikRegister.touched.confirmPassword && formikRegister.errors.confirmPassword
	);
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

				<div className='col-12 col-sm-12'>
					<span className='text-muted small'>
						La contraseña debe tener al menos 6 caracteres y debe contener al menos una
						letra mayúscula, una letra minúscula, un número y uno de estos caracteres
						especiales (@ $ ! % * ? &)
					</span>
				</div>
				<div className='col-12 col-sm-6'>
					<FormGroup id='password' isFloating label='Contraseña'>
						<Input
							placeholder='Contraseña'
							type={showPassword ? 'text' : 'password'}
							value={formikRegister.values.password}
							isTouched={formikRegister.touched.password}
							invalidFeedback={formikRegister.errors.password}
							isValid={formikRegister.isValid}
							onChange={formikRegister.handleChange}
							onBlur={formikRegister.handleBlur}
							id='password'
							style={{
								paddingRight: '2.5rem', // espacio para el icono
								position: 'relative', // mantiene compatibilidad con el floating label
							}}
						/>

						<span
							onClick={() => setShowPassword(!showPassword)}
							className='password-toggle position-absolute'
							style={{
								top: '50%',
								right: '2.5rem',
								transform: hasError ? 'translateY(-100%)' : 'translateY(-50%)',
								color: '#6c757d',
								cursor: 'pointer',
								zIndex: 3,
								pointerEvents: 'auto',
							}}>
							<Icon icon={showPassword ? 'VisibilityOff' : 'Visibility'} />
						</span>
					</FormGroup>
				</div>
				<div className='col-12 col-sm-6'>
					<FormGroup id='confirmPassword' isFloating label='Confirmar Contraseña'>
						<Input
							placeholder='Confirmar Contraseña'
							type={showConfirmPassword ? 'text' : 'password'}
							value={formikRegister.values.confirmPassword}
							isTouched={formikRegister.touched.confirmPassword}
							invalidFeedback={formikRegister.errors.confirmPassword}
							isValid={formikRegister.isValid}
							onChange={formikRegister.handleChange}
							onBlur={formikRegister.handleBlur}
							id='confirmPassword'
							style={{
								paddingRight: '2.5rem', // espacio para el icono
								position: 'relative', // mantiene compatibilidad con el floating label
							}}
						/>

						<span
							onClick={() => setShowConfirmPassword(!showConfirmPassword)}
							className='password-toggle position-absolute'
							style={{
								top: '50%',
								right: '2.5rem',
								transform: hasConfirmError
									? 'translateY(-100%)'
									: 'translateY(-50%)',
								color: '#6c757d',
								cursor: 'pointer',
								zIndex: 3,
								pointerEvents: 'auto',
							}}>
							<Icon icon={showConfirmPassword ? 'VisibilityOff' : 'Visibility'} />
						</span>
					</FormGroup>
				</div>
			</CardBody>
		</Card>
	);
};
export default SessionInfo;
