import React, { useContext, useEffect, useRef, useState } from 'react';
import Card, {
	CardBody,
	CardFooter,
	CardHeader,
	CardLabel,
	CardSubTitle,
	CardTitle,
} from '../bootstrap/Card';
import Wizard, { WizardItem } from '../Wizard';
import Input from '../bootstrap/forms/Input';
import Button from '../bootstrap/Button';
import FormGroup from '../bootstrap/forms/FormGroup';
import { useFillProfileMutation, useGetCategoriesQuery } from '../../store/api/profileApi';
import { ShopCategoryType } from '../../type/shop-category-type';
import MapCard, { MapCardRef } from './MapCard';
import WeeklySchedule, { HourRange } from './WeeklySchedule';
import { useFormik } from 'formik';
import Modal, { ModalBody, ModalFooter, ModalHeader, ModalTitle } from '../bootstrap/Modal';
import Icon from '../icon/Icon';
import { useLazySearchAddressQuery } from '../../store/api/geoApi';
import showNotification from '../extras/showNotification';
import Textarea from '../bootstrap/forms/Textarea';
import AuthContext from '../../contexts/authContext';

export interface ShopFormValues {
	tags: string[];
	category: string[];
	havePickup: boolean;
	haveDeliveryBee: boolean;
	haveReservation: boolean;
	descriptionReservation: string;
	lat: string;
	lng: string;
}

const FillProfile = ({
	setIsFillingProfile,
	isEditing,
}: {
	setIsFillingProfile: React.Dispatch<React.SetStateAction<boolean>>;
	isEditing: boolean;
}) => {
	const { user: shop } = useContext(AuthContext);

	const { data } = useGetCategoriesQuery({});
	const [categories, setCategories] = useState<ShopCategoryType[]>([]);
	const [selectedCategories, setSelectedCategories] = useState<ShopCategoryType[]>([]);

	const [tags, setTags] = useState(['Comida', 'Bebidas']);
	const [newTag, setNewTag] = useState('');

	const mapRef = useRef<MapCardRef>(null);
	const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

	// const [maxPeoplePerReservation, setMaxPeoplePerReservation] = useState('');
	const [enableMonday, setEnableMonday] = useState(true);
	const [enableTuesday, setEnableTuesday] = useState(false);
	const [enableWednesday, setEnableWednesday] = useState(false);
	const [enableThursday, setEnableThursday] = useState(false);
	const [enableFriday, setEnableFriday] = useState(false);
	const [enableSaturday, setEnableSaturday] = useState(false);
	const [enableSunday, setEnableSunday] = useState(false);

	const refSearchInput = useRef<HTMLInputElement>(null);
	const [searchModalStatus, setSearchModalStatus] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [isError, setIsError] = useState(false);

	const [fillProfile] = useFillProfileMutation();
	const [isLoading, setIsLoading] = useState(false);
	const { setUser } = useContext(AuthContext);

	const [weeklyHours, setWeeklyHours] = useState<{ [day: string]: HourRange[] }>({
		monday: [{ startHour: '', startMin: '', endHour: '', endMin: '' }],
		tuesday: [{ startHour: '', startMin: '', endHour: '', endMin: '' }],
		wednesday: [{ startHour: '', startMin: '', endHour: '', endMin: '' }],
		thursday: [{ startHour: '', startMin: '', endHour: '', endMin: '' }],
		friday: [{ startHour: '', startMin: '', endHour: '', endMin: '' }],
		saturday: [{ startHour: '', startMin: '', endHour: '', endMin: '' }],
		sunday: [{ startHour: '', startMin: '', endHour: '', endMin: '' }],
	});

	console.log('SHOP:', JSON.stringify(shop.openShopSchedule, null, 2));
	useEffect(() => {
		if (isEditing && shop?.openShopSchedule?.length > 0) {
			const newWeeklyHours: { [day: string]: HourRange[] } = {
				monday: [{ startHour: '', startMin: '', endHour: '', endMin: '' }],
				tuesday: [{ startHour: '', startMin: '', endHour: '', endMin: '' }],
				wednesday: [{ startHour: '', startMin: '', endHour: '', endMin: '' }],
				thursday: [{ startHour: '', startMin: '', endHour: '', endMin: '' }],
				friday: [{ startHour: '', startMin: '', endHour: '', endMin: '' }],
				saturday: [{ startHour: '', startMin: '', endHour: '', endMin: '' }],
				sunday: [{ startHour: '', startMin: '', endHour: '', endMin: '' }],
			};

			let monday = false;
			let tuesday = false;
			let wednesday = false;
			let thursday = false;
			let friday = false;
			let saturday = false;
			let sunday = false;

			shop.openShopSchedule.forEach((item: any) => {
				const day = item.day.toLowerCase();

				newWeeklyHours[day] = item.schedule.map((s: any) => {
					const [startHour, startMin] = s.open.split(':');
					const [endHour, endMin] = s.close.split(':');
					return { startHour, startMin, endHour, endMin };
				});

				switch (day) {
					case 'monday':
						monday = true;
						break;
					case 'tuesday':
						tuesday = true;
						break;
					case 'wednesday':
						wednesday = true;
						break;
					case 'thursday':
						thursday = true;
						break;
					case 'friday':
						friday = true;
						break;
					case 'saturday':
						saturday = true;
						break;
					case 'sunday':
						sunday = true;
						break;
				}
			});

			setWeeklyHours(newWeeklyHours);
			setEnableMonday(monday);
			setEnableTuesday(tuesday);
			setEnableWednesday(wednesday);
			setEnableThursday(thursday);
			setEnableFriday(friday);
			setEnableSaturday(saturday);
			setEnableSunday(sunday);
		}
	}, [isEditing, shop]);

	const [searchAddress] = useLazySearchAddressQuery();
	const [addressSearchResults, setAddressSearchResults] = useState<any[]>([]);

	const handleCoordsChange = (coords: { lat: number; lng: number }) => {
		console.log('Nuevas coordenadas:', coords);
		setCoords(coords);
		formikFillProfile.setFieldValue('lat', coords.lat.toString());
		formikFillProfile.setFieldValue('lng', coords.lng.toString());
	};

	const handleFillProfile = async () => {
		if (
			enableMonday ||
			enableTuesday ||
			enableWednesday ||
			enableThursday ||
			enableFriday ||
			enableSaturday ||
			enableSunday
		) {
			let schedules = {};
			if (enableMonday) schedules = { ...schedules, monday: weeklyHours.monday };
			if (enableTuesday) schedules = { ...schedules, tuesday: weeklyHours.tuesday };
			if (enableWednesday) schedules = { ...schedules, wednesday: weeklyHours.wednesday };
			if (enableThursday) schedules = { ...schedules, thursday: weeklyHours.thursday };
			if (enableFriday) schedules = { ...schedules, friday: weeklyHours.friday };
			if (enableSaturday) schedules = { ...schedules, saturday: weeklyHours.saturday };
			if (enableSunday) schedules = { ...schedules, sunday: weeklyHours.sunday };

			const schedulesArray = Object.entries(schedules as Record<string, HourRange[]>).map(
				([day, hours]) => ({
					day: day.toUpperCase(),
					schedule: hours.map((h) => ({
						open: `${h.startHour}:${h.startMin}`,
						close: `${h.endHour}:${h.endMin}`,
					})),
				}),
			);

			const allHoursComplete = schedulesArray.every((daySchedule) =>
				daySchedule.schedule.every((h) => h.open.length >= 4 && h.close.length >= 4),
			);

			if (!allHoursComplete) {
				showNotification(
					<span className='d-flex align-items-center'>
						<Icon icon='Error' size='lg' className='me-1' />
						<span>Error</span>
					</span>,
					'Por favor, completa todos los horarios antes de continuar.',
					'danger',
				);
				return;
			}

			const body = {
				...formikFillProfile.values,
				openShopSchedule: schedulesArray,
			};
			setIsLoading(true);
			const { data, error } = await fillProfile(body);
			setIsLoading(false);
			if (error) {
				setIsError(true);
				setShowModal(true);
			}
			if (data) {
				console.log(data);
				setUser(data.shop!);
				setIsError(false);
				setShowModal(true);
			}
		} else {
			showNotification(
				<span className='d-flex align-items-center'>
					<Icon icon='Error' size='lg' className='me-1' />
					<span>Error</span>
				</span>,
				'Debes habilitar al menos un día de la semana en el horario de atención',
				'danger',
			);
		}
	};
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
					// setError('No se pudo obtener la ubicación. Activa los permisos de ubicación.');
					console.error(err);
				},
			);
		} else {
			// setError('Tu navegador no soporta geolocalización.');
		}
	}, []);

	const handleAddTag = () => {
		const trimmed = newTag.trim();
		if (trimmed && !tags.includes(trimmed)) {
			setTags([...tags, trimmed]);
			setNewTag('');
			formikFillProfile.setFieldValue('tags', [...tags, trimmed]);
		}
	};

	const handleRemoveTag = (tagToRemove: string) => {
		const updatedTags = tags.filter((tag) => tag !== tagToRemove);
		setTags(updatedTags);
		formikFillProfile.setFieldValue('tags', updatedTags);
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value.replace(/\s/g, '');
		setNewTag(value);
	};

	useEffect(() => {
		if (data) {
			setCategories(data.list);
		}
	}, [data]);

	useEffect(() => {
		if (isEditing && shop?.category) {
			const selected = categories.filter((cat) =>
				shop.category!.some((c) => c === cat._id || c === cat._id),
			);
			setSelectedCategories(selected);
			formikFillProfile.setFieldValue(
				'category',
				selected.map((c) => c._id),
			);
			const shopTags = shop.tags || [];
			setTags(shopTags);
			formikFillProfile.setFieldValue('tags', shopTags);
		}
	}, [isEditing, shop, categories, tags]);

	const formikFillProfile = useFormik<ShopFormValues>({
		initialValues: {
			tags: isEditing ? shop.tags : ['Comida', 'Bebidas'],
			category: isEditing
				? shop.category!.map((c) => c)
				: selectedCategories.map((c) => c._id),
			havePickup: isEditing ? shop.havePickup : false,
			haveDeliveryBee: isEditing ? shop.haveDeliveryBee : false,
			haveReservation: isEditing ? shop.haveReservation : false,
			descriptionReservation: isEditing ? shop.descriptionReservation : '',
			lat: isEditing ? shop.lat.toString() : coords?.lat.toString() || '',
			lng: isEditing ? shop.lng.toString() : coords?.lng.toString() || '',
		},
		validate: (values) => {
			const errors: Partial<Record<keyof ShopFormValues, string>> = {};
			if (values.category.length === 0) {
				errors.category = 'Selecciona al menos una categoría.';
			}
			if (!values.lat) {
				errors.lat = 'La latitud es requerida.';
			}
			if (!values.lng) {
				errors.lng = 'La longitud es requerida.';
			}
			if (!values.tags.length) {
				errors.tags = 'Agrega al menos una etiqueta.';
			}
			// validar que uno de estos debe ser true (havePickup, haveDeliveryBee, haveReservation)
			if (!values.havePickup && !values.haveDeliveryBee && !values.haveReservation) {
				errors.havePickup = 'Debes seleccionar al menos un servicio ofrecido.';
				errors.haveDeliveryBee = 'Debes seleccionar al menos un servicio ofrecido.';
				errors.haveReservation = 'Debes seleccionar al menos un servicio ofrecido.';
			}
			if (values.haveReservation && !values.descriptionReservation) {
				errors.descriptionReservation =
					'La descripción del servicio de reservas es requerida cuando el servicio está habilitado.';
			}
			if (Object.keys(errors).length > 0) {
				showNotification(
					<span className='d-flex align-items-center'>
						<Icon icon='Error' size='lg' className='me-1' />
						<span>Error</span>
					</span>,
					'Los datos del formulario contienen errores. Revisa e intenta nuevamente.',
					'danger',
				);
			}
			console.log(errors);
			return errors;
		},
		onSubmit: () => {
			handleFillProfile();
		},
		validateOnChange: false,
		validateOnBlur: false,
	});

	const formik = useFormik({
		initialValues: {
			searchInput: '',
		},
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		onSubmit: (values) => {
			setSearchModalStatus(true);
		},
	});

	useEffect(() => {
		const delayDebounce = setTimeout(() => {
			const fetchAddresses = async () => {
				if (formik.values.searchInput) {
					setSearchModalStatus(true);
					refSearchInput?.current?.focus();

					try {
						const { data, error } = await searchAddress({
							query: formik.values.searchInput,
							lat: coords?.lat,
							lon: coords?.lng,
						});

						if (data) {
							console.log(data.data.features);
							setAddressSearchResults(data.data.features);
						}
					} catch (err) {
						console.error('Error buscando direcciones:', err);
					}
				} else {
					setSearchModalStatus(false);
				}
			};

			fetchAddresses();
		}, 400);

		// 🔹 Limpieza del timeout si el usuario sigue escribiendo
		return () => {
			clearTimeout(delayDebounce);
		};
	}, [formik.values.searchInput]);

	return (
		<div className='col-lg-12 h-100'>
			<Wizard
				isLoading={isLoading}
				isHeader
				color='info'
				noValidate
				onSubmit={formikFillProfile.handleSubmit}
				className='shadow-3d-info'>
				<WizardItem id='step1' title='Categoría y Tags'>
					<Card>
						<CardBody>
							<CardHeader>
								<CardLabel icon='Category' iconColor='primary'>
									<CardTitle>¡Cuéntanos un poco sobre tu comercio!</CardTitle>
									<CardSubTitle>
										Elige una o más categorías que mejor lo representen.
									</CardSubTitle>
								</CardLabel>
							</CardHeader>

							<div className='d-flex flex-wrap justify-content-center gap-2'>
								{categories.map((category) => {
									const isSelected = selectedCategories.some(
										(c) => c._id === category._id,
									);

									const handleToggle = () => {
										const updatedCategories = isSelected
											? selectedCategories.filter(
													(c) => c._id !== category._id,
												)
											: [...selectedCategories, category];

										setSelectedCategories(updatedCategories);
										formikFillProfile.setFieldValue(
											'category',
											updatedCategories.map((c) => c._id),
										);
									};

									return (
										<Button
											key={category._id}
											isOutline={!isSelected}
											color='info'
											onClick={handleToggle}>
											{category.name}
										</Button>
									);
								})}
							</div>
							{formikFillProfile.touched.category &&
								formikFillProfile.errors.category && (
									<div
										style={{
											color: 'red',
											fontSize: '0.85rem',
											marginTop: '4px',
										}}>
										{formikFillProfile.errors.category}
									</div>
								)}
						</CardBody>
					</Card>
					<Card>
						<CardBody>
							<CardHeader>
								<CardLabel icon='Label' iconColor='primary'>
									<CardTitle>
										Etiquetas que describen tu comercio y productos
									</CardTitle>
									<CardSubTitle>
										Agrega etiquetas para ayudar a los clientes a encontrar tu
										comercio y productos.
									</CardSubTitle>
								</CardLabel>
							</CardHeader>

							<div className='d-flex flex-wrap justify-content-center align-items-center gap-2 mt-3'>
								{tags.map((tag) => (
									<Button
										key={tag}
										color='info'
										className='d-flex align-items-center gap-1'>
										<span>{tag}</span>
										<span
											onClick={() => handleRemoveTag(tag)}
											style={{
												color: 'red',
												cursor: 'pointer',
												fontWeight: 'bold',
												marginLeft: '8px',
											}}>
											✕
										</span>
									</Button>
								))}

								<Input
									type='text'
									value={newTag}
									onChange={handleInputChange}
									onKeyDown={(e) => {
										if (e.key === 'Enter') {
											e.preventDefault();
											handleAddTag();
										}
									}}
									placeholder='+'
									style={{
										// border: 'none',
										// boxShadow: 'none',
										width: '100px',
										height: '35px',
										textAlign: 'center',
										// padding: '0 6px',
									}}
								/>
							</div>
							{formikFillProfile.touched.tags && formikFillProfile.errors.tags && (
								<div
									style={{ color: 'red', fontSize: '0.85rem', marginTop: '4px' }}>
									{formikFillProfile.errors.tags}
								</div>
							)}
						</CardBody>
					</Card>
				</WizardItem>
				<WizardItem id='step2' title='Servicios y ubicación'>
					<Card>
						<CardBody>
							<CardHeader>
								<CardLabel icon='House' iconColor='primary'>
									<CardTitle>¿Dónde está ubicado tu comercio?</CardTitle>
									<CardSubTitle>
										Proporciona la dirección física de tu comercio para que los
										clientes puedan encontrarte fácilmente.
									</CardSubTitle>
								</CardLabel>
							</CardHeader>
						</CardBody>
						<div className='p-3'>
							<Input
								id='searchInput'
								type='search'
								placeholder='Buscar dirección...'
								onChange={formik.handleChange}
								value={formik.values.searchInput}
								autoComplete='off'
								// list={['fsdf', 'fsdfsd', 'asd']}
							/>
						</div>
						<div className='p-3'>
							<MapCard
								lat={coords?.lat ?? '-2.90055'}
								lng={coords?.lng ?? '-79.00454'}
								heightE='300px'
								onCoordsChange={handleCoordsChange}
								ref={mapRef}
							/>
						</div>
					</Card>
					<Card>
						<CardBody>
							<CardHeader>
								<CardLabel icon='Build' iconColor='primary'>
									<CardTitle>Servicios ofrecidos</CardTitle>
									<CardSubTitle>
										Selecciona los servicios que tu comercio ofrece a los
										clientes.
									</CardSubTitle>
								</CardLabel>
							</CardHeader>
						</CardBody>
						<div className='px-5'>
							<div className='d-flex flex-column gap-4 px-4 py-2 ms-2 mb-4'>
								<div className='form-check form-switch'>
									<input
										className='form-check-input'
										type='checkbox'
										id='havePickup'
										checked={formikFillProfile.values.havePickup}
										onChange={formikFillProfile.handleChange}
									/>
									<label
										className='form-check-label fw-bold'
										htmlFor='havePickup'>
										Recogida en el local
									</label>
									<small className='text-muted d-block'>
										Permite que los clientes recojan sus pedidos directamente en
										tu comercio.
									</small>
								</div>

								<div className='form-check form-switch'>
									<input
										className='form-check-input'
										type='checkbox'
										id='haveDeliveryBee'
										checked={formikFillProfile.values.haveDeliveryBee}
										onChange={formikFillProfile.handleChange}
									/>
									<label
										className='form-check-label fw-bold'
										htmlFor='haveDeliveryBee'>
										Entrega a domicilio (DeliveryBee)
									</label>
									<small className='text-muted d-block'>
										Activa la entrega mediante repartidores asociados a la
										plataforma.
									</small>
								</div>

								<div className='form-check form-switch'>
									<input
										className='form-check-input'
										type='checkbox'
										id='haveReservation'
										checked={formikFillProfile.values.haveReservation}
										onChange={formikFillProfile.handleChange}
									/>
									<label
										className='form-check-label fw-bold'
										htmlFor='haveReservation'>
										Reservas de mesa
									</label>
									<small className='text-muted d-block'>
										Permite que los clientes reserven una mesa con antelación.
									</small>
								</div>

								<div
									style={{
										overflow: 'hidden',
										opacity: formikFillProfile.values.haveReservation ? 1 : 0,
										height: formikFillProfile.values.haveReservation
											? 'auto'
											: 0,
										transform: formikFillProfile.values.haveReservation
											? 'translateY(0)'
											: 'translateY(-10px)',
										transition: 'all 0.4s ease',
									}}>
									{formikFillProfile.values.haveReservation && (
										<div className='m-2'>
											<FormGroup
												id='descriptionReservation'
												label='Descripción del servicio de reservas e información adicional de aforo, políticas y condiciones'>
												<Textarea
													style={{ minHeight: '100px', resize: 'none' }}
													id='descriptionReservation'
													name='descriptionReservation'
													value={
														formikFillProfile.values
															.descriptionReservation
													}
													onBlur={formikFillProfile.handleBlur}
													onChange={formikFillProfile.handleChange}
													invalidFeedback={
														formikFillProfile.errors
															.descriptionReservation
													}
													isTouched={
														formikFillProfile.touched
															.descriptionReservation
													}
													isValid={formikFillProfile.isValid}
													placeholder='Ejemplo: "Reserva tu mesa con anticipación para garantizar tu lugar"'
												/>
											</FormGroup>
										</div>
									)}
								</div>
							</div>
						</div>
						<CardFooter>
							<div className='text-danger'>
								{(formikFillProfile.touched.havePickup &&
									formikFillProfile.errors.havePickup) ||
									(formikFillProfile.touched.haveDeliveryBee &&
										formikFillProfile.errors.haveDeliveryBee) ||
									(formikFillProfile.touched.haveReservation &&
										formikFillProfile.errors.haveReservation && (
											<div>
												Debes seleccionar al menos un servicio ofrecido
											</div>
										))}
							</div>
						</CardFooter>
					</Card>
				</WizardItem>
				<WizardItem id='step3' title='Horarios'>
					<Card>
						<CardBody>
							<CardHeader>
								<CardLabel icon='Schedule' iconColor='info'>
									<CardTitle>Horarios de atención</CardTitle>
									<CardSubTitle>
										Define los horarios en los que tu comercio está operativo.
									</CardSubTitle>
								</CardLabel>
							</CardHeader>
						</CardBody>
						<WeeklySchedule
							enableMonday={enableMonday}
							setEnableMonday={setEnableMonday}
							enableTuesday={enableTuesday}
							setEnableTuesday={setEnableTuesday}
							enableWednesday={enableWednesday}
							setEnableWednesday={setEnableWednesday}
							enableThursday={enableThursday}
							setEnableThursday={setEnableThursday}
							enableFriday={enableFriday}
							setEnableFriday={setEnableFriday}
							enableSaturday={enableSaturday}
							setEnableSaturday={setEnableSaturday}
							enableSunday={enableSunday}
							setEnableSunday={setEnableSunday}
							weeklyHours={weeklyHours}
							setWeeklyHours={setWeeklyHours}
						/>
					</Card>
				</WizardItem>
			</Wizard>
			<Modal
				setIsOpen={setSearchModalStatus}
				isOpen={searchModalStatus}
				isStaticBackdrop
				isScrollable
				data-tour='search-modal'>
				<ModalHeader setIsOpen={setSearchModalStatus}>
					<label className='border-0 bg-transparent cursor-pointer' htmlFor='searchInput'>
						<Icon icon='Search' size='2x' color='primary' />
					</label>
					<Input
						ref={refSearchInput}
						name='searchInput'
						className='border-0 shadow-none bg-transparent'
						placeholder='Search...'
						onChange={formik.handleChange}
						value={formik.values.searchInput}
					/>
				</ModalHeader>
				<ModalBody>
					<table className='table table-hover table-modern caption-top mb-0'>
						<tbody>
							{addressSearchResults.length ? (
								addressSearchResults.map((item) => (
									<tr
										key={item.id}
										className='cursor-pointer'
										onClick={() => {
											setCoords({
												lat: item.geometry.coordinates[1],
												lng: item.geometry.coordinates[0],
											});
											mapRef.current?.setMarker(
												item.geometry.coordinates[0],
												item.geometry.coordinates[1],
											);
											mapRef.current?.centerMap(
												item.geometry.coordinates[0],
												item.geometry.coordinates[1],
											);

											setSearchModalStatus(false);
										}}>
										<td>
											<div className='d-flex align-items-start'>
												<Icon
													icon='LocationOn'
													size='lg'
													className='me-2 mt-1'
													color='primary'
												/>
												<div>
													<div className='fw-bold'>
														{item.properties.name}
													</div>
													<div className='text-muted small'>
														{item.properties?.locality ||
															(item.properties?.street &&
																(item.properties?.locality ??
																	item.properties?.street))}
														{item.properties?.type === 'district' &&
															item.properties.city}
														{item.properties?.type !== 'city' ||
															item.properties?.type !== 'country' ||
															(item.properties?.type !== 'other' &&
																(item.properties?.district
																	? `${
																			item.properties.district
																		}, `
																	: '') +
																	(item.properties?.city ?? ''))}
													</div>
												</div>
											</div>
										</td>
									</tr>
								))
							) : (
								<tr className='table-active'>
									<td>No result found for query "{formik.values.searchInput}"</td>
								</tr>
							)}
						</tbody>
					</table>
				</ModalBody>
			</Modal>
			<Modal
				isOpen={showModal}
				setIsOpen={setShowModal}
				titleId='fillModal'
				// isStaticBackdrop={staticBackdropStatus}
				// isScrollable={scrollableStatus}
				isCentered={true}
				size='sm'
				// fullScreen={fullScreenStatus}
				isAnimation={true}>
				<ModalHeader setIsOpen={() => setShowModal(!showModal)}>
					<ModalTitle id='fillModal'>{isError ? 'Error' : 'Éxito'}</ModalTitle>
				</ModalHeader>
				<ModalBody>
					<p>Has completado tu perfil exitosamente, ya puedes cargar productos.</p>
				</ModalBody>
				<ModalFooter>
					<Button
						color={isError ? 'danger' : 'success'}
						isOutline
						className='border-0'
						onClick={() => {
							if (!isError) setIsFillingProfile(false);
							setIsError(false);
							return setShowModal(false);
						}}>
						Ok
					</Button>
				</ModalFooter>
			</Modal>
		</div>
	);
};

export default FillProfile;
