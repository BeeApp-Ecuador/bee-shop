import React, { FC, useCallback, useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import { FormikProps, useFormik } from 'formik';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import Page from '../../../layout/Page/Page';
import Card, { CardBody } from '../../../components/bootstrap/Card';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import Input from '../../../components/bootstrap/forms/Input';
import Button from '../../../components/bootstrap/Button';
import Logo from '../../../components/Logo';
import useDarkMode from '../../../hooks/useDarkMode';
import AuthContext from '../../../contexts/authContext';
import { getUserDataWithUsername } from '../../../common/data/userDummyData';
import Spinner from '../../../components/bootstrap/Spinner';
import { useLazyCheckEmailQuery } from '../../../store/api/auth.Api';
import Select from '../../../components/bootstrap/forms/Select';
import { getCountries } from '../../../utils/getCountries';

interface RegisterFormValues {
	nameLegalAgent: string;
	ciLegalAgent: string;
	prefixLegalAgent: string;
	phoneLegalAgent: string;
	addressLegalAgent: string;
}

interface ILoginHeaderProps {
	isNewUser?: boolean;
}
const LoginHeader: FC<ILoginHeaderProps> = ({ isNewUser }) => {
	if (isNewUser) {
		return (
			<>
				<div className='text-center h1 fw-bold mt-5'>Crear cuenta,</div>
				<div className='text-center h4 text-muted mb-5'>Regístrate para continuar</div>
			</>
		);
	}
	return (
		<>
			<div className='text-center h1 fw-bold mt-5'>Bienvenido,</div>
			<div className='text-center h4 text-muted mb-5'>Inicia sesión para continuar</div>
		</>
	);
};

interface ILoginProps {
	isSignUp?: boolean;
}
const Login: FC<ILoginProps> = ({ isSignUp }) => {
	const [checkEmail] = useLazyCheckEmailQuery();

	const { setUser } = useContext(AuthContext);

	const { darkModeStatus } = useDarkMode();

	const [signInPassword, setSignInPassword] = useState<boolean>(false);
	const [singUpStatus, setSingUpStatus] = useState<boolean>(!!isSignUp);

	const navigate = useNavigate();
	const handleOnClick = useCallback(() => navigate('/'), [navigate]);

	const usernameCheck = (username: string) => {
		console.log('usernameCheck', username);
		return !!getUserDataWithUsername(username);
	};

	const passwordCheck = (username: string, password: string) => {
		console.log('passwordCheck', username, password);
		return getUserDataWithUsername(username).password === password;
	};

	const formik = useFormik({
		enableReinitialize: true,
		initialValues: {
			loginUsername: 'tenesaca.999@gmail.co',
			loginPassword: '12345',
			// loginUsername: USERS.JOHN.username,
			// loginPassword: USERS.JOHN.password,
		},
		validate: (values) => {
			const errors: { loginUsername?: string; loginPassword?: string } = {};

			if (!values.loginUsername) {
				errors.loginUsername = 'Required';
			}

			if (!values.loginPassword) {
				errors.loginPassword = 'Required';
			}

			return errors;
		},
		validateOnChange: false,
		onSubmit: (values) => {
			console.log('Login submit', values);
			if (usernameCheck(values.loginUsername)) {
				if (passwordCheck(values.loginUsername, values.loginPassword)) {
					if (setUser) {
						setUser(values.loginUsername);
					}

					handleOnClick();
				} else {
					formik.setFieldError('loginPassword', 'Username and password do not match.');
				}
			}
		},
	});

	const formikRegister = useFormik<RegisterFormValues>({
		// enableReinitialize: true,
		initialValues: {
			nameLegalAgent: '',
			ciLegalAgent: '',
			prefixLegalAgent: '',
			phoneLegalAgent: '',
			addressLegalAgent: '',
		},

		onSubmit(values, formikHelpers) {},
	});

	const [isLoading, setIsLoading] = useState<boolean>(false);
	const handleContinue = () => {
		console.log('Checking user... handleContinue', formik.values.loginUsername);
		setIsLoading(true);
		setTimeout(async () => {
			const [respExists] = await checkEmail(formik.values.loginUsername).unwrap();
			console.log('respExists', respExists);

			if (respExists.exists) {
				// 	formik.setFieldError('loginUsername', 'No such user found in the system.');
				// } else {
				// 	setSignInPassword(true);
			}
			setIsLoading(false);
		}, 1000);
		// setTimeout(() => {

		// 	if (
		// 		!Object.keys(USERS).find(
		// 			(f) => USERS[f].username.toString() === formik.values.loginUsername,
		// 		)
		// 	) {
		// 		formik.setFieldError('loginUsername', 'No such user found in the system.');
		// 	} else {
		// 		setSignInPassword(true);
		// 	}
		// 	setIsLoading(false);
		// }, 1000);
	};

	return (
		<PageWrapper
			isProtected={false}
			title={singUpStatus ? 'Registro' : 'Login'}
			className={classNames({ 'bg-dark': !singUpStatus, 'bg-light': singUpStatus })}>
			<Page className='p-0'>
				<div className='row h-100 align-items-center justify-content-center'>
					<div
						className={classNames('shadow-3d-container', {
							'col-xl-4 col-lg-6 col-md-8': !singUpStatus,
							'w-100': singUpStatus, // Bootstrap no tiene w-80 por defecto
						})}
						style={singUpStatus ? { maxWidth: '80%' } : {}}>
						<Card className='shadow-3d-dark' data-tour='login-page'>
							<CardBody>
								<div className='text-center my-5'>
									<Link
										to='/'
										className={classNames(
											'text-decoration-none  fw-bold display-2',
											{
												'text-dark': !darkModeStatus,
												'text-light': darkModeStatus,
											},
										)}
										aria-label='Facit'>
										<Logo width={200} />
									</Link>
								</div>
								<div
									className={classNames('rounded-3', {
										'bg-l10-dark': !darkModeStatus,
										'bg-dark': darkModeStatus,
									})}>
									<div className='row row-cols-2 g-3 pb-3 px-3 mt-0'>
										<div className='col'>
											<Button
												color={darkModeStatus ? 'light' : 'dark'}
												isLight={singUpStatus}
												className='rounded-1 w-100'
												size='lg'
												onClick={() => {
													setSignInPassword(false);
													setSingUpStatus(!singUpStatus);
												}}>
												Login
											</Button>
										</div>
										<div className='col'>
											<Button
												color={darkModeStatus ? 'light' : 'dark'}
												isLight={!singUpStatus}
												className='rounded-1 w-100'
												size='lg'
												onClick={() => {
													setSignInPassword(false);
													setSingUpStatus(!singUpStatus);
												}}>
												Registro
											</Button>
										</div>
									</div>
								</div>

								<LoginHeader isNewUser={singUpStatus} />

								<form className='row g-4'>
									{singUpStatus ? (
										<>
											<LegalAgentInfo formikRegister={formikRegister} />
											<div className='col-12'>
												<Button
													color='info'
													className='w-100 py-3'
													onClick={handleOnClick}>
													Registrar
												</Button>
											</div>
										</>
									) : (
										<>
											<div className='col-12'>
												<FormGroup
													id='loginUsername'
													isFloating
													label='Your email or username'
													className={classNames({
														'd-none': signInPassword,
													})}>
													<Input
														autoComplete='username'
														value={formik.values.loginUsername}
														isTouched={formik.touched.loginUsername}
														invalidFeedback={
															formik.errors.loginUsername
														}
														isValid={formik.isValid}
														onChange={formik.handleChange}
														onBlur={formik.handleBlur}
														onFocus={() => {
															formik.setErrors({});
														}}
													/>
												</FormGroup>
												{signInPassword && (
													<div className='text-center h4 mb-3 fw-bold'>
														Hi, {formik.values.loginUsername}.
													</div>
												)}
												<FormGroup
													id='loginPassword'
													isFloating
													label='Password'
													className={classNames({
														'd-none': !signInPassword,
													})}>
													<Input
														type='password'
														autoComplete='current-password'
														value={formik.values.loginPassword}
														isTouched={formik.touched.loginPassword}
														invalidFeedback={
															formik.errors.loginPassword
														}
														validFeedback='Looks good!'
														isValid={formik.isValid}
														onChange={formik.handleChange}
														onBlur={formik.handleBlur}
													/>
												</FormGroup>
											</div>
											<div className='col-12'>
												<Button
													color='warning'
													className='w-100 py-3'
													onClick={formik.handleSubmit}>
													Login
												</Button>
											</div>
										</>
									)}
								</form>
							</CardBody>
						</Card>
						<div className='text-center'>
							<a
								href='/'
								className={classNames('text-decoration-none me-3', {
									'link-light': !singUpStatus,
									'link-dark': singUpStatus,
								})}>
								Privacy policy
							</a>
							<a
								href='/'
								className={classNames('link-light text-decoration-none', {
									'link-light': !singUpStatus,
									'link-dark': singUpStatus,
								})}>
								Terms of use
							</a>
						</div>
					</div>
				</div>
			</Page>
		</PageWrapper>
	);
};

export default Login;

const LegalAgentInfo = ({
	formikRegister,
}: {
	formikRegister: FormikProps<RegisterFormValues>;
}) => {
	const countryOptions = getCountries().map((country) => ({
		value: country.dialCode,
		label: `${country.flag} +${country.dialCode} ${country.name}`,
		text: `+${country.dialCode} ${country.name}`,
	}));
	return (
		<Card className='shadow-3d-dark p-4 mb-4'>
			<CardBody className='g-2 row'>
				<div className='col-12'>
					<h5>Datos del representante legal</h5>
				</div>
				<div className='col-12 col-sm-6'>
					<FormGroup id='nameLegalAgent' isFloating label='Nombres y apellidos'>
						<Input
							type='text'
							autoComplete='nameLegalAgent'
							value={formikRegister.values.nameLegalAgent}
							isTouched={formikRegister.touched.nameLegalAgent}
							invalidFeedback={formikRegister.errors.nameLegalAgent}
							isValid={formikRegister.isValid}
							onChange={formikRegister.handleChange}
							onBlur={formikRegister.handleBlur}
						/>
					</FormGroup>
				</div>
				<div className='col-12 col-sm-6'>
					<FormGroup id='ciLegalAgent' isFloating label='Identificación'>
						<Input
							type='text'
							autoComplete='ciLegalAgent'
							value={formikRegister.values.ciLegalAgent}
							isTouched={formikRegister.touched.ciLegalAgent}
							invalidFeedback={formikRegister.errors.ciLegalAgent}
							isValid={formikRegister.isValid}
							onChange={formikRegister.handleChange}
							onBlur={formikRegister.handleBlur}
						/>
					</FormGroup>
				</div>
				<div className='col-6 col-sm-3'>
					<FormGroup id='prefixLegalAgent' label='Prefijo' isFloating>
						<Select
							ariaLabel='Prefijo'
							placeholder='Seleccione un prefijo'
							title='Prefijo'
							defaultValue='ruc'
							list={countryOptions}
							value={formikRegister.values.prefixLegalAgent}
							isTouched={formikRegister.touched.prefixLegalAgent}
							invalidFeedback={formikRegister.errors.prefixLegalAgent}
							isValid={formikRegister.isValid}
							onChange={formikRegister.handleChange}
							onBlur={formikRegister.handleBlur}
						/>
					</FormGroup>
				</div>
				<div className='col-6 col-sm-3'>
					<FormGroup id='phoneLegalAgent' isFloating label='Número de teléfono'>
						<Input
							type='tel'
							autoComplete='phoneLegalAgent'
							value={formikRegister.values.phoneLegalAgent}
							isTouched={formikRegister.touched.phoneLegalAgent}
							invalidFeedback={formikRegister.errors.phoneLegalAgent}
							isValid={formikRegister.isValid}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
								const val = e.target.value.replace(/\D/g, '');
								formikRegister.setFieldValue('phoneLegalAgent', val);
							}}
							onBlur={formikRegister.handleBlur}
						/>
					</FormGroup>
				</div>
				<div className='col-12 col-sm-6'>
					<FormGroup id='addressLegalAgent' isFloating label='Dirección'>
						<Input
							type='text'
							autoComplete='addressLegalAgent'
							value={formikRegister.values.addressLegalAgent}
							isTouched={formikRegister.touched.addressLegalAgent}
							invalidFeedback={formikRegister.errors.addressLegalAgent}
							isValid={formikRegister.isValid}
							onChange={formikRegister.handleChange}
							onBlur={formikRegister.handleBlur}
						/>
					</FormGroup>
				</div>
				<div className='col-12'>
					<FormGroup id='signup-surname' isFloating label='Your surname'>
						<Input autoComplete='family-name' />
					</FormGroup>
				</div>
				<div className='col-12'>
					<FormGroup id='signup-password' isFloating label='Password'>
						<Input type='password' autoComplete='password' />
					</FormGroup>
				</div>
			</CardBody>
		</Card>
	);
};
