import React, { ReactElement, useContext, useEffect, useState } from 'react';
import Card, {
	CardActions,
	CardBody,
	CardHeader,
	CardLabel,
	CardSubTitle,
	CardTitle,
} from '../bootstrap/Card';
import Wizard, { IWizardItemProps, WizardItem } from '../Wizard';
import Input from '../bootstrap/forms/Input';
import Button from '../bootstrap/Button';
import FormGroup from '../bootstrap/forms/FormGroup';
import { useFormik } from 'formik';
import Modal, { ModalBody, ModalFooter, ModalHeader, ModalTitle } from '../bootstrap/Modal';
import Icon from '../icon/Icon';
import showNotification from '../extras/showNotification';
import Textarea from '../bootstrap/forms/Textarea';
import AuthContext from '../../contexts/authContext';
import { useGetCategoriesQuery } from '../../store/api/categoryApi';
import { ProductCategoryType } from '../../type/product-category-type';
import { ProductType } from '../../type/product-type';
import Label from '../bootstrap/forms/Label';
import Checks, { ChecksGroup } from '../bootstrap/forms/Checks';
import OPTIONS from '../../common/data/enumOptionsType';
// import { WizardItem } from '../Wizard';

interface ItemType {
	detail: string;
	tax: boolean;
	priceWithVAT: number;
	priceWithoutVAT: number;
}
interface OptionType {
	title: string;
	type: string;
	max: number;
	isRequired: boolean;
	items: ItemType[];
}

const CreateProduct = ({
	setIsFillingProfile,
	isEditing,
}: {
	setIsFillingProfile: React.Dispatch<React.SetStateAction<boolean>>;
	isEditing: boolean;
}) => {
	const { user: shop } = useContext(AuthContext);

	const { data } = useGetCategoriesQuery({ page: 1, limit: 500, status: true, name: '' });
	const [categories, setCategories] = useState<ProductCategoryType[]>([]);
	const [selectedCategory, setSelectedCategory] = useState<ProductCategoryType>();

	const [havePromo, setHavePromo] = useState(false);

	const [tags, setTags] = useState([]);
	const [newTag, setNewTag] = useState('');

	const [showModal, setShowModal] = useState(false);
	const [isError, setIsError] = useState(false);

	const [isLoading, setIsLoading] = useState(false);
	// const { setUser } = useContext(AuthContext);

	const handleAddTag = () => {
		const trimmed = newTag.trim();
		if (trimmed && !tags.includes(trimmed)) {
			setTags([...tags, trimmed]);
			setNewTag('');
			formikProduct.setFieldValue('tags', [...tags, trimmed]);
		}
	};

	const handleRemoveTag = (tagToRemove: string) => {
		const updatedTags = tags.filter((tag) => tag !== tagToRemove);
		setTags(updatedTags);
		formikProduct.setFieldValue('tags', updatedTags);
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value.replace(/\s/g, '');
		setNewTag(value);
	};

	useEffect(() => {
		if (data) {
			console.log(data);
			setCategories(data.data as ProductCategoryType[]);
		}
	}, [data]);

	// useEffect(() => {
	// 	if (isEditing && shop?.category) {
	// 		const selected = categories.filter((cat) =>
	// 			shop.category!.some((c) => c === cat._id || c === cat._id),
	// 		);
	// 		setSelectedCategories(selected);
	// 		formikFillProfile.setFieldValue(
	// 			'category',
	// 			selected.map((c) => c._id),
	// 		);
	// 		const shopTags = shop.tags || [];
	// 		setTags(shopTags);
	// 		formikFillProfile.setFieldValue('tags', shopTags);
	// 	}
	// 	// eslint-disable-next-line react-hooks/exhaustive-deps
	// }, [isEditing, shop, categories, tags]);

	const formikProduct = useFormik<ProductType>({
		initialValues: {
			productCategory: isEditing ? shop.category!.toString() : selectedCategory?._id || '',
			tags: isEditing ? [] : [],
			name: '',
			description: '',
			restricted: false,
			tax: false,
			priceWithoutVAT: 0,
			priceWithVAT: 0,
			percentPromo: 0,
			img: null,
			haveOptions: false,
		},
		validate: (values) => {
			const errors: Partial<Record<keyof ProductType, string>> = {};
			if (values.productCategory.length === 0) {
				errors.productCategory = 'Selecciona al menos una categoría.';
			}

			// if (!values.tags.length) {
			// 	errors.tags = 'Agrega al menos una etiqueta.';
			// }

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
			// handleFillProfile();
		},
		validateOnChange: false,
		validateOnBlur: false,
	});

	const formikOptions = useFormik<OptionType>({
		initialValues: {
			title: '',
			type: 'SINGLE',
			max: 0,
			isRequired: false,
			items: [
				{
					detail: '',
					tax: false,
					priceWithVAT: 0,
					priceWithoutVAT: 0,
				},
				{
					detail: '',
					tax: false,
					priceWithVAT: 0,
					priceWithoutVAT: 0,
				},
			],
		},
		onSubmit: () => {
			// handleFillProfile();
		},
	});

	const handleIsRequired = () => {
		return formikOptions.values.isRequired ? 'YES' : 'NO';
	};
	const steps: ReactElement<IWizardItemProps>[] = [
		<WizardItem id='step1' title='Categoría y Tags' key='step1'>
			<Card>
				<CardBody>
					<CardHeader>
						<CardLabel icon='Category' iconColor='primary'>
							<CardTitle>Selecciona una categoría</CardTitle>
							<CardSubTitle>
								Ayuda a los clientes a encontrar tu producto
							</CardSubTitle>
						</CardLabel>
					</CardHeader>

					<div className='d-flex flex-wrap justify-content-center gap-2'>
						{categories.map((category) => {
							const isSelected = selectedCategory?._id === category._id;

							const handleToggle = () => {
								setSelectedCategory(category);
								formikProduct.setFieldValue('category', category._id);
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
					{formikProduct.touched.productCategory &&
						formikProduct.errors.productCategory && (
							<div
								style={{
									color: 'red',
									fontSize: '0.85rem',
									marginTop: '4px',
								}}>
								{formikProduct.errors.productCategory}
							</div>
						)}
				</CardBody>
			</Card>
			<Card>
				<CardBody>
					<CardHeader>
						<CardLabel icon='Label' iconColor='primary'>
							<CardTitle>Etiquetas que describen tu producto</CardTitle>
							<CardSubTitle>
								Agrega etiquetas para ayudar a los clientes a encontrar tu producto
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
								width: '100px',
								height: '35px',
								textAlign: 'center',
							}}
						/>
					</div>
					{formikProduct.touched.tags && formikProduct.errors.tags && (
						<div style={{ color: 'red', fontSize: '0.85rem', marginTop: '4px' }}>
							{formikProduct.errors.tags}
						</div>
					)}
				</CardBody>
			</Card>
			<Card>
				<CardBody>
					<CardHeader>
						<CardLabel icon='Label' iconColor='primary'>
							<CardTitle>Información general</CardTitle>
							<CardSubTitle>
								Agrega información relevante sobre tu producto
							</CardSubTitle>
						</CardLabel>
						<CardActions>
							<div className='col-12 '>
								<FormGroup id='img'>
									<div className='d-flex flex-column align-items-center'>
										<label
											htmlFor='img-upload'
											className='btn btn-outline-primary'>
											Subir Imagen
										</label>
										<input
											id='img-upload'
											type='file'
											accept='image/*'
											style={{ display: 'none' }}
											onChange={(event) => {
												if (event.currentTarget.files) {
													formikProduct.setFieldValue(
														'img',
														event.currentTarget.files[0],
													);
												}
											}}
											onBlur={formikProduct.handleBlur}
										/>

										{/* Vista previa */}
										{formikProduct.values.img && (
											<div className='mt-2 text-center'>
												<img
													src={URL.createObjectURL(
														formikProduct.values.img,
													)}
													alt='Vista previa'
													className='rounded'
													style={{
														width: '150px',
														height: '150px',
														objectFit: 'cover',
														borderRadius: '8px',
													}}
												/>
												{/* <div
															className='mt-1 text-truncate'
															style={{ maxWidth: '150px' }}>
															{formikProduct.values.img.name}
														</div> */}
											</div>
										)}

										{/* Validación */}
										{formikProduct.errors.img && (
											<div className='invalid-feedback d-block text-center'>
												{formikProduct.errors.img}
											</div>
										)}
									</div>
								</FormGroup>
							</div>
						</CardActions>
					</CardHeader>

					<div className='d-flex flex-wrap justify-content-center align-items-center gap-2 mt-3'>
						<div className='col-12'>
							<FormGroup id='name' isFloating label='Nombre del producto'>
								<Input
									autoComplete='name'
									type='text'
									value={formikProduct.values.name}
									isTouched={formikProduct.touched.name}
									invalidFeedback={formikProduct.errors.name}
									isValid={formikProduct.isValid}
									onChange={formikProduct.handleChange}
									onBlur={formikProduct.handleBlur}
								/>
							</FormGroup>
						</div>
						<div className='col-12'>
							<FormGroup id='description' isFloating label='Descripción del producto'>
								<Textarea
									value={formikProduct.values.description}
									isTouched={formikProduct.touched.description}
									invalidFeedback={formikProduct.errors.description}
									isValid={formikProduct.isValid}
									onChange={formikProduct.handleChange}
									onBlur={formikProduct.handleBlur}
									style={{ minHeight: '100px', resize: 'none' }}
								/>
							</FormGroup>
						</div>
					</div>
					{formikProduct.touched.tags && formikProduct.errors.tags && (
						<div style={{ color: 'red', fontSize: '0.85rem', marginTop: '4px' }}>
							{formikProduct.errors.tags}
						</div>
					)}
				</CardBody>
			</Card>
		</WizardItem>,
		<WizardItem id='step2' title='Precios y extras' key='step2'>
			<Card>
				<CardBody>
					<CardHeader>
						<CardLabel icon='AttachMoney' iconColor='primary'>
							<CardTitle>Precios y descuentos</CardTitle>
							<CardSubTitle>
								Define los precios y promociones para tu producto
							</CardSubTitle>
						</CardLabel>
					</CardHeader>
				</CardBody>
				<div className='px-5'>
					<div className='d-flex flex-column gap-4 px-4 py-2 ms-2 mb-4'>
						<div className='row align-items-center'>
							<div className='col-12 col-sm-6 d-flex align-items-center'>
								<div className='form-check form-switch col-12'>
									<input
										className='form-check-input'
										type='checkbox'
										id='tax'
										checked={formikProduct.values.tax}
										onChange={formikProduct.handleChange}
									/>
									<label className='form-check-label fw-bold' htmlFor='tax'>
										Tiene IVA
									</label>
									<small className='text-muted d-block'>
										Indica si los precios incluyen el Impuesto al Valor Agregado
									</small>
								</div>
								<div className='col-12 '>
									<FormGroup id='priceWithoutVAT' isFloating label='Precio'>
										<Input
											type='number'
											value={formikProduct.values.priceWithoutVAT}
											isTouched={formikProduct.touched.priceWithoutVAT}
											invalidFeedback={formikProduct.errors.priceWithoutVAT}
											isValid={formikProduct.isValid}
											onChange={formikProduct.handleChange}
											onBlur={formikProduct.handleBlur}
										/>
									</FormGroup>
								</div>
							</div>
						</div>
					</div>
					<div className='d-flex flex-column gap-4 px-4 py-2 ms-2 mb-4'>
						<div className='row align-items-center'>
							<div className='col-12 col-sm-6 d-flex align-items-center'>
								<div className='form-check form-switch col-12'>
									<input
										className='form-check-input'
										type='checkbox'
										id='havePromo'
										checked={havePromo}
										onChange={() => setHavePromo(!havePromo)}
									/>
									<label className='form-check-label fw-bold' htmlFor='havePromo'>
										Tiene Promociones
									</label>
									<small className='text-muted d-block'>
										Indica si el producto tiene alguna promoción activa
									</small>
								</div>

								<div
									className='col-12'
									style={{
										overflow: 'hidden',
										opacity: havePromo ? 1 : 0,
										transition: 'all 0.3s ease-in-out',
									}}>
									<FormGroup
										id='percentPromo'
										isFloating
										label='Porcentaje de promoción'>
										<Input
											type='number'
											value={formikProduct.values.percentPromo}
											isTouched={formikProduct.touched.percentPromo}
											invalidFeedback={formikProduct.errors.percentPromo}
											isValid={formikProduct.isValid}
											onChange={formikProduct.handleChange}
											onBlur={formikProduct.handleBlur}
										/>
									</FormGroup>
								</div>
							</div>
						</div>
					</div>
				</div>
			</Card>
			<Card>
				<CardBody>
					<CardHeader>
						<CardLabel icon='Build' iconColor='primary'>
							<CardTitle>Extras</CardTitle>
							<CardSubTitle>
								Configuraciones adicionales para tu producto
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
								id='restricted'
								checked={formikProduct.values.restricted}
								onChange={formikProduct.handleChange}
							/>
							<label className='form-check-label fw-bold' htmlFor='restricted'>
								Tiene restricciones de edad
							</label>
							<small className='text-muted d-block'>
								Indica si el producto tiene restricciones de edad
							</small>
						</div>
					</div>
					<div className='d-flex flex-column gap-4 px-4 py-2 ms-2 mb-4'>
						<div className='form-check form-switch'>
							<input
								className='form-check-input'
								type='checkbox'
								id='haveOptions'
								checked={formikProduct.values.haveOptions}
								onChange={formikProduct.handleChange}
							/>
							<label className='form-check-label fw-bold' htmlFor='haveOptions'>
								Tiene opciones
							</label>
							<small className='text-muted d-block'>
								Indica si el producto tiene opciones. Por ejemplo el producto Combo
								de 6 Alitas puede tener varios sabores como BBQ, Picante, Miel
								Mostaza, etc.
							</small>
						</div>
					</div>
				</div>
			</Card>
		</WizardItem>,
	];
	if (formikProduct.values.haveOptions) {
		steps.push(
			<WizardItem id='step3' title='Horarios' key='step3'>
				<Card>
					<CardBody>
						<CardHeader>
							<CardLabel icon='FormatListBulleted' iconColor='info'>
								<CardTitle>Opciones</CardTitle>
								<CardSubTitle>
									Agrega las diferentes opciones disponibles para tu producto
								</CardSubTitle>
							</CardLabel>
						</CardHeader>
					</CardBody>
					<div className='px-5'>
						{/* Opciones del producto */}
						<div className='row px-4 py-2 ms-2 mb-4'>
							<NewProductOption
								i={i}
								handleIsRequired={handleIsRequired}
								item={item}
								index={index}
								updated={updated}
								_={_}
							/>
							<div className='col-12 col-lg-6'>
								<Card>
									<CardHeader>
										<CardLabel icon='List' iconColor='primary'>
											<CardTitle>Listado de Opciones</CardTitle>
										</CardLabel>
									</CardHeader>
									<CardBody>
										<h1>fsdf</h1>
									</CardBody>
								</Card>
							</div>
						</div>
					</div>
				</Card>
			</WizardItem>,
		);
	}
	return (
		<div className='col-lg-12 h-100'>
			<Wizard
				isLoading={isLoading}
				isHeader
				color='info'
				noValidate
				onSubmit={formikProduct.handleSubmit}
				className='shadow-3d-info'>
				{steps}
			</Wizard>

			<Modal
				isOpen={showModal}
				setIsOpen={setShowModal}
				titleId='fillModal'
				isCentered={true}
				size='sm'
				isAnimation={true}>
				<ModalHeader setIsOpen={() => setShowModal(!showModal)}>
					<ModalTitle id='fillModal'>{isError ? 'Error' : 'Éxito'}</ModalTitle>
				</ModalHeader>
				<ModalBody>
					{isEditing ? (
						<p>Los cambios han sido guardados exitosamente.</p>
					) : (
						<p>Has completado tu perfil exitosamente, ya puedes cargar productos.</p>
					)}
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

export default CreateProduct;

function NewProductOption({ i, handleIsRequired, item, index, updated, _ }) {
	return (
		<div className='col-12 col-lg-6'>
			<Card>
				<CardHeader>
					<CardLabel icon='Add' iconColor='primary'>
						<CardTitle>Nueva Opción</CardTitle>
					</CardLabel>
				</CardHeader>
				<CardBody>
					<div className='col-12 mb-4'>
						<FormGroup id='title' isFloating label='Título'>
							<Input
								autoComplete='title'
								type='text'
								value={formikOptions.values.title}
								isTouched={formikOptions.touched.title}
								invalidFeedback={formikOptions.errors.title}
								isValid={formikOptions.isValid}
								onChange={formikOptions.handleChange}
								onBlur={formikOptions.handleBlur}
							/>
						</FormGroup>
					</div>
					<small className='text-muted d-block mb-1'>
						<b>Única</b>: se elige solo una opción (ej. sabor de bebida).
						<br />
						<b>Múltiple</b>: se pueden elegir varias opciones (ej. hasta 3 aderezos).
						<br />
						<b>Cantidad máxima</b>: Aplica solo para opción múltiple y define cuántas
						opciones puede seleccionar el cliente.
					</small>
					<div className='col-12 mb-2'>
						<FormGroup>
							<Label htmlFor='optionType'>Tipo</Label>
							<div className='d-flex align-items-center gap-2 justify-content-between'>
								<ChecksGroup isInline className='mb-0 flex-grow-1'>
									{Object.keys(OPTIONS).map((i) => (
										<Checks
											type='radio'
											key={i}
											id={i}
											label={OPTIONS[i].name}
											name='type'
											value={i}
											checked={formikOptions.values.type}
											onChange={formikOptions.handleChange}
										/>
									))}
								</ChecksGroup>

								{/* Input al lado de los checks */}
								<FormGroup
									id='max'
									isFloating
									className='flex-shrink-0'
									style={{
										// overflow: 'hidden',
										opacity: formikOptions.values.type === 'MULTIPLE' ? 1 : 0,
										transition: 'all 0.3s ease-in-out',
									}}
									label='Cantidad máxima'>
									<Input
										id='max'
										type='number'
										value={formikOptions.values.max}
										onChange={formikOptions.handleChange}
										onBlur={formikOptions.handleBlur}
										placeholder='Cantidad máxima'
									/>
								</FormGroup>
							</div>
						</FormGroup>
					</div>
					<small className='text-muted d-block mb-1'>
						<b>Si</b>: opción adicional con costo extra.
						<br />
						<b>No</b>: opción incluida en el precio del producto.
						<br />
					</small>
					<div className='col-12 mb-2'>
						<div className='row'>
							<div className='col-12 col-md-6'>
								<FormGroup label='¿Es extra?'>
									<div className='d-flex align-items-center gap-2 justify-content-between'>
										<ChecksGroup isInline className='mb-0 flex-grow-1'>
											<Checks
												type='radio'
												id='requiredYes'
												label='Sí'
												value='YES'
												checked={
													formikOptions.values.isRequired ? 'YES' : 'NO'
												}
												onChange={() => {
													formikOptions.setFieldValue('isRequired', true);
												}}
											/>
											<Checks
												type='radio'
												id='requiredNo'
												label='No'
												value='NO'
												checked={
													formikOptions.values.isRequired ? 'YES' : 'NO'
												}
												onChange={() => {
													formikOptions.setFieldValue(
														'isRequired',
														false,
													);
												}}
											/>
										</ChecksGroup>
									</div>
								</FormGroup>
							</div>
							<div className='col-12 col-md-6'>
								<FormGroup
									label='¿Grava IVA?'
									style={{
										// overflow: 'hidden',
										opacity: handleIsRequired() === 'YES' ? 1 : 0,
										transition: 'all 0.3s ease-in-out',
									}}>
									<div className='d-flex align-items-center gap-2 justify-content-between'>
										<ChecksGroup isInline className='mb-0 flex-grow-1'>
											<Checks
												type='radio'
												id='ivaYes'
												label='Sí'
												name='iva'
												value='YES'
											/>
											<Checks
												type='radio'
												id='ivaNo'
												label='No'
												name='iva'
												value='NO'
											/>
										</ChecksGroup>
									</div>
								</FormGroup>
							</div>
						</div>
					</div>
					<Label>Items de la opción</Label>
					{formikOptions.values.items.map((item, index) => (
						<div key={index} className='row align-items-center mb-2 g-2'>
							<div
								className={
									formikOptions.values.isRequired
										? 'col-5'
										: index < 2
											? 'col-12'
											: 'col-10'
								}>
								<FormGroup // className='flex-grow-1 col-5'
									isFloating
									label='Nombre del ítem'>
									<Input
										type='text'
										name={`items[${index}].detail`}
										value={item.detail}
										onChange={formikOptions.handleChange}
										placeholder='Ej. Salsa de queso'
									/>
								</FormGroup>
							</div>

							{formikOptions.values.isRequired && (
								<div className={index < 2 ? 'col-7' : 'col-5'}>
									<FormGroup // className='flex-grow-1 col-5'
										isFloating
										label='Precio adicional'>
										<Input
											type='number'
											name={`items[${index}].priceWithVAT`}
											value={item.priceWithVAT || ''}
											onChange={formikOptions.handleChange}
											placeholder='Ej. 0.50'
										/>
									</FormGroup>
								</div>
							)}
							{index >= 2 && (
								<div className='col-2 d-flex justify-content-center align-items-center'>
									<Button
										type='button'
										icon='Remove'
										isOutline
										color='danger' // className='btn btn-outline-danger btn-sm w-100'
										onClick={() => {
											const updated = formikOptions.values.items.filter(
												(_: any, i: number) => i !== index,
											);
											formikOptions.setFieldValue('items', updated);
										}}
									/>
								</div>
							)}
						</div>
					))}

					{/* Botón añadir */}
					<div className='mt-3'>
						<button
							type='button'
							className='btn btn-outline-primary btn-sm'
							onClick={() => {
								const updated = [
									...formikOptions.values.items,
									formikOptions.values.isRequired
										? {
												name: '',
												price: '',
											}
										: {
												name: '',
											},
								];
								formikOptions.setFieldValue('items', updated);
							}}>
							➕ Añadir otro ítem
						</button>
					</div>
					{/* </div> */}
				</CardBody>
			</Card>
		</div>
	);
}

function NewProductOption({ i, handleIsRequired, item, index, updated, _ }) {
	return (
		<Card>
			<CardHeader>
				<CardLabel icon='Add' iconColor='primary'>
					<CardTitle>Nueva Opción</CardTitle>
				</CardLabel>
			</CardHeader>
			<CardBody>
				<div className='col-12 mb-4'>
					<FormGroup id='title' isFloating label='Título'>
						<Input
							autoComplete='title'
							type='text'
							value={formikOptions.values.title}
							isTouched={formikOptions.touched.title}
							invalidFeedback={formikOptions.errors.title}
							isValid={formikOptions.isValid}
							onChange={formikOptions.handleChange}
							onBlur={formikOptions.handleBlur}
						/>
					</FormGroup>
				</div>
				<small className='text-muted d-block mb-1'>
					<b>Única</b>: se elige solo una opción (ej. sabor de bebida).
					<br />
					<b>Múltiple</b>: se pueden elegir varias opciones (ej. hasta 3 aderezos).
					<br />
					<b>Cantidad máxima</b>: Aplica solo para opción múltiple y define cuántas
					opciones puede seleccionar el cliente.
				</small>
				<div className='col-12 mb-2'>
					<FormGroup>
						<Label htmlFor='optionType'>Tipo</Label>
						<div className='d-flex align-items-center gap-2 justify-content-between'>
							<ChecksGroup isInline className='mb-0 flex-grow-1'>
								{Object.keys(OPTIONS).map((i) => (
									<Checks
										type='radio'
										key={i}
										id={i}
										label={OPTIONS[i].name}
										name='type'
										value={i}
										checked={formikOptions.values.type}
										onChange={formikOptions.handleChange}
									/>
								))}
							</ChecksGroup>

							{/* Input al lado de los checks */}
							<FormGroup
								id='max'
								isFloating
								className='flex-shrink-0'
								style={{
									// overflow: 'hidden',
									opacity: formikOptions.values.type === 'MULTIPLE' ? 1 : 0,
									transition: 'all 0.3s ease-in-out',
								}}
								label='Cantidad máxima'>
								<Input
									id='max'
									type='number'
									value={formikOptions.values.max}
									onChange={formikOptions.handleChange}
									onBlur={formikOptions.handleBlur}
									placeholder='Cantidad máxima'
								/>
							</FormGroup>
						</div>
					</FormGroup>
				</div>
				<small className='text-muted d-block mb-1'>
					<b>Si</b>: opción adicional con costo extra.
					<br />
					<b>No</b>: opción incluida en el precio del producto.
					<br />
				</small>
				<div className='col-12 mb-2'>
					<div className='row'>
						<div className='col-12 col-md-6'>
							<FormGroup label='¿Es extra?'>
								<div className='d-flex align-items-center gap-2 justify-content-between'>
									<ChecksGroup isInline className='mb-0 flex-grow-1'>
										<Checks
											type='radio'
											id='requiredYes'
											label='Sí'
											value='YES'
											checked={formikOptions.values.isRequired ? 'YES' : 'NO'}
											onChange={() => {
												formikOptions.setFieldValue('isRequired', true);
											}}
										/>
										<Checks
											type='radio'
											id='requiredNo'
											label='No'
											value='NO'
											checked={formikOptions.values.isRequired ? 'YES' : 'NO'}
											onChange={() => {
												formikOptions.setFieldValue('isRequired', false);
											}}
										/>
									</ChecksGroup>
								</div>
							</FormGroup>
						</div>
						<div className='col-12 col-md-6'>
							<FormGroup
								label='¿Grava IVA?'
								style={{
									// overflow: 'hidden',
									opacity: handleIsRequired() === 'YES' ? 1 : 0,
									transition: 'all 0.3s ease-in-out',
								}}>
								<div className='d-flex align-items-center gap-2 justify-content-between'>
									<ChecksGroup isInline className='mb-0 flex-grow-1'>
										<Checks
											type='radio'
											id='ivaYes'
											label='Sí'
											name='iva'
											value='YES'
										/>
										<Checks
											type='radio'
											id='ivaNo'
											label='No'
											name='iva'
											value='NO'
										/>
									</ChecksGroup>
								</div>
							</FormGroup>
						</div>
					</div>
				</div>
				<Label>Items de la opción</Label>
				{formikOptions.values.items.map((item, index) => (
					<div key={index} className='row align-items-center mb-2 g-2'>
						<div
							className={
								formikOptions.values.isRequired
									? 'col-5'
									: index < 2
										? 'col-12'
										: 'col-10'
							}>
							<FormGroup // className='flex-grow-1 col-5'
								isFloating
								label='Nombre del ítem'>
								<Input
									type='text'
									name={`items[${index}].detail`}
									value={item.detail}
									onChange={formikOptions.handleChange}
									placeholder='Ej. Salsa de queso'
								/>
							</FormGroup>
						</div>

						{formikOptions.values.isRequired && (
							<div className={index < 2 ? 'col-7' : 'col-5'}>
								<FormGroup // className='flex-grow-1 col-5'
									isFloating
									label='Precio adicional'>
									<Input
										type='number'
										name={`items[${index}].priceWithVAT`}
										value={item.priceWithVAT || ''}
										onChange={formikOptions.handleChange}
										placeholder='Ej. 0.50'
									/>
								</FormGroup>
							</div>
						)}
						{index >= 2 && (
							<div className='col-2 d-flex justify-content-center align-items-center'>
								<Button
									type='button'
									icon='Remove'
									isOutline
									color='danger' // className='btn btn-outline-danger btn-sm w-100'
									onClick={() => {
										const updated = formikOptions.values.items.filter(
											(_: any, i: number) => i !== index,
										);
										formikOptions.setFieldValue('items', updated);
									}}
								/>
							</div>
						)}
					</div>
				))}

				{/* Botón añadir */}
				<div className='mt-3'>
					<button
						type='button'
						className='btn btn-outline-primary btn-sm'
						onClick={() => {
							const updated = [
								...formikOptions.values.items,
								formikOptions.values.isRequired
									? {
											name: '',
											price: '',
										}
									: {
											name: '',
										},
							];
							formikOptions.setFieldValue('items', updated);
						}}>
						➕ Añadir otro ítem
					</button>
				</div>
				{/* </div> */}
			</CardBody>
		</Card>
	);
}
  