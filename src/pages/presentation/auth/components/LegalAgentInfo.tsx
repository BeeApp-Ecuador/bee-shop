import React from 'react';
import { FormikProps } from 'formik';
import Card, { CardBody } from '../../../../components/bootstrap/Card';
import { getCountries } from '../../../../utils/getCountries';
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
	return (
		<Card className='shadow-3d-dark p-4 mb-4'>
			<CardBody className='g-2 row'>
				<div className='col-12'>
					<h5>Datos del representante legal</h5>
				</div>
				<div className='col-12 col-sm-6'>
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
				<div className='col-6 col-sm-3'>
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
							onChange={formikRegister.handleChange}
							onBlur={formikRegister.handleBlur}
						/>
					</FormGroup>
				</div>
				<div className='col-6 col-sm-3'>
					<FormGroup id='phoneLegalAgent' isFloating label='Número de teléfono'>
						<Input
							type='tel'
							autoComplete='phoneLegalAgent'
							value={formikRegister.values.phoneLegalAgent}
							isTouched={formikRegister.touched.phoneLegalAgent}
							invalidFeedback={formikRegister.errors.phoneLegalAgent}
							isValid={formikRegister.isValid}
							onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
								const val = e.target.value.replace(/\D/g, '');
								formikRegister.setFieldValue('phoneLegalAgent', val);
							}}
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
			</CardBody>
		</Card>
	);
};
export default LegalAgentInfo;
