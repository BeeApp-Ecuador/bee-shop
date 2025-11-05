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
import Textarea from '../bootstrap/forms/Textarea';
import AuthContext from '../../contexts/authContext';
import { useGetCategoriesQuery } from '../../store/api/categoryApi';
import { ProductCategoryType } from '../../type/product-category-type';
import { ProductType } from '../../type/product-type';
import NewProductOption from './NewProductOption';
import ListProductOptions from './ListProductOptions';
import { OptionType } from '../../type/ItemOptionType';
import showNotification from '../extras/showNotification';
import Icon from '../icon/Icon';
import {
	useAddOptionsToProductMutation,
	useCreateProductMutation,
} from '../../store/api/productsApi';

const CreateProduct = ({
	setIsCreatingProduct,
	isEditing,
	productToEdit,
}: {
	setIsCreatingProduct: React.Dispatch<React.SetStateAction<boolean>>;
	isEditing: boolean;
	productToEdit?: ProductType;
}) => {
	// const { user: shop } = useContext(AuthContext);

	const { data } = useGetCategoriesQuery({ page: 1, limit: 500, status: true, name: '' });
	const [categories, setCategories] = useState<ProductCategoryType[]>([]);
	const [selectedCategory, setSelectedCategory] = useState<ProductCategoryType>();

	const [havePromo, setHavePromo] = useState(false);
	const [optionsHaveTax, setOptionsHaveTax] = useState(false);

	const [tags, setTags] = useState([]);
	const [newTag, setNewTag] = useState('');

	const [showModal, setShowModal] = useState(false);
	const [isError, setIsError] = useState(false);

	const [isLoading, setIsLoading] = useState(false);
	const [temporaryOptions, setTemporaryOptions] = useState<OptionType[]>([]);
	const [openItems, setOpenItems] = useState<{ [key: number]: boolean }>({});

	const [createProduct] = useCreateProductMutation();
	const [addOptionsToProduct] = useAddOptionsToProductMutation();

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
			setCategories(data.data as ProductCategoryType[]);
		}
	}, [data]);

	useEffect(() => {
		if (isEditing && productToEdit && categories.length > 0) {
			console.log('voy a editar un producto');
			console.log(productToEdit);
			console.log(categories);
			const selected = categories.find((cat) => cat._id === productToEdit.productCategory);
			setSelectedCategory(selected);
			formikProduct.setFieldValue('productCategory', productToEdit.productCategory);
			const productTags = productToEdit.tags || [];
			// if (productTags.length > 0) {
			// 	setTags([...productTags]);
			// }

			// setTags([anOldHope, ...productTags]);
			formikProduct.setFieldValue('tags', productTags);
			// formikProduct.setFieldValue('name', productToEdit.name);
			// const selected = categories.filter((cat) =>
			// 	shop.category!.some((c) => c === cat._id || c === cat._id),
			// );
			// setSelectedCategories(selected);
			// formikFillProfile.setFieldValue(
			// 	'category',
			// 	selected.map((c) => c._id),
			// );
			// const shopTags = shop.tags || [];
			// setTags(shopTags);
			// formikFillProfile.setFieldValue('tags', shopTags);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isEditing, categories]);

	const handleSaveProduct = async () => {
		setIsLoading(true);
		const values = formikProduct.values;
		const formData = new FormData();
		for (const key in values) {
			formData.append(key, values[key]);
		}

		const { data, error } = await createProduct(formData);
		setIsLoading(false);
		if (error) {
			if (error && 'status' in error) {
				// mostrar error
			}
		}

		if (data && data.meta.status === 201) {
			if (formikProduct.values.haveOptions) {
				setIsLoading(true);

				const productId = data.data._id;
				const { data: optionsData, error: optionsError } = await addOptionsToProduct({
					productId,
					options: temporaryOptions,
				});
				setIsLoading(false);
				if (optionsError) {
					if (optionsError && 'status' in optionsError) {
						setIsError(true);
						setShowModal(true);
						return;
					}
				}
			}
			setIsError(false);
			setShowModal(true);
		}
	};

	const formikProduct = useFormik<ProductType>({
		initialValues: {
			productCategory: isEditing
				? productToEdit!.productCategory || ''
				: selectedCategory?._id || '',
			tags: isEditing ? productToEdit!.tags : [],
			name: isEditing ? productToEdit!.name : '',
			description: isEditing ? productToEdit!.description : '',
			restricted: isEditing ? productToEdit!.restricted : false,
			tax: isEditing ? productToEdit!.tax : false,
			price: isEditing ? productToEdit!.price : 0,
			percentPromo:
				isEditing && productToEdit!.percentPromo > 0 ? productToEdit!.percentPromo : 0,
			// img: isEditing ? productToEdit!.img : null,
			img: null,
			haveOptions: isEditing ? productToEdit!.haveOptions : false,
		},
		validate: (values) => {
			const errors: Partial<Record<keyof ProductType, string>> = {};
			if (values.productCategory.length === 0) {
				errors.productCategory = 'Selecciona al menos una categoría.';
			}
			if (values.name.trim().length === 0) {
				errors.name = 'El nombre del producto es obligatorio.';
			}
			if (values.description.trim().length === 0) {
				errors.description = 'La descripción del producto es obligatoria.';
			}
			if (!values.img) {
				errors.img = 'Requerido';
			}
			if (values.img === undefined) {
				errors.img = 'Requerido';
			}
			if (values.price <= 0) {
				errors.price = 'El precio debe ser mayor a 0';
			}
			if (havePromo) {
				if (
					values.percentPromo.toString().trim().length === 0 ||
					Number(values.percentPromo) <= 0
				) {
					errors.percentPromo = 'El porcentaje de promoción es obligatorio';
				}
			}
			if (values.haveOptions) {
				if (temporaryOptions.length === 0) {
					showNotification(
						<span className='d-flex align-items-center'>
							<Icon icon='Error' size='lg' className='me-1' />
							<span>Error</span>
						</span>,
						'Agrega al menos una opción',
						'danger',
					);
				}
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

			return errors;
		},
		onSubmit: handleSaveProduct,
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
					price: 0,
				},
				{
					detail: '',
					tax: false,
					price: 0,
				},
			],
		},
		validateOnChange: false,
		validateOnBlur: false,

		validate: (values) => {
			const errors: Partial<Record<keyof OptionType, string>> = {};
			if (values.title.trim().length === 0) {
				errors.title = 'El título es obligatorio';
			}
			const titleExists = temporaryOptions.find(
				(option) => option.title.toLowerCase().trim() === values.title.toLowerCase().trim(),
			);
			if (titleExists) {
				errors.title = 'Ya existe una opción con este título';
			}
			if (values.type === 'MULTIPLE') {
				if (values.max <= 1) {
					errors.max = 'El campo es obligatorio';
				}
			}
			if (!values.isRequired) {
				const filledItems = values.items.filter((item) => item.detail?.trim().length > 0);
				if (filledItems.length < 2) {
					showNotification(
						<span className='d-flex align-items-center'>
							<Icon icon='Error' size='lg' className='me-1' />
							<span>Error</span>
						</span>,
						'Agrega al menos dos ítems',
						'danger',
					);
					errors.items = 'Agrega al menos dos ítems.';
				}
			}

			if (values.isRequired) {
				const filledItems = values.items.filter((item) =>
					item.detail?.trim().length > 0 && optionsHaveTax
						? item.price !== undefined && item.price !== null && item.price !== 0
						: item.price !== undefined && item.price !== null && item.price !== 0,
				);
				if (filledItems.length < 2) {
					showNotification(
						<span className='d-flex align-items-center'>
							<Icon icon='Error' size='lg' className='me-1' />
							<span>Error</span>
						</span>,
						'Agrega al menos dos ítems con precio',
						'danger',
					);
					errors.items = 'Agrega al menos dos ítems con precio.';
				}
				const invalidPriceItem = values.items.find((item) =>
					item.detail?.trim().length > 0 && optionsHaveTax
						? item.price === undefined || item.price === null || item.price === 0
						: item.price === undefined || item.price === null || item.price === 0,
				);
				if (invalidPriceItem) {
					showNotification(
						<span className='d-flex align-items-center'>
							<Icon icon='Error' size='lg' className='me-1' />
							<span>Error</span>
						</span>,
						'Todos los ítems deben tener un precio válido',
						'danger',
					);
					errors.items = 'Todos los ítems deben tener un precio válido.';
				}
			}

			const details = values.items.map((item) => item.detail?.toLowerCase().trim());
			const hasDuplicates = details.some(
				(item, index) => details.indexOf(item) !== index && item.length > 0,
			);
			if (hasDuplicates) {
				showNotification(
					<span className='d-flex align-items-center'>
						<Icon icon='Error' size='lg' className='me-1' />
						<span>Error</span>
					</span>,
					'No se permiten ítems repetidos',
					'danger',
				);
				errors.items = 'No se permiten ítems repetidos.';
			}

			return errors;
		},
		onSubmit: () => {
			formikOptions.values.items = formikOptions.values.items.filter(
				(item) => item.detail?.trim().length > 0,
			);
			// de formikOptions.values cambiar isrequired por su negacion
			formikOptions.values.isRequired = !formikOptions.values.isRequired;
			setTemporaryOptions([...temporaryOptions, formikOptions.values]);
			setOptionsHaveTax(false);
			showNotification(
				<span className='d-flex align-items-center'>
					<Icon icon='Success' size='lg' className='me-1' />
					<span>Éxito</span>
				</span>,
				'La opción ha sido agregada exitosamente.',
				'success',
			);
			formikOptions.resetForm();
		},
	});

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
								formikProduct.setFieldValue('productCategory', category._id);
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
									<FormGroup id='price' isFloating label='Precio final'>
										<Input
											// type='number'
											value={formikProduct.values.price}
											isTouched={formikProduct.touched.price}
											invalidFeedback={formikProduct.errors.price}
											isValid={formikProduct.isValid}
											// onChange={formikProduct.handleChange}
											onChange={(e: any) => {
												let value = e.target.value;

												// Permitir solo números y hasta 2 decimales con punto
												if (!/^\d*\.?\d{0,2}$/.test(value)) return;
												// Limitar el valor máximo a 100
												if (parseFloat(value) > 100) {
													value = '100';
												}

												formikProduct.setFieldValue('price', value);
											}}
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
											type='text'
											value={formikProduct.values.percentPromo}
											isTouched={formikProduct.touched.percentPromo}
											invalidFeedback={formikProduct.errors.percentPromo}
											isValid={formikProduct.isValid}
											onChange={(e: any) => {
												let value = e.target.value;

												// Permitir solo números y hasta 2 decimales con punto
												if (!/^\d*\.?\d{0,2}$/.test(value)) return;
												// Limitar el valor máximo a 100
												if (parseFloat(value) > 100) {
													value = '100';
												}

												formikProduct.setFieldValue('percentPromo', value);
											}}
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
						<div className='row mb-4'>
							<NewProductOption
								formikOptions={formikOptions}
								optionsHaveTax={optionsHaveTax}
								setOptionsHaveTax={setOptionsHaveTax}
							/>
							<ListProductOptions
								temporaryOptions={temporaryOptions}
								openItems={openItems}
								setOpenItems={setOpenItems}
								setTemporaryOptions={setTemporaryOptions}
							/>
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
				isStaticBackdrop
				isAnimation={true}>
				<ModalHeader>
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
							if (!isError) setIsCreatingProduct(false);
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
