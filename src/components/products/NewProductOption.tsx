import React from 'react';
import Card, { CardBody, CardHeader, CardLabel, CardTitle } from '../bootstrap/Card';
import FormGroup from '../bootstrap/forms/FormGroup';
import Input from '../bootstrap/forms/Input';
import Label from '../bootstrap/forms/Label';
import Checks, { ChecksGroup } from '../bootstrap/forms/Checks';
import OPTIONS from '../../common/data/enumOptionsType';
import { FormikProps } from 'formik';
import { OptionType } from './CreateProduct';
import Button from '../bootstrap/Button';

const NewProductOption = ({ formikOptions }: { formikOptions: FormikProps<OptionType> }) => {
	const handleIsRequired = () => {
		return formikOptions.values.isRequired ? 'YES' : 'NO';
	};
	return (
		<div className='col-12 col-lg-7'>
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

								<FormGroup
									id='max'
									isFloating
									className='flex-shrink-0'
									style={{
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
										? 'col-7'
										: index < 2
											? 'col-12'
											: 'col-10'
								}>
								<FormGroup isFloating label='Nombre del ítem'>
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
								<div className={index < 2 ? 'col-5' : 'col-3'}>
									<FormGroup isFloating label='Precio'>
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
										color='danger'
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

					<div className='mt-3'>
						<button
							type='button'
							className='btn btn-outline-primary btn-sm'
							onClick={() => {
								const updated = [
									...formikOptions.values.items,
									formikOptions.values.isRequired
										? { name: '', price: '' }
										: { name: '' },
								];
								formikOptions.setFieldValue('items', updated);
							}}>
							➕ Añadir otro ítem
						</button>
					</div>
				</CardBody>
			</Card>
		</div>
	);
};

export default NewProductOption;
