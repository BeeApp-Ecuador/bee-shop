import React, { useContext, useState } from 'react';
import { useFormik } from 'formik';
import dayjs from 'dayjs';
import classNames from 'classnames';
import { useMeasure } from 'react-use';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/bootstrap/Button';
import Page from '../../../layout/Page/Page';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import Card, {
	CardActions,
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

import Pic from '../../../assets/img/wanna/richie/richie.png';
import Pic2 from '../../../assets/img/wanna/richie/richie2.png';
import Pic3 from '../../../assets/img/wanna/richie/richie3.png';
import Pic4 from '../../../assets/img/wanna/richie/richie4.png';
import Pic5 from '../../../assets/img/wanna/richie/richie5.png';
import Pic6 from '../../../assets/img/wanna/richie/richie6.png';
import Pic7 from '../../../assets/img/wanna/richie/richie7.png';
import Pic8 from '../../../assets/img/wanna/richie/richie8.png';
import Modal, { ModalBody, ModalHeader, ModalTitle } from '../../../components/bootstrap/Modal';
import { demoPagesMenu } from '../../../menu';
import WannaImg1 from '../../../assets/img/wanna/slide/scene-1.png';
import WannaImg2 from '../../../assets/img/wanna/slide/scene-2.png';
import WannaImg5 from '../../../assets/img/wanna/slide/scene-5.png';
import WannaImg6 from '../../../assets/img/wanna/slide/scene-6.png';
import Carousel from '../../../components/bootstrap/Carousel';
import CarouselSlide from '../../../components/bootstrap/CarouselSlide';
import useDarkMode from '../../../hooks/useDarkMode';
import AuthContext from '../../../contexts/authContext';

const SingleFluidPage = () => {
	const { darkModeStatus } = useDarkMode();
	const { user: shop } = useContext(AuthContext);

	const navigate = useNavigate();
	const formik = useFormik({
		initialValues: {
			formPrefix: 'Prof.',
			formName: 'Timothy',
			formMiddleName: 'John',
			formSurName: 'Doe',
			formEmailAddress: 'tjohndoe@site.com',
			formPhone: '2575637401',
			formAddressLine: '711-2880 Nulla St.',
			formAddressLine2: 'Mankato',
			formCity: 'Mississippi',
			formState: 'USA',
			formZIP: '96522',
			formCurrentPassword: '',
			formNewPassword: '',
			formConfirmNewPassword: '',
		},
		onSubmit: (values) => {
			showNotification(
				<span className='d-flex align-items-center'>
					<Icon icon='Info' size='lg' className='me-1' />
					<span>Updated Information</span>
				</span>,
				JSON.stringify(values, null, 2),
			);
		},
	});
	const [ref, { height }] = useMeasure<HTMLDivElement>();

	const colors = ['primary', 'secondary', 'success', 'info', 'warning', 'danger', 'dark'];
	const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);
	const [gallerySeeAll, setGallerySeeAll] = useState(false);

	const images: { id: string; img: string }[] = [
		{ id: 'Pic', img: Pic },
		{ id: 'Pic2', img: Pic2 },
		{ id: 'Pic3', img: Pic3 },
		{ id: 'Pic4', img: Pic4 },
		{ id: 'Pic5', img: Pic5 },
		{ id: 'Pic6', img: Pic6 },
		{ id: 'Pic7', img: Pic7 },
		{ id: 'Pic8', img: Pic8 },
	];

	const GALLERY = (
		<div className='row g-4'>
			{images.map((item, index) => (
				<div key={item.id} className='col-xxl-2 col-lg-3 col-md-6'>
					<button
						type='button'
						onClick={() => setSelectedImage(item.img)}
						className={classNames(
							'ratio ratio-1x1',
							'rounded-2',
							'border-0',
							`bg-l${darkModeStatus ? 'o25' : '25'}-${colors[index % 7]}`,
							`bg-l${darkModeStatus ? 'o50' : '10'}-${colors[index % 7]}-hover`,
						)}>
						<img
							src={item.img}
							alt={item.id}
							width='100%'
							height='auto'
							className='object-fit-contain p-4'
						/>
					</button>
				</div>
			))}
		</div>
	);

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
													{/* {formik.values.formMiddleName &&
														` ${formik.values.formMiddleName.charAt(
															0,
														)}.`}{' '} */}
													{/* {formik.values.formSurName || 'Surname'} */}
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
						{/* <Card>
							<CardHeader>
								<CardLabel icon='ShowChart' iconColor='secondary'>
									<CardTitle>Statics</CardTitle>
								</CardLabel>
								<CardActions>
									Only in <strong>{dayjs().format('MMM')}</strong>.
								</CardActions>
							</CardHeader>
							<CardBody>
								<div className='row g-4 align-items-center'>
									<div className='col-xl-6'>
										<div
											className={classNames(
												'd-flex align-items-center rounded-2 p-3',
												{
													'bg-l10-warning': !darkModeStatus,
													'bg-lo25-warning': darkModeStatus,
												},
											)}>
											<div className='flex-shrink-0'>
												<Icon
													icon='MonetizationOn'
													size='3x'
													color='warning'
												/>
											</div>
											<div className='flex-grow-1 ms-3'>
												<div className='fw-bold fs-3 mb-0'>183K</div>
												<div className='text-muted mt-n2'>Sales</div>
											</div>
										</div>
									</div>
									<div className='col-xl-6'>
										<div
											className={classNames(
												'd-flex align-items-center rounded-2 p-3',
												{
													'bg-l10-info': !darkModeStatus,
													'bg-lo25-info': darkModeStatus,
												},
											)}>
											<div className='flex-shrink-0'>
												<Icon icon='Person' size='3x' color='info' />
											</div>
											<div className='flex-grow-1 ms-3'>
												<div className='fw-bold fs-3 mb-0'>1247</div>
												<div className='text-muted mt-n2'>Customers</div>
											</div>
										</div>
									</div>
									<div className='col-xl-6'>
										<div
											className={classNames(
												'd-flex align-items-center rounded-2 p-3',
												{
													'bg-l10-primary': !darkModeStatus,
													'bg-lo25-primary': darkModeStatus,
												},
											)}>
											<div className='flex-shrink-0'>
												<Icon icon='Inventory2' size='3x' color='primary' />
											</div>
											<div className='flex-grow-1 ms-3'>
												<div className='fw-bold fs-3 mb-0'>500+</div>
												<div className='text-muted mt-n2'>Products</div>
											</div>
										</div>
									</div>
									<div className='col-xl-6'>
										<div
											className={classNames(
												'd-flex align-items-center rounded-2 p-3',
												{
													'bg-l10-success': !darkModeStatus,
													'bg-lo25-success': darkModeStatus,
												},
											)}>
											<div className='flex-shrink-0'>
												<Icon icon='Money' size='3x' color='success' />
											</div>
											<div className='flex-grow-1 ms-3'>
												<div className='fw-bold fs-3 mb-0'>112,458</div>
												<div className='text-muted mt-n2'>Profits</div>
											</div>
										</div>
									</div>
								</div>
							</CardBody>
						</Card> */}
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
						{/* <Card
							className={classNames('shadow-3d-info', 'mb-5', {
								'bg-lo10-info': darkModeStatus,
								'bg-l25-info': !darkModeStatus,
							})}>
							<Carousel
								isHoverPause
								isRide
								height={height || 305}
								isDark={darkModeStatus}>
								<CarouselSlide>
									<div className='row align-items-center h-100'>
										<div
											className='col-6 carousel-slide-bg'
											style={{ backgroundImage: `url(${WannaImg1})` }}
										/>
										<div className='col-6'>
											<h2>New Products</h2>
											<p className='lead'>New products ready for sale.</p>
											<Button
												color={darkModeStatus ? 'light' : 'dark'}
												onClick={() =>
													navigate(
														`../${demoPagesMenu.sales.subMenu.productsGrid.path}`,
													)
												}>
												Click
											</Button>
										</div>
									</div>
								</CarouselSlide>
								<CarouselSlide background={WannaImg5} />
								<CarouselSlide>
									<div className='row align-items-center h-100'>
										<div className='col-6 text-end'>
											<h2>Customize</h2>
											<h5>You can design your own screens</h5>
											<Button
												color={darkModeStatus ? 'light' : 'dark'}
												onClick={() =>
													navigate(
														`../${demoPagesMenu.sales.subMenu.dashboard.path}`,
													)
												}>
												Click
											</Button>
										</div>
										<div
											className='col-6 carousel-slide-bg'
											style={{ backgroundImage: `url(${WannaImg2})` }}
										/>
									</div>
								</CarouselSlide>
								<CarouselSlide background={WannaImg6} />
							</Carousel>
						</Card> */}
						{/* <Card>
							<CardHeader>
								<CardLabel icon='PhotoSizeSelectActual' iconColor='info'>
									<CardTitle>Photos and Videos</CardTitle>
								</CardLabel>
								<CardActions>
									<Button
										color='info'
										isLight
										onClick={() => setGallerySeeAll(true)}>
										See All
									</Button>
								</CardActions>
							</CardHeader>
							<CardBody>{GALLERY}</CardBody>
						</Card> */}
						<Card hasTab>
							<CardTabItem id='profile' title='Representante' icon='Contacts'>
								<Alert isLight className='border-0' shadow='md' icon='LocalPolice'>
									La información que se muestra aquí no es compartida con
									terceros.
								</Alert>
								<Card
									className='rounded-2'
									tag='form'
									onSubmit={formik.handleSubmit}>
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
												<Input
													placeholder='Timothy'
													autoComplete='given-name'
													onChange={formik.handleChange}
													value={shop.nameLegalAgent}
												/>
											</FormGroup>

											<FormGroup
												className='col-lg-6'
												id='formEmailAddress'
												label='Identificación'>
												<Input
													type='text'
													// placeholder='john@domain.com'
													// autoComplete='email'
													// onChange={formik.handleChange}
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
													placeholder='+1 (999) 999-9999'
													autoComplete='tel'
													mask='+1 (999) 999-9999'
													onChange={formik.handleChange}
													value={
														shop.prefixLegalAgent + shop.phoneLegalAgent
													}
												/>
											</FormGroup>
										</div>
									</CardBody>
									<CardFooter>
										<CardFooterRight>
											<Button type='submit' color='primary' icon='Save'>
												Save
											</Button>
										</CardFooterRight>
									</CardFooter>
								</Card>
								<Alert
									isLight
									className='border-0'
									shadow='md'
									icon='Public'
									color='warning'>
									As soon as you save the information, it will be shown to
									everyone automatically.
								</Alert>
							</CardTabItem>
							<CardTabItem id='address' title='Dirección' icon='HolidayVillage'>
								<Card
									className='rounded-2'
									tag='form'
									onSubmit={formik.handleSubmit}>
									<CardHeader>
										<CardLabel icon='HolidayVillage'>
											<CardTitle>Dirección del local</CardTitle>
										</CardLabel>
									</CardHeader>
									<CardBody>
										<div className='row g-4'>
											<FormGroup
												className='col-12'
												id='formAddressLine'
												label='Dirección'>
												<Input
													placeholder='Dirección'
													autoComplete='address-line1'
													onChange={formik.handleChange}
													value={shop.address}
												/>
											</FormGroup>
											{/* <FormGroup
												className='col-12'
												id='formAddressLine2'
												label='Address Line 2'>
												<Input
													placeholder='Address Line 2'
													autoComplete='address-line2'
													onChange={formik.handleChange}
													value={formik.values.formAddressLine2}
												/>
											</FormGroup> */}
											<FormGroup
												className='col-md-6'
												id='formCity'
												label='City'>
												<Input
													placeholder='City'
													autoComplete='address-level2'
													onChange={formik.handleChange}
													value={formik.values.formCity}
												/>
											</FormGroup>
											<FormGroup
												className='col-md-4'
												id='formState'
												label='State'>
												<Input
													placeholder='State'
													autoComplete='country-name'
													onChange={formik.handleChange}
													value={formik.values.formState}
												/>
											</FormGroup>
											<FormGroup
												className='col-md-2'
												id='formZIP'
												label='ZIP Code'>
												<Input
													placeholder='ZIP'
													autoComplete='postal-code'
													onChange={formik.handleChange}
													value={formik.values.formZIP}
												/>
											</FormGroup>
										</div>
									</CardBody>
									<CardFooter>
										<CardFooterRight>
											<Button type='submit' color='info' icon='Save'>
												Save
											</Button>
										</CardFooterRight>
									</CardFooter>
								</Card>
							</CardTabItem>
							<CardTabItem id='profile2' title='Contraseña' icon='Lock'>
								<Card
									className='rounded-2'
									tag='form'
									onSubmit={formik.handleSubmit}>
									<CardHeader>
										<CardLabel icon='Lock'>
											<CardTitle>Cambiar Contraseña</CardTitle>
										</CardLabel>
									</CardHeader>
									<CardBody>
										<div className='row g-4'>
											<FormGroup
												className='col-lg-6'
												id='formCurrentPassword'
												label='Contraseña Actual'>
												<Input
													type='password'
													placeholder='Contraseña Actual'
													autoComplete='current-password'
													onChange={formik.handleChange}
													value={formik.values.formCurrentPassword}
												/>
											</FormGroup>
											<div className='w-100 m-0' />
											<FormGroup
												className='col-lg-6'
												id='formNewPassword'
												label='Nueva Contraseña'>
												<Input
													type='password'
													placeholder='Nueva Contraseña'
													autoComplete='new-password'
													onChange={formik.handleChange}
													value={formik.values.formNewPassword}
												/>
											</FormGroup>
											<div className='w-100 m-0' />
											<FormGroup
												className='col-lg-6'
												id='formConfirmNewPassword'
												label='Confirmar Nueva Contraseña'>
												<Input
													type='password'
													placeholder='Confirmar Nueva Contraseña'
													autoComplete='new-password'
													onChange={formik.handleChange}
													value={formik.values.formConfirmNewPassword}
												/>
											</FormGroup>
										</div>
									</CardBody>
									<CardFooter>
										<CardFooterRight>
											<Button type='submit' color='info' icon='Save'>
												Change Password
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

				<Modal
					setIsOpen={setGallerySeeAll}
					isOpen={gallerySeeAll}
					fullScreen
					titleId='gallery-full'>
					<ModalHeader setIsOpen={setGallerySeeAll}>
						<ModalTitle id='gallery-full'>Gallery</ModalTitle>
					</ModalHeader>
					<ModalBody>{GALLERY}</ModalBody>
				</Modal>
			</Page>
		</PageWrapper>
	);
};

export default SingleFluidPage;
