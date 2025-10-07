import React from 'react';
import { FormikProps } from 'formik';
import Card, { CardBody } from '../../../../components/bootstrap/Card';
import { getCountries } from '../../../../utils/getCountries';
import { RegisterFormValues } from '../Login';
import FormGroup from '../../../../components/bootstrap/forms/FormGroup';
import Input from '../../../../components/bootstrap/forms/Input';
import Select from '../../../../components/bootstrap/forms/Select';
import Textarea from '../../../../components/bootstrap/forms/Textarea';

const BusinessInfo = ({ formikRegister }: { formikRegister: FormikProps<RegisterFormValues> }) => {
	const countryOptions = getCountries().map((country) => ({
		value: country.dialCode,
		label: `${country.flag} +${country.dialCode} ${country.name}`,
		text: `+${country.dialCode} ${country.name}`,
	}));

	return (
		<Card className='shadow-3d-dark p-4 mb-4'>
			<CardBody className='g-2 row'>
				{/* Encabezado */}
				<div className='col-12'>
					<h5>Datos del Local</h5>
				</div>

				{/* Inputs de texto */}
				<div className='col-12 col-sm-6'>
					<FormGroup id='legalName' isFloating label='Razón social'>
						<Input
							type='text'
							autoComplete='legalName'
							value={formikRegister.values.legalName}
							isTouched={formikRegister.touched.legalName}
							invalidFeedback={formikRegister.errors.legalName}
							isValid={formikRegister.isValid}
							onChange={formikRegister.handleChange}
							onBlur={formikRegister.handleBlur}
						/>
					</FormGroup>
				</div>

				<div className='col-12 col-sm-6'>
					<FormGroup id='businessName' isFloating label='Nombre comercial'>
						<Input
							type='text'
							autoComplete='businessName'
							value={formikRegister.values.businessName}
							isTouched={formikRegister.touched.businessName}
							invalidFeedback={formikRegister.errors.businessName}
							isValid={formikRegister.isValid}
							onChange={formikRegister.handleChange}
							onBlur={formikRegister.handleBlur}
						/>
					</FormGroup>
				</div>

				{/* Prefijo y Teléfono */}
				<div className='col-6 col-sm-3'>
					<FormGroup id='prefix' label='Prefijo' isFloating>
						<Select
							ariaLabel='Prefijo'
							placeholder='Seleccione un prefijo'
							title='Prefijo'
							list={countryOptions}
							value={formikRegister.values.prefix}
							isTouched={formikRegister.touched.prefix}
							invalidFeedback={formikRegister.errors.prefix}
							isValid={formikRegister.isValid}
							onChange={formikRegister.handleChange}
							onBlur={formikRegister.handleBlur}
						/>
					</FormGroup>
				</div>

				<div className='col-6 col-sm-3'>
					<FormGroup id='phone' isFloating label='Número de teléfono'>
						<Input
							type='tel'
							autoComplete='phone'
							value={formikRegister.values.phone}
							isTouched={formikRegister.touched.phone}
							invalidFeedback={formikRegister.errors.phone}
							isValid={formikRegister.isValid}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
								const val = e.target.value.replace(/\D/g, '');
								formikRegister.setFieldValue('phone', val);
							}}
							onBlur={formikRegister.handleBlur}
						/>
					</FormGroup>
				</div>

				{/* RUC */}
				<div className='col-12 col-sm-6'>
					<FormGroup id='ruc' isFloating label='RUC'>
						<Input
							type='text'
							autoComplete='ruc'
							value={formikRegister.values.ruc}
							isTouched={formikRegister.touched.ruc}
							invalidFeedback={formikRegister.errors.ruc}
							isValid={formikRegister.isValid}
							onChange={formikRegister.handleChange}
							onBlur={formikRegister.handleBlur}
						/>
					</FormGroup>
				</div>

				{/* Descripción */}
				<div className='col-12'>
					<FormGroup id='description' isFloating label='Descripción'>
						<Textarea
							style={{ minHeight: '100px', resize: 'none' }}
							autoComplete='description'
							value={formikRegister.values.description}
							isTouched={formikRegister.touched.description}
							invalidFeedback={formikRegister.errors.description}
							isValid={formikRegister.isValid}
							onChange={formikRegister.handleChange}
							onBlur={formikRegister.handleBlur}
						/>
					</FormGroup>
				</div>

				{/* Logo */}
				{/* Logo */}
				<div className='col-12 col-sm-6'>
					<FormGroup id='img'>
						<div className='d-flex flex-column align-items-center'>
							<label htmlFor='img-upload' className='btn btn-outline-primary'>
								Subir Logo
							</label>
							<input
								id='img-upload'
								type='file'
								accept='image/*'
								style={{ display: 'none' }}
								onChange={(event) => {
									if (event.currentTarget.files) {
										formikRegister.setFieldValue(
											'img',
											event.currentTarget.files[0],
										);
									}
								}}
								onBlur={formikRegister.handleBlur}
							/>

							{/* Vista previa */}
							{formikRegister.values.img && (
								<div className='mt-2 text-center'>
									<img
										src={URL.createObjectURL(formikRegister.values.img)}
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
										{formikRegister.values.img.name}
									</div>
								</div>
							)}

							{/* Validación */}
							{formikRegister.touched.img && formikRegister.errors.img && (
								<div className='invalid-feedback d-block text-center'>
									{formikRegister.errors.img}
								</div>
							)}
						</div>
					</FormGroup>
				</div>

				<div className='col-12 col-sm-6'>
					<FormGroup id='document'>
						<div className='d-flex flex-column align-items-center'>
							<label htmlFor='document-upload' className='btn btn-outline-primary'>
								Subir Documento
							</label>

							<input
								id='document-upload'
								type='file'
								accept='application/pdf,image/*'
								style={{ display: 'none' }}
								onChange={(event) => {
									if (event.currentTarget.files) {
										formikRegister.setFieldValue(
											'document',
											event.currentTarget.files[0],
										);
									}
								}}
								onBlur={formikRegister.handleBlur}
							/>

							{/* Ícono del PDF */}
							{formikRegister.values.document && (
								<div className='mt-2 text-center'>
									{formikRegister.values.document.type === 'application/pdf' ? (
										<img
											className='img-fluid'
											style={{
												// width: '150px',
												height: '150px',
												// border: '1px solid #ccc',
											}}
											src='/img-pdf.png'
											alt=''
										/>
									) : (
										<img
											src={URL.createObjectURL(
												formikRegister.values.document!,
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
									)}
									<div
										className='mt-1 text-truncate'
										style={{ maxWidth: '150px' }}>
										{formikRegister.values.document!.name}
									</div>
								</div>
							)}

							{/* Validación */}
							{formikRegister.touched.document && formikRegister.errors.document && (
								<div className='invalid-feedback d-block text-center'>
									{formikRegister.errors.document}
								</div>
							)}
						</div>
					</FormGroup>
				</div>
			</CardBody>
		</Card>
	);
};
export default BusinessInfo;
