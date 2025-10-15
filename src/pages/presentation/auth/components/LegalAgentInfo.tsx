import React, { useState } from 'react';
import { FormikProps } from 'formik';
import Card, { CardBody } from '../../../../components/bootstrap/Card';
import { getCountries, getCountryByDialCode } from '../../../../utils/getCountries';
import { RegisterFormValues } from '../Login';
import FormGroup from '../../../../components/bootstrap/forms/FormGroup';
import Input from '../../../../components/bootstrap/forms/Input';
import Select from '../../../../components/bootstrap/forms/Select';

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
	const [maxLength, setMaxLength] = useState(9);
	const [minLength, setMinLength] = useState(0);

	return (
		<Card className='shadow-3d-dark p-4 mb-4'>
			<CardBody className='g-2 row'>
				<div className='col-12'>
					<h5>Datos del representante legal</h5>
				</div>
				<div className='col-12 col-md-6'>
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

				<div className='col-12 col-md-3 col-sm-6'>
					<FormGroup id='prefixLegalAgent' label='Prefijo' isFloating>
						<Select
							ariaLabel='Prefijo'
							placeholder='Seleccione un prefijo'
							title='Prefijo'
							list={countryOptions}
							value={formikRegister.values.prefixLegalAgent}
							isTouched={formikRegister.touched.prefixLegalAgent}
							invalidFeedback={formikRegister.errors.prefixLegalAgent}
							isValid={formikRegister.isValid}
							onChange={(e) => {
								formikRegister.setFieldValue('phoneLegalAgent', '');
								formikRegister.handleChange(e);
								const country = getCountryByDialCode(e.target.value);
								setMaxLength(country?.maxLength || 9);
								setMinLength(country?.minLength || 0);
							}}
							onBlur={formikRegister.handleBlur}
						/>
					</FormGroup>
				</div>
				<div className='col-12 col-md-3 col-sm-6'>
					<FormGroup id='phoneLegalAgent' isFloating label='Número de teléfono'>
						<Input
							type='tel'
							autoComplete='phoneLegalAgent'
							value={formikRegister.values.phoneLegalAgent}
							isTouched={formikRegister.touched.phoneLegalAgent}
							invalidFeedback={formikRegister.errors.phoneLegalAgent}
							isValid={formikRegister.isValid}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
								let val = e.target.value.replace(/\D/g, '');
								if (val.length > maxLength) val = val.slice(0, maxLength);
								formikRegister.setFieldValue('phoneLegalAgent', val);
							}}
							onBlur={formikRegister.handleBlur}
							max={maxLength}
							min={minLength}
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
					<FormGroup id='identificationLegal'>
						<div className='d-flex flex-column align-items-center'>
							<label htmlFor='img-legal' className='btn btn-outline-primary'>
								Subir Identificación
							</label>
							<input
								id='img-legal'
								type='file'
								accept='image/*,application/pdf'
								style={{ display: 'none' }}
								onChange={(event) => {
									if (event.currentTarget.files) {
										formikRegister.setFieldValue(
											'identificationLegal',
											event.currentTarget.files[0],
										);
									}
								}}
								onBlur={formikRegister.handleBlur}
							/>

							{/* Vista previa */}
							{formikRegister.values.identificationLegal && (
								<div className='mt-2 text-center'>
									{formikRegister.values.identificationLegal.type ===
									'application/pdf' ? (
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
												formikRegister.values.identificationLegal!,
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
										{formikRegister.values.identificationLegal!.name}
									</div>
								</div>
							)}

							{/* Validación */}
							{formikRegister.errors.identificationLegal && (
								<div className='invalid-feedback d-block text-center'>
									{formikRegister.errors.identificationLegal}
								</div>
							)}
						</div>
					</FormGroup>
				</div>
			</CardBody>
		</Card>
	);
};
export default LegalAgentInfo;
