import React, { useEffect, useRef, useState } from 'react';
import Card, { CardBody, CardHeader, CardLabel, CardSubTitle, CardTitle } from '../bootstrap/Card';
import Wizard, { WizardItem } from '../Wizard';
import Input from '../bootstrap/forms/Input';
import Button from '../bootstrap/Button';
import FormGroup from '../bootstrap/forms/FormGroup';
import Select from '../bootstrap/forms/Select';
import { useGetCategoriesQuery } from '../../store/api/profileApi';
import { ShopCategoryType } from '../../type/shop-category-type';
import MapCard, { MapCardRef } from './MapCard';
import Accordion, { DayAccordionItem } from '../Accordion';
import WeeklySchedule from './WeeklySchedule';
import { useFormik } from 'formik';

export interface Schedule {
	open: string; // formato "HH:mm"
	close: string; // formato "HH:mm"
}

export interface OpenShopDay {
	day: string; // ejemplo: "MONDAY", "TUESDAY", etc.
	schedule: Schedule[];
}

export interface ShopFormValues {
	tags: string[];
	category: string[];
	havePickup: boolean;
	haveDeliveryBee: boolean;
	haveReservation: boolean;
	maxPeoplePerReservation: number;
	lat: string;
	lng: string;
	openShopSchedule: OpenShopDay[];
}

const FillProfile = () => {
	const { data } = useGetCategoriesQuery({});
	const [categories, setCategories] = useState<ShopCategoryType[]>([]);
	const [selectedCategories, setSelectedCategories] = useState<ShopCategoryType[]>([]);

	const [tags, setTags] = useState(['Comida', 'Bebidas']);
	const [newTag, setNewTag] = useState('');

	const mapRef = useRef<MapCardRef>(null);
	const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

	const [havePickup, setHavePickup] = useState(false);
	const [haveDeliveryBee, setHaveDeliveryBee] = useState(false);
	const [haveReservation, setHaveReservation] = useState(false);
	const [maxPeoplePerReservation, setMaxPeoplePerReservation] = useState('');
	const [enableMonday, setEnableMonday] = useState(true);
	const [enableTuesday, setEnableTuesday] = useState(false);
	const [enableWednesday, setEnableWednesday] = useState(false);
	const [enableThursday, setEnableThursday] = useState(false);
	const [enableFriday, setEnableFriday] = useState(false);
	const [enableSaturday, setEnableSaturday] = useState(false);
	const [enableSunday, setEnableSunday] = useState(false);
	const [address, setAddress] = useState('');

	const handleCoordsChange = (coords: { lat: number; lng: number }) => {
		console.log('Nuevas coordenadas:', coords);
		setCoords(coords);
		formikFillProfile.setFieldValue('lat', coords.lat.toString());
		formikFillProfile.setFieldValue('lng', coords.lng.toString());
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
		const value = e.target.value.replace(/\s/g, ''); // elimina todos los espacios
		setNewTag(value);
	};

	useEffect(() => {
		if (data) {
			setCategories(data.list);
		}
	}, [data]);

	const formikFillProfile = useFormik<ShopFormValues>({
		initialValues: {
			tags: [],
			category: selectedCategories.map((c) => c._id),
			havePickup: false,
			haveDeliveryBee: false,
			haveReservation: false,
			maxPeoplePerReservation: Number(maxPeoplePerReservation),
			lat: coords?.lat.toString() || '',
			lng: coords?.lng.toString() || '',
			openShopSchedule: [
				// {
				// 	day: 'MONDAY',
				// 	schedule: [
				// 		{
				// 			open: '09:00',
				// 			close: '18:00',
				// 		},
				// 	],
				// },
			],
		},
		onSubmit: (values) => {
			console.log('Formulario enviado:', values);
		},
	});

	return (
		<div className='col-lg-12 h-100'>
			<Wizard
				isHeader
				color='primary'
				noValidate
				// onSubmit={formik.handleSubmit}

				className='shadow-3d-info'>
				<WizardItem id='step1' title='Categoría y Tags'>
					<Card>
						<CardBody>
							<CardHeader>
								<CardLabel icon='Category' iconColor='info'>
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
						</CardBody>
					</Card>
					<Card>
						<CardBody>
							<CardHeader>
								<CardLabel icon='Label' iconColor='info'>
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
						</CardBody>
					</Card>
				</WizardItem>
				<WizardItem id='step2' title='Servicios y ubicación'>
					<Card>
						<CardBody>
							<CardHeader>
								<CardLabel icon='House' iconColor='info'>
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
								type='text'
								placeholder='Buscar dirección...'
								value={address}
								onChange={(e) => setAddress(e.target.value)}
								list={['fsdf', 'fsdfsd', 'asd']}
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
								<CardLabel icon='Build' iconColor='info'>
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
											{/* <label
												htmlFor='maxPeople'
												className='form-label fw-bold'>
												Número máximo de personas por reserva
											</label> */}
											<FormGroup
												id='maxPeoplePerReservation'
												label='Define cuántas personas puede incluir cada reserva.'>
												<Input
													type='number'
													id='maxPeoplePerReservation'
													value={
														formikFillProfile.values
															.maxPeoplePerReservation
													}
													onChange={formikFillProfile.handleChange}
													placeholder='Ejemplo: 5'
												/>
											</FormGroup>
										</div>
									)}
								</div>
							</div>
						</div>
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
						/>
					</Card>
				</WizardItem>
			</Wizard>
		</div>
	);
};

export default FillProfile;
