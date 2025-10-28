import React, { useContext, useEffect, useState } from 'react';
import Card, {
	CardActions,
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
import { useFormik } from 'formik';
import Modal, { ModalBody, ModalFooter, ModalHeader, ModalTitle } from '../bootstrap/Modal';
import Icon from '../icon/Icon';
import showNotification from '../extras/showNotification';
import Textarea from '../bootstrap/forms/Textarea';
import AuthContext from '../../contexts/authContext';
import { useGetCategoriesQuery } from '../../store/api/categoryApi';
import { ProductCategoryType } from '../../type/product-category-type';
import { ProductType } from '../../type/product-type';

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

	return (
		<div className='col-lg-12 h-100'>
			<Wizard
				isLoading={isLoading}
				isHeader
				color='info'
				noValidate
				onSubmit={formikProduct.handleSubmit}
				className='shadow-3d-info'>
				<WizardItem id='step1' title='Categoría y Tags'>
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
										Agrega etiquetas para ayudar a los clientes a encontrar tu
										producto
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
								<div
									style={{ color: 'red', fontSize: '0.85rem', marginTop: '4px' }}>
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
														<div
															className='mt-1 text-truncate'
															style={{ maxWidth: '150px' }}>
															{formikProduct.values.img.name}
														</div>
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
									<FormGroup
										id='description'
										isFloating
										label='Descripción del producto'>
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
								<div
									style={{ color: 'red', fontSize: '0.85rem', marginTop: '4px' }}>
									{formikProduct.errors.tags}
								</div>
							)}
						</CardBody>
					</Card>
				</WizardItem>
				<WizardItem id='step2' title='Precios y extras'>
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
											<label
												className='form-check-label fw-bold'
												htmlFor='tax'>
												Tiene IVA
											</label>
											<small className='text-muted d-block'>
												Indica si los precios incluyen el Impuesto al Valor
												Agregado
											</small>
										</div>
										<div className='col-12 '>
											<FormGroup
												id='priceWithoutVAT'
												isFloating
												label='Precio'>
												<Input
													type='number'
													value={formikProduct.values.priceWithoutVAT}
													isTouched={
														formikProduct.touched.priceWithoutVAT
													}
													invalidFeedback={
														formikProduct.errors.priceWithoutVAT
													}
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
												id='promo'
												checked={havePromo}
												onChange={() => setHavePromo(!havePromo)}
											/>
											<label
												className='form-check-label fw-bold'
												htmlFor='promo'>
												Tiene Promociones
											</label>
											<small className='text-muted d-block'>
												Indica si el producto tiene alguna promoción activa
											</small>
										</div>
										<div className='col-12 '>
											<FormGroup
												id='percentPromo'
												isFloating
												label='Porcentaje de promoción'>
												<Input
													type='number'
													value={formikProduct.values.percentPromo}
													isTouched={formikProduct.touched.percentPromo}
													invalidFeedback={
														formikProduct.errors.percentPromo
													}
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
									<label
										className='form-check-label fw-bold'
										htmlFor='restricted'>
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
									<label
										className='form-check-label fw-bold'
										htmlFor='haveOptions'>
										Tiene opciones
									</label>
									<small className='text-muted d-block'>
										Indica si el producto tiene opciones. Por ejemplo el
										producto Combo de 6 Alitas puede tener varios sabores como
										BBQ, Picante, Miel Mostaza, etc.
									</small>
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
					</Card>
				</WizardItem>
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
