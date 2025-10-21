import React, { useEffect, useState } from 'react';
import Card, { CardBody, CardHeader, CardLabel, CardTitle } from '../bootstrap/Card';
import Wizard, { WizardItem } from '../Wizard';
import Input from '../bootstrap/forms/Input';
import Button from '../bootstrap/Button';
import FormGroup from '../bootstrap/forms/FormGroup';
import Select from '../bootstrap/forms/Select';
import { useGetCategoriesQuery } from '../../store/api/profileApi';
import { ShopCategoryType } from '../../type/shop-category-type';

const FillProfile = () => {
	const { data } = useGetCategoriesQuery({});
	const [categories, setCategories] = useState<ShopCategoryType[]>([]);
	const [selectedCategories, setSelectedCategories] = useState<ShopCategoryType[]>([]);

	useEffect(() => {
		if (data) {
			console.log(data.list);
			setCategories(data.list);
		}
	}, [data]);

	return (
		<div className='col-lg-12 h-100'>
			<Wizard
				isHeader
				color='info'
				noValidate
				// onSubmit={formik.handleSubmit}
				className='shadow-3d-info'>
				<WizardItem id='step1' title='Categoría y Tags'>
					<Card>
						<CardBody>
							<div className='d-flex flex-wrap justify-content-center gap-2'>
								{categories.map((category) => {
									const isSelected = selectedCategories.some(
										(c) => c._id === category._id,
									);

									const handleToggle = () => {
										setSelectedCategories((prev) =>
											isSelected
												? prev.filter((c) => c._id !== category._id)
												: [...prev, category],
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
						<CardHeader>
							<CardLabel icon='Edit' iconColor='warning'>
								<CardTitle>Personal Information</CardTitle>
							</CardLabel>
						</CardHeader>
						<CardBody className='pt-0'>
							<div className='row g-4'>
								<div className='col-md-6'>
									<FormGroup id='firstName' label='First Name' isFloating>
										<Input
											placeholder='First Name'
											autoComplete='additional-name'
											// onChange={formik.handleChange}
											// onBlur={formik.handleBlur}
											// value={formik.values.firstName}
											// isValid={formik.isValid}
											// isTouched={formik.touched.firstName}
											// invalidFeedback={formik.errors.firstName}
											validFeedback='Looks good!'
										/>
									</FormGroup>
								</div>
								<div className='col-md-6'>
									<FormGroup id='lastName' label='Last Name' isFloating>
										<Input
											placeholder='Last Name'
											autoComplete='family-name'
											validFeedback='Looks good!'
										/>
									</FormGroup>
								</div>
								<div className='col-12'>
									<FormGroup
										id='displayName'
										label='Display Name'
										isFloating
										formText='This will be how your name will be displayed in the account section and in reviews'>
										<Input
											placeholder='Display Name'
											autoComplete='username'
											validFeedback='Looks good!'
										/>
									</FormGroup>
								</div>
							</div>
						</CardBody>
					</Card>

					<Card className='mb-0'>
						<CardHeader>
							<CardLabel icon='MarkunreadMailbox' iconColor='success'>
								<CardTitle>Contact Information</CardTitle>
							</CardLabel>
						</CardHeader>
						<CardBody className='pt-0'>
							<div className='row g-4'>
								<div className='col-12'>
									<FormGroup id='phoneNumber' label='Phone Number' isFloating>
										<Input
											placeholder='Phone Number'
											type='tel'
											autoComplete='tel'
											validFeedback='Looks good!'
										/>
									</FormGroup>
								</div>
								<div className='col-12'>
									<FormGroup id='emailAddress' label='Email address' isFloating>
										<Input
											type='email'
											placeholder='Email address'
											autoComplete='email'
											validFeedback='Looks good!'
										/>
									</FormGroup>
								</div>
							</div>
						</CardBody>
					</Card>
				</WizardItem>
				<WizardItem id='step2' title='Address'>
					<div className='row g-4'>
						<div className='col-lg-12'>
							<FormGroup id='addressLine' label='Address Line' isFloating>
								<Input validFeedback='Looks good!' />
							</FormGroup>
						</div>
						<div className='col-lg-12'>
							<FormGroup id='addressLine2' label='Address Line 2' isFloating>
								<Input validFeedback='Looks good!' readOnly />
							</FormGroup>
						</div>

						<div className='col-lg-6'>
							<FormGroup id='city' label='City' isFloating>
								<Input
									readOnly
									// onChange={formik.handleChange}
									// onBlur={formik.handleBlur}
									// value={formik.values.city}
									// isValid={formik.isValid}
									// isTouched={formik.touched.city}
									// invalidFeedback={formik.errors.city}
									validFeedback='Looks good!'
								/>
							</FormGroup>
						</div>
						<div className='col-md-3'>
							<FormGroup id='state' label='State' isFloating>
								<Select
									ariaLabel='State'
									placeholder='Choose...'
									list={[
										{ value: 'usa', text: 'USA' },
										{ value: 'ca', text: 'Canada' },
									]}
									// onChange={formik.handleChange}
									// onBlur={formik.handleBlur}
									// value={formik.values.state}
									// isValid={formik.isValid}
									// isTouched={formik.touched.state}
									// invalidFeedback={formik.errors.state}
								/>
							</FormGroup>
						</div>
						<div className='col-md-3'>
							<FormGroup id='zip' label='Zip' isFloating>
								<Input
									readOnly
									// onChange={formik.handleChange}
									// onBlur={formik.handleBlur}
									// value={formik.values.zip}
									// isValid={formik.isValid}
									// isTouched={formik.touched.zip}
									// invalidFeedback={formik.errors.zip}
								/>
							</FormGroup>
						</div>
					</div>
				</WizardItem>
				<WizardItem id='step3' title='Test'>
					<div className='row g-4'>
						<div className='col-lg-12'>
							<FormGroup id='addressLine' label='Address Line' isFloating>
								<Input validFeedback='Looks good!' />
							</FormGroup>
						</div>
						<div className='col-lg-12'>
							<FormGroup id='addressLine2' label='Address Line 2' isFloating>
								<Input validFeedback='Looks good!' />
							</FormGroup>
						</div>

						<div className='col-lg-6'>
							<FormGroup id='city' label='City' isFloating>
								<Input
									// onChange={formik.handleChange}
									// onBlur={formik.handleBlur}
									// value={formik.values.city}
									// isValid={formik.isValid}
									// isTouched={formik.touched.city}
									// invalidFeedback={formik.errors.city}
									validFeedback='Looks good!'
								/>
							</FormGroup>
						</div>
						<div className='col-md-3'>
							<FormGroup id='state' label='State' isFloating>
								<Select
									ariaLabel='State'
									placeholder='Choose...'
									list={[
										{ value: 'usa', text: 'USA' },
										{ value: 'ca', text: 'Canada' },
									]}
									// onChange={formik.handleChange}
									// onBlur={formik.handleBlur}
									// value={formik.values.state}
									// isValid={formik.isValid}
									// isTouched={formik.touched.state}
									// invalidFeedback={formik.errors.state}
								/>
							</FormGroup>
						</div>
						<div className='col-md-3'>
							<FormGroup id='zip' label='Zip' isFloating>
								<Input
								// onChange={formik.handleChange}
								// onBlur={formik.handleBlur}
								// value={formik.values.zip}
								// isValid={formik.isValid}
								// isTouched={formik.touched.zip}
								// invalidFeedback={formik.errors.zip}
								/>
							</FormGroup>
						</div>
					</div>
				</WizardItem>
			</Wizard>
		</div>
	);
};

export default FillProfile;
