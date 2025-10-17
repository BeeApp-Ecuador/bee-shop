import React, { useContext, useEffect, useRef, useState } from 'react';
import { useFormik } from 'formik';

import { useMeasure } from 'react-use';
import Button from '../../../components/bootstrap/Button';
import Page from '../../../layout/Page/Page';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import Card, {
	CardBody,
	CardFooter,
	CardFooterRight,
	CardHeader,
	CardLabel,
	CardTabItem,
	CardTitle,
} from '../../../components/bootstrap/Card';
import UserImageWebp from '../../../assets/img/wanna/wanna1.webp';
import UserImage from '../../../assets/img/wanna/wanna1.png';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import Input from '../../../components/bootstrap/forms/Input';
import showNotification from '../../../components/extras/showNotification';
import Icon from '../../../components/icon/Icon';
import Alert from '../../../components/bootstrap/Alert';
import Avatar from '../../../components/Avatar';
import Progress from '../../../components/bootstrap/Progress';

import Modal, { ModalBody, ModalHeader, ModalTitle } from '../../../components/bootstrap/Modal';
import { demoPagesMenu } from '../../../menu';
import AuthContext from '../../../contexts/authContext';
import MapCard, { MapCardRef } from '../../../components/profile/MapCard';
import { useChangePasswordMutation } from '../../../store/api/authApi';
import Spinner from '../../../components/bootstrap/Spinner';

const ProfilePage = () => {
	const { user: shop } = useContext(AuthContext);

	const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [changePassword] = useChangePasswordMutation();
	const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

	useEffect(() => {
		if ('geolocation' in navigator) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					setCoords({
						lat: position.coords.latitude,
						lng: position.coords.longitude,
					});
				},
				(err) => {
					setError('No se pudo obtener la ubicación. Activa los permisos de ubicación.');
					console.error(err);
				},
			);
		} else {
			setError('Tu navegador no soporta geolocalización.');
		}
	}, []);

	const [searchAddress, setSearchAddress] = useState<string>('');

	const formikPassword = useFormik({
		initialValues: {
			currentPassword: '',
			newPassword: '',
			confirmNewPassword: '',
		},
		validate: (values) => {
			const errors: { [key: string]: string } = {};
			if (!values.currentPassword) {
				errors.currentPassword = 'Requerido';
			}
			if (!values.newPassword) {
				errors.newPassword = 'Requerido';
			} else if (values.newPassword.length < 6) {
				errors.newPassword = 'La contraseña debe tener al menos 6 caracteres';
			} else if (
				!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}/.test(
					values.newPassword,
				)
			) {
				errors.newPassword =
					'La contraseña debe contener al menos una letra mayúscula, una letra minúscula, un número y uno de estos caracteres especiales (@ $ ! % * ? &)';
			}
			if (values.newPassword !== values.confirmNewPassword) {
				errors.confirmNewPassword = 'Las contraseñas no coinciden';
			}
			return errors;
		},
		onSubmit: async (values) => {
			const { confirmNewPassword, ...body } = values;
			setIsUpdatingPassword(true);
			const { data, error } = await changePassword(body);
			setIsUpdatingPassword(false);
			if (error) {
				showNotification(
					<span className='d-flex align-items-center'>
						<Icon icon='Error' size='lg' className='me-1' />
						<span>Error</span>
					</span>,
					'Ocurrió un error al actualizar la contraseña, intenta nuevamente',
					'danger',
				);
			}
			if (data) {
				showNotification(
					<span className='d-flex align-items-center'>
						<Icon icon='Success' size='lg' className='me-1' />
						<span>Éxito</span>
					</span>,
					'Contraseña actualizada correctamente',
					'success',
				);
			}
		},
	});
	const [ref, { height }] = useMeasure<HTMLDivElement>();
	const mapRef = useRef<MapCardRef>(null);
	const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);

	const handleCoordsChange = (coords: { lat: number; lng: number }) => {
		console.log('Nuevas coordenadas:', coords);
	};

	return (
		<PageWrapper title={demoPagesMenu.singlePages.subMenu.fluidSingle.text}>
			<Page container='fluid'>
				<div className='row'>
					<div className='col-xxl-4 col-xl-6'>
						<Card ref={ref} className='shadow-3d-primary'>
							<CardBody>
								<div className='row g-5'>
									<div className='col-12'>
										<div className='d-flex align-items-center'>
											<div className='flex-shrink-0'>
												<Avatar
													srcSet={UserImageWebp}
													src={UserImage}
													className='rounded-circle'
												/>
											</div>
											<div className='flex-grow-1 ms-3'>
												<div className='h2 fw-bold'>
													{shop.businessName}
												</div>
												<div className='h5 text-muted'>Founder</div>
											</div>
										</div>
									</div>
									<div className='col-12'>
										<div className='row g-3'>
											<div className='col-12'>
												<div className='d-flex align-items-center'>
													<div className='flex-shrink-0'>
														<Icon icon='Mail' size='3x' color='info' />
													</div>
													<div className='flex-grow-1 ms-3'>
														<div className='fw-bold fs-5 mb-0'>
															{shop.email}
														</div>
														<div className='text-muted'>Correo</div>
													</div>
												</div>
											</div>
											<div className='col-12'>
												<div className='d-flex align-items-center'>
													<div className='flex-shrink-0'>
														<Icon
															icon='PhoneIphone'
															size='3x'
															color='info'
														/>
													</div>
													<div className='flex-grow-1 ms-3'>
														<div className='fw-bold fs-5 mb-0'>
															{shop.prefix} {shop.phone}
														</div>
														<div className='text-muted'>Teléfono</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</CardBody>
						</Card>
						<Card>
							<CardBody>
								<div className='d-flex justify-content-between'>
									<p>
										Estamos verificando tu información, te avisaremos cuando
										todo esté listo.
									</p>
									<p className='fw-bold'>70%</p>
								</div>
								<Progress value={70} />
							</CardBody>
						</Card>

						<Card>
							<CardHeader>
								<CardLabel>
									<CardTitle>Descripción</CardTitle>
								</CardLabel>
							</CardHeader>
							<CardBody>
								<p>{shop.description}</p>
							</CardBody>
						</Card>
					</div>
					<div className='col-xxl-8 col-xl-6'>
						<Card hasTab>
							<CardTabItem id='profile' title='Representante' icon='Contacts'>
								<Alert isLight className='border-0' shadow='md' icon='LocalPolice'>
									La información que se muestra aquí no es compartida con
									terceros.
								</Alert>
								<Card
									className='rounded-2'
									tag='form'
									// onSubmit={formik.handleSubmit}
								>
									<CardHeader>
										<CardLabel icon='Person'>
											<CardTitle>Representante Legal</CardTitle>
										</CardLabel>
									</CardHeader>
									<CardBody>
										<div className='row g-4'>
											<FormGroup
												className='col-md-12'
												id='formName'
												label='Nombre'>
												<Input disabled value={shop.nameLegalAgent} />
											</FormGroup>
											<FormGroup
												className='col-md-12'
												id='formAddress'
												label='Dirección'>
												<Input disabled value={shop.addressLegalAgent} />
											</FormGroup>

											<FormGroup
												className='col-lg-6'
												id='formEmailAddress'
												label='Identificación'>
												<Input
													type='text'
													disabled
													value={shop.ciLegalAgent}
												/>
											</FormGroup>
											<FormGroup
												className='col-lg-6'
												id='formPhone'
												label='Teléfono'>
												<Input
													type='tel'
													disabled
													value={
														shop.prefixLegalAgent + shop.phoneLegalAgent
													}
												/>
											</FormGroup>
										</div>
									</CardBody>
								</Card>
							</CardTabItem>
							<CardTabItem id='address' title='Dirección' icon='HolidayVillage'>
								<Card
									className='rounded-2'
									tag='form'
									// onSubmit={formik.handleSubmit}
								>
									<CardHeader>
										<CardLabel icon='HolidayVillage'>
											<CardTitle>Dirección del local</CardTitle>
										</CardLabel>
									</CardHeader>
									<CardBody>
										<div className='row g-4'>
											<FormGroup
												className='col-md-4'
												id='formCountry'
												label='País'>
												<Input disabled value={shop.country} />
											</FormGroup>
											<FormGroup
												className='col-md-4'
												id='formState'
												label='Provincia'>
												<Input disabled value={shop.province} />
											</FormGroup>
											<FormGroup
												className='col-md-4'
												id='formCity'
												label='Ciudad'>
												<Input disabled value={shop.city} />
											</FormGroup>
											<FormGroup
												className='col-12'
												id='formAddressLine'
												label='Dirección'>
												<Input disabled value={shop.address} />
											</FormGroup>
											<FormGroup
												className='col-12'
												id='formAddressLine'
												label='Buscar en el mapa'>
												<Input
													id='formAddressLine'
													value={searchAddress}
													onChange={(e) =>
														setSearchAddress(e.target.value)
													}
												/>
											</FormGroup>
											<MapCard
												lat={coords?.lat ?? '-2.90055'}
												lng={coords?.lng ?? '-79.00454'}
												heightE='300px'
												onCoordsChange={handleCoordsChange}
												ref={mapRef}
											/>
										</div>
									</CardBody>
									<CardFooter>
										<CardFooterRight>
											<Button type='submit' color='primary' icon='Save'>
												Guardar
											</Button>
										</CardFooterRight>
									</CardFooter>
								</Card>
							</CardTabItem>
							<CardTabItem id='profile2' title='Contraseña' icon='Lock'>
								<Card
									className='rounded-2'
									tag='form'
									onSubmit={formikPassword.handleSubmit}>
									<CardHeader>
										<CardLabel icon='Lock'>
											<CardTitle>Cambiar Contraseña</CardTitle>
										</CardLabel>
									</CardHeader>
									<CardBody>
										<div className='row g-4'>
											<FormGroup
												className='col-lg-6'
												id='currentPassword'
												label='Contraseña Actual'>
												<Input
													placeholder='Contraseña Actual'
													type='password'
													value={formikPassword.values.currentPassword}
													isTouched={
														formikPassword.touched.currentPassword
													}
													invalidFeedback={
														formikPassword.errors.currentPassword
													}
													isValid={formikPassword.isValid}
													onChange={formikPassword.handleChange}
													onBlur={formikPassword.handleBlur}
													id='currentPassword'
												/>
											</FormGroup>
											<div className='w-100 m-0' />
											<FormGroup
												className='col-lg-6'
												id='newPassword'
												label='Nueva Contraseña'>
												<Input
													placeholder='Nueva Contraseña'
													type='password'
													value={formikPassword.values.newPassword}
													isTouched={formikPassword.touched.newPassword}
													invalidFeedback={
														formikPassword.errors.newPassword
													}
													isValid={formikPassword.isValid}
													onChange={formikPassword.handleChange}
													onBlur={formikPassword.handleBlur}
													id='newPassword'
												/>
											</FormGroup>
											<div className='w-100 m-0' />
											<FormGroup
												className='col-lg-6'
												id='confirmNewPassword'
												label='Confirmar Nueva Contraseña'>
												<Input
													placeholder='Confirmar Nueva Contraseña'
													type='password'
													value={formikPassword.values.confirmNewPassword}
													isTouched={
														formikPassword.touched.confirmNewPassword
													}
													invalidFeedback={
														formikPassword.errors.confirmNewPassword
													}
													isValid={formikPassword.isValid}
													onChange={formikPassword.handleChange}
													onBlur={formikPassword.handleBlur}
													id='confirmNewPassword'
												/>
											</FormGroup>
										</div>
									</CardBody>
									<CardFooter>
										<CardFooterRight>
											<Button
												color='primary'
												icon='Save'
												isDisable={isUpdatingPassword}
												onClick={formikPassword.handleSubmit}>
												{isUpdatingPassword && (
													<Spinner isSmall inButton isGrow />
												)}
												Cambiar Contraseña
											</Button>
										</CardFooterRight>
									</CardFooter>
								</Card>
							</CardTabItem>
						</Card>
					</div>
				</div>

				<Modal setIsOpen={setSelectedImage} isOpen={!!selectedImage} isCentered>
					<ModalHeader setIsOpen={setSelectedImage}>
						<ModalTitle id='preview'>Preview</ModalTitle>
					</ModalHeader>
					<ModalBody>
						<img src={selectedImage} alt='eneme' />
					</ModalBody>
				</Modal>
			</Page>
		</PageWrapper>
	);
};

export default ProfilePage;
