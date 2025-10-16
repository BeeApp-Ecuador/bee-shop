import React, { FC, useCallback, useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import { FormikHelpers, useFormik } from 'formik';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import Page from '../../../layout/Page/Page';
import Card, { CardBody } from '../../../components/bootstrap/Card';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import Input from '../../../components/bootstrap/forms/Input';
import Button from '../../../components/bootstrap/Button';
import useDarkMode from '../../../hooks/useDarkMode';
import AuthContext from '../../../contexts/authContext';
import { getUserDataWithUsername } from '../../../common/data/userDummyData';
import {
	useLoginMutation,
	useRegisterMutation,
	useSendEmailVerificationMutation,
} from '../../../store/api/authApi';
import { File } from 'buffer';
import LegalAgentInfo from './components/LegalAgentInfo';
import BusinessInfo from './components/BusinessInfo';
import LocationInfo from './components/LocationInfo';
import SessionInfo from './components/SessionInfo';
import Modal, {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
} from '../../../components/bootstrap/Modal';
import Spinner from '../../../components/bootstrap/Spinner';
import VerifyCode from './components/VerifyCode';
import { getCountryByDialCode } from '../../../utils/getCountries';
import LoginInfo from './components/LoginInfo';

export interface RegisterFormValues {
	nameLegalAgent: string;
	ciLegalAgent: string;
	prefixLegalAgent: string;
	phoneLegalAgent: string;
	addressLegalAgent: string;
	identificationLegal: File | null;
	// Bussiness Info
	legalName: string;
	businessName: string;
	description: string;
	ruc: string;
	prefix: string;
	phone: string;
	img: File | null;
	identificationBusiness: File | null;
	// Location Info
	country: string;
	province: string;
	city: string;
	address: string;
	// Session Info
	email: string;
	password: string;
	confirmPassword: string;
}

export interface LoginFormValues {
	email: string;
	password: string;
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
	const { setUser } = useContext(AuthContext);

	const { darkModeStatus } = useDarkMode();

	const [singUpStatus, setSingUpStatus] = useState<boolean>(!!isSignUp);
	const [isOpen, setIsOpen] = useState(false);
	const [showVerifyCode, setShowVerifyCode] = useState(false);
	const [error, setError] = useState<string>('');

	const navigate = useNavigate();
	const handleOnClick = useCallback(() => navigate('/'), [navigate]);
	const [registerShop] = useRegisterMutation();
	const [sendCode] = useSendEmailVerificationMutation();
	const [showSuccess, setShowSuccess] = useState(false);

	const [login] = useLoginMutation();

	const handleSendCode = async (email: string) => {
		const { data, error } = await sendCode({ email, role: 'SHOP' });
		if (error) {
			console.log(error);
			if (error && 'status' in error && error.status === 409) {
				setError('El email ya está en uso.');
				setIsOpen(true);
				return;
			}
			setError('Error al enviar el correo de verificación.');
			setIsOpen(true);
			return;
		}
		if (data && data.statusCode === 201) {
			setShowVerifyCode(true);
		}
	};

	const handleRegister = async (
		values: RegisterFormValues,
		formikHelpers: FormikHelpers<RegisterFormValues>,
	) => {
		const formData = new FormData();

		for (const key in values) {
			formData.append(key, values[key]);
		}
		const { data, error } = await registerShop(formData);
		if (error) {
			setIsLoading(false);
			console.error('Registration failed, error:', error);
			if (error && 'status' in error && error.status === 409) {
				formikHelpers.setFieldError('email', 'Email ya está en uso.');
				setError('El email ya está en uso.');
				setIsOpen(true);
			}
			return;
		} else {
			setIsLoading(false);
			if (data && data.statusCode === 201) {
				setShowVerifyCode(false);
				setShowSuccess(true);
				formikRegister.resetForm();
				// setTimeout(() => {
				// 	setShowSuccess(false);
				// 	setSingUpStatus(false);
				// }, 2000);
			}
		}
	};
	const handleLogin = async (values: LoginFormValues) => {
		setIsLoading(true);
		const { data, error } = await login(values);
		if (error) {
			setIsLoading(false);
			console.log(error);
			if (error && 'status' in error && error.status === 401) {
				setError('Credenciales inválidas.');
				setIsOpen(true);
				return;
			} else {
				setError('Error al iniciar sesión. Inténtalo de nuevo más tarde.');
				setIsOpen(true);
				return;
			}
		}
		if (data && data.statusCode === 200) {
			console.log(data.shop);
			setIsLoading(false);
			setUser(data.shop);
			handleOnClick();
		}
	};
	const formikLogin = useFormik<LoginFormValues>({
		// enableReinitialize: true,
		initialValues: {
			email: '',
			password: '',
		},
		validate: (values) => {
			const errors: Partial<Record<keyof LoginFormValues, string>> = {};
			if (!values.email) {
				errors.email = 'Requerido';
			} else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
				errors.email = 'Email inválido';
			}

			if (!values.password) {
				errors.password = 'Requerido';
			}

			return errors;
		},
		validateOnChange: false,
		validateOnBlur: true,
		onSubmit: async (values) => {
			await handleLogin(values);
		},
	});

	const formikRegister = useFormik<RegisterFormValues>({
		initialValues: {
			nameLegalAgent: '',
			ciLegalAgent: '',
			prefixLegalAgent: '',
			phoneLegalAgent: '',
			addressLegalAgent: '',
			identificationLegal: null,
			// Bussiness Info
			legalName: '',
			businessName: '',
			description: '',
			ruc: '',
			prefix: '',
			phone: '',
			img: null,
			identificationBusiness: null,
			// Location Info
			country: '',
			province: '',
			city: '',
			address: '',
			// Session Info
			email: '',
			password: '',
			confirmPassword: '',
		},
		validate: (values) => {
			const errors: Partial<Record<keyof RegisterFormValues, string>> = {};

			// Legal Agent Info Validations
			if (!values.nameLegalAgent) {
				errors.nameLegalAgent = 'Requerido';
			}
			if (!values.ciLegalAgent) {
				errors.ciLegalAgent = 'Requerido';
			}
			if (!values.prefixLegalAgent) {
				errors.prefixLegalAgent = 'Requerido';
			}
			if (!values.phoneLegalAgent) {
				errors.phoneLegalAgent = 'Requerido';
			}

			const country = getCountryByDialCode(values.prefixLegalAgent);

			if (values.phoneLegalAgent && values.phoneLegalAgent.length < country!.minLength!) {
				errors.phoneLegalAgent = 'Número de teléfono inválido';
			}
			if (!values.addressLegalAgent) {
				errors.addressLegalAgent = 'Requerido';
			}
			if (!values.identificationLegal) {
				errors.identificationLegal = 'Requerido';
			}
			if (values.identificationLegal === undefined) {
				errors.identificationLegal = 'Requerido';
			}

			// Business Info Validations
			if (!values.legalName) {
				errors.legalName = 'Requerido';
			}
			if (!values.businessName) {
				errors.businessName = 'Requerido';
			}
			if (!values.ruc) {
				errors.ruc = 'Requerido';
			}
			if (!values.prefix) {
				errors.prefix = 'Requerido';
			}
			if (!values.phone) {
				errors.phone = 'Requerido';
			}
			const countryBusiness = getCountryByDialCode(values.prefix);
			if (values.phone && values.phone.length < countryBusiness!.minLength!) {
				errors.phone = 'Número de teléfono inválido';
			}
			if (!values.description) {
				errors.description = 'Requerido';
			}
			// File Validations
			if (!values.img) {
				errors.img = 'Requerido';
			}
			if (values.img === undefined) {
				errors.img = 'Requerido';
			}
			if (!values.identificationBusiness) {
				errors.identificationBusiness = 'Requerido';
			}
			if (values.identificationBusiness === undefined) {
				errors.identificationBusiness = 'Requerido';
			}

			// Location Info Validations
			if (!values.country) {
				errors.country = 'Requerido';
			}
			if (!values.province) {
				errors.province = 'Requerido';
			}
			if (!values.city) {
				errors.city = 'Requerido';
			}
			if (!values.address) {
				errors.address = 'Requerido';
			}

			// Session Info Validations
			if (!values.email) {
				errors.email = 'Requerido';
			} else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
				errors.email = 'Email inválido';
			}

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

			if (!values.confirmPassword) {
				errors.confirmPassword = 'Requerido';
			} else if (values.confirmPassword !== values.password) {
				errors.confirmPassword = 'Las contraseñas no coinciden';
			}

			return errors;
		},
		validateOnChange: false,
		validateOnBlur: true,
		onSubmit: async (values, formikHelpers) => {
			setIsLoading(true);
			await handleSendCode(values.email);
			setIsLoading(false);
		},
	});

	const [isLoading, setIsLoading] = useState<boolean>(false);

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
							'w-100 mt-5 mb-5': singUpStatus, // Bootstrap no tiene w-80 por defecto
						})}
						style={
							singUpStatus
								? { maxWidth: '80%', transition: 'all 0.4s ease-in-out' }
								: { transition: 'all 0.4s ease-in-out' }
						}>
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
										<img
											className='img-fluid'
											width={250}
											src='/logo.svg'
											alt=''
										/>
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
											<BusinessInfo formikRegister={formikRegister} />
											<LocationInfo formikRegister={formikRegister} />
											<SessionInfo formikRegister={formikRegister} />

											<div className='col-12'>
												<Button
													color='primary'
													className='w-100 py-3'
													isDisable={isLoading}
													onClick={formikRegister.handleSubmit}>
													{isLoading && (
														<Spinner isSmall inButton isGrow />
													)}
													Registrar
												</Button>
											</div>
										</>
									) : (
										<>
											<LoginInfo formikLogin={formikLogin} />
											<div className='col-12'>
												<Button
													color='primary'
													className='w-100 py-3'
													isDisable={isLoading}
													onClick={formikLogin.handleSubmit}>
													{isLoading && (
														<Spinner isSmall inButton isGrow />
													)}
													Ingresar
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
				<Modal
					isOpen={isOpen}
					setIsOpen={setIsOpen}
					titleId='exampleModalLabel'
					// isStaticBackdrop={staticBackdropStatus}
					// isScrollable={scrollableStatus}
					isCentered={true}
					size='sm'
					// fullScreen={fullScreenStatus}
					isAnimation={true}>
					<ModalHeader setIsOpen={() => setIsOpen(!isOpen)}>
						<ModalTitle id='exampleModalLabel'>Advertencia</ModalTitle>
					</ModalHeader>
					<ModalBody>
						<p>{error}</p>
					</ModalBody>
					<ModalFooter>
						<Button
							color='danger'
							isOutline
							className='border-0'
							onClick={() => setIsOpen(false)}>
							Close
						</Button>
						{/* <Button color='info' icon='Save'>
							Save changes
						</Button> */}
					</ModalFooter>
				</Modal>
				<Modal
					isOpen={showVerifyCode}
					setIsOpen={setShowVerifyCode}
					titleId='verifyCodeModalLabel'
					// isStaticBackdrop={staticBackdropStatus}
					// isScrollable={scrollableStatus}
					isCentered={true}
					size='lg'
					// fullScreen={fullScreenStatus}
					isAnimation={true}>
					<ModalHeader setIsOpen={() => setShowVerifyCode(!showVerifyCode)}>
						<ModalTitle id='verifyCodeModalLabel'>Verificar código</ModalTitle>
					</ModalHeader>
					<ModalBody>
						<VerifyCode
							email={formikRegister.values.email}
							onComplete={async () =>
								handleRegister(formikRegister.values, formikRegister)
							}
							resendCode={() => handleSendCode(formikRegister.values.email)}
						/>
					</ModalBody>
				</Modal>
				<Modal
					isOpen={showSuccess}
					setIsOpen={setShowSuccess}
					titleId='successModalLabel'
					// isStaticBackdrop={staticBackdropStatus}
					// isScrollable={scrollableStatus}
					isCentered={true}
					size='sm'
					// fullScreen={fullScreenStatus}
					isAnimation={true}>
					<ModalHeader setIsOpen={() => setShowSuccess(!showSuccess)}>
						<ModalTitle id='successModalLabel'>Éxito</ModalTitle>
					</ModalHeader>
					<ModalBody>
						<p>Registro completado con éxito. Por favor, inicia sesión.</p>
					</ModalBody>
					<ModalFooter>
						<Button
							color='success'
							isOutline
							className='border-0'
							onClick={() => {
								setSingUpStatus(false);
								return setShowSuccess(false);
							}}>
							Ok
						</Button>
					</ModalFooter>
				</Modal>
			</Page>
		</PageWrapper>
	);
};

export default Login;
