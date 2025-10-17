import React, { useCallback, useEffect, useState } from 'react';
import { FormikProps } from 'formik';
import {
	useGetCountriesQuery,
	useLazyGetCitiesQuery,
	useLazyGetStatesQuery,
} from '../../store/api/geoApi';
import { CountryType } from '../../type/country-type';
import { RegisterFormValues } from '../../pages/presentation/auth/Login';
import { StateType } from '../../type/state-type';
import { CityType } from '../../type/city-type';
import Card, { CardBody } from '../bootstrap/Card';
import FormGroup from '../bootstrap/forms/FormGroup';
import Select from '../bootstrap/forms/Select';
import Input from '../bootstrap/forms/Input';

const LocationInfo = ({ formikRegister }: { formikRegister: FormikProps<RegisterFormValues> }) => {
	const { data } = useGetCountriesQuery({});
	const [getStatesByCountryId] = useLazyGetStatesQuery();
	const [getCitiesByStateId] = useLazyGetCitiesQuery();

	const [countries, setCountries] = useState<CountryType[]>([]);
	const [states, setStates] = useState<StateType[]>([]);
	const [cities, setCities] = useState<CityType[]>([]);

	const countryOptions = countries.map((country) => ({
		value: country._id,
		label: `${country.flag} ${country.name}`,
		text: `${country.flag} ${country.name}`,
	}));

	useEffect(() => {
		if (data && data.meta.status === 200) {
			setCountries(data.countries);
		}
	}, [data]);

	const getStatesByCountry = useCallback(async (countryId: string) => {
		const { data } = await getStatesByCountryId(countryId);
		if (data && data.meta.status === 200) {
			setStates(data.provinces);
		}
	}, []);

	useEffect(() => {
		if (formikRegister.values.country) {
			getStatesByCountry(formikRegister.values.country);
		}
	}, [formikRegister.values.country, getStatesByCountry]);

	const getCitiesByState = useCallback(async (stateId: string) => {
		const { data } = await getCitiesByStateId(stateId);
		if (data && data.meta.status === 200) {
			setCities(data.cantons);
		}
	}, []);

	useEffect(() => {
		if (formikRegister.values.province) {
			getCitiesByState(formikRegister.values.province);
		}
	}, [formikRegister.values.province, getCitiesByState]);

	return (
		<Card className='shadow-3d-dark p-4 mb-4'>
			<CardBody className='g-2 row'>
				<div className='col-12'>
					<h5>Ubicación</h5>
				</div>
				<div className='col-12 col-sm-4'>
					<FormGroup id='country' label='País' isFloating>
						<Select
							ariaLabel='País'
							placeholder='Seleccione un País'
							title='País'
							list={countryOptions}
							value={formikRegister.values.country}
							isTouched={formikRegister.touched.country}
							invalidFeedback={formikRegister.errors.country}
							isValid={formikRegister.isValid}
							onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
								formikRegister.handleChange(e);
								formikRegister.setFieldValue('province', '');
								formikRegister.setFieldValue('city', '');
								setStates([]);
								setCities([]);
							}}
							onBlur={formikRegister.handleBlur}
						/>
					</FormGroup>
				</div>
				{formikRegister.values.country && states.length > 0 && (
					<div className='col-12 col-sm-4'>
						<FormGroup id='province' label='Provincia' isFloating>
							<Select
								ariaLabel='Provincia'
								placeholder='Seleccione un Provincia'
								title='Provincia'
								list={states.map((state) => ({
									value: state._id,
									label: state.descripcion,
									text: state.descripcion,
								}))}
								value={formikRegister.values.province}
								isTouched={formikRegister.touched.province}
								invalidFeedback={formikRegister.errors.province}
								isValid={formikRegister.isValid}
								onChange={formikRegister.handleChange}
								onBlur={formikRegister.handleBlur}
							/>
						</FormGroup>
					</div>
				)}
				{formikRegister.values.province && states.length > 0 && cities.length > 0 && (
					<div className='col-12 col-sm-4'>
						<FormGroup id='city' label='Ciudad' isFloating>
							<Select
								ariaLabel='Ciudad'
								placeholder='Seleccione un Ciudad'
								title='Ciudad'
								list={cities.map((city) => ({
									value: city._id,
									label: city.description,
									text: city.description,
								}))}
								value={formikRegister.values.city}
								isTouched={formikRegister.touched.city}
								invalidFeedback={formikRegister.errors.city}
								isValid={formikRegister.isValid}
								onChange={formikRegister.handleChange}
								onBlur={formikRegister.handleBlur}
							/>
						</FormGroup>
					</div>
				)}
				<div className='col-12'>
					<FormGroup id='address' isFloating label='Dirección'>
						<Input
							type='text'
							autoComplete='address'
							value={formikRegister.values.address}
							isTouched={formikRegister.touched.address}
							invalidFeedback={formikRegister.errors.address}
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
export default LocationInfo;
