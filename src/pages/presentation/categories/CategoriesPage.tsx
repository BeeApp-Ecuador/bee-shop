import React, { useContext, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { useFormik } from 'formik';
import { Calendar as DatePicker } from 'react-date-range';
import SubHeader, { SubHeaderLeft, SubHeaderRight } from '../../../layout/SubHeader/SubHeader';
import Button from '../../../components/bootstrap/Button';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import Page from '../../../layout/Page/Page';
import Card, {
	CardActions,
	CardBody,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../../components/bootstrap/Card';
import Dropdown, {
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
} from '../../../components/bootstrap/Dropdown';
import Input from '../../../components/bootstrap/forms/Input';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import Popovers from '../../../components/bootstrap/Popovers';

import { demoPagesMenu } from '../../../menu';
import PaginationButtons, { PER_COUNT } from '../../../components/PaginationButtons';
import useDarkMode from '../../../hooks/useDarkMode';
import { enUS } from 'date-fns/locale';
import CategoryRow from '../../../components/categories/CategoryRow';
import { useCreateCategoryMutation, useGetCategoriesQuery } from '../../../store/api/categoryApi';
import { ProductCategoryType } from '../../../type/product-category-type';
import OffCanvas, {
	OffCanvasBody,
	OffCanvasHeader,
	OffCanvasTitle,
} from '../../../components/bootstrap/OffCanvas';
import { Badge } from '../../../components/icon/material-icons';
import AuthContext from '../../../contexts/authContext';
import Spinner from '../../../components/bootstrap/Spinner';

const CategoriesPage = () => {
	const { user: shop } = useContext(AuthContext);

	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(10);
	const [totalPages, setTotalPages] = useState(1);

	const { data: categoriesData, refetch } = useGetCategoriesQuery({ page, limit });
	const [saveCategory] = useCreateCategoryMutation();

	const [editPanel, setEditPanel] = useState<boolean>(false);
	const [editItem, setEditItem] = useState<ProductCategoryType | null>(null);

	const [categories, setCategories] = useState<ProductCategoryType[]>([]);

	const [isLoading, setIsLoading] = useState<boolean>(false);

	const { themeStatus, darkModeStatus } = useDarkMode();

	const [date, setDate] = useState<Date>(new Date());

	const [filterMenu, setFilterMenu] = useState<boolean>(false);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [perPage, setPerPage] = useState<number>(PER_COUNT['10']);

	const handleSaveCategory = async (category: any) => {
		setIsLoading(true);
		const { data } = await saveCategory(category);
		setIsLoading(false);
		if (data && data.meta.status === 201) {
			setEditPanel(false);
			refetch();
		}
	};

	useEffect(() => {
		if (categoriesData) {
			if (categoriesData.meta.status === 200) {
				setCategories(categoriesData.data);
				setTotalPages(categoriesData.totalPages);
			}
		}
	}, [categoriesData]);

	const formikCategory = useFormik<ProductCategoryType>({
		initialValues: {
			name: '',
			description: '',
		},
		validate: (values) => {
			const errors: Partial<ProductCategoryType> = {};
			if (!values.name) errors.name = 'Required';
			return errors;
		},
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		onSubmit: (values) => {
			const body = { ...values, shop: shop._id };
			handleSaveCategory(body);
		},
		validateOnMount: true,
	});

	return (
		<PageWrapper title={demoPagesMenu.listPages.subMenu.listBoxed.text}>
			<SubHeader>
				<SubHeaderLeft>
					<CardLabel icon='Category' iconColor='primary'>
						<CardTitle tag='div' className='h5'>
							Categorías
							<small className='ms-2'>Item: {categories.length}</small>
						</CardTitle>
					</CardLabel>
				</SubHeaderLeft>
				<SubHeaderRight>
					<Button
						color={darkModeStatus ? 'light' : 'dark'}
						isLight
						icon='Add'
						onClick={() => {
							setEditItem(null);
							setEditPanel(true);
						}}>
						Crear
					</Button>
				</SubHeaderRight>
			</SubHeader>
			<Page>
				<Card stretch data-tour='list'>
					<CardHeader>
						<CardLabel>
							<></>
						</CardLabel>
						<CardActions>
							<Dropdown isButtonGroup>
								<Popovers
									desc={
										<DatePicker
											locale={enUS}
											onChange={(item) => setDate(item)}
											date={date}
											color={import.meta.env.VITE_PRIMARY_COLOR}
										/>
									}
									placement='bottom-end'
									className='mw-100'
									trigger='click'>
									<Button color='success' isLight icon='WaterfallChart'>
										{dayjs(date).format('MMM D')}
									</Button>
								</Popovers>
								<DropdownToggle>
									<Button color='success' isLight aria-label='More' />
								</DropdownToggle>
								<DropdownMenu isAlignmentEnd>
									<DropdownItem>
										<span>Last Hour</span>
									</DropdownItem>
									<DropdownItem>
										<span>Last Day</span>
									</DropdownItem>
									<DropdownItem>
										<span>Last Week</span>
									</DropdownItem>
									<DropdownItem>
										<span>Last Month</span>
									</DropdownItem>
								</DropdownMenu>
							</Dropdown>
							<Button
								color='info'
								icon='CloudDownload'
								isLight
								tag='a'
								to='/somefile.txt'
								target='_blank'
								download>
								Export
							</Button>
							<Dropdown className='d-inline'>
								<DropdownToggle hasIcon={false}>
									<Button
										color={themeStatus}
										icon='MoreHoriz'
										aria-label='Actions'
									/>
								</DropdownToggle>
								<DropdownMenu isAlignmentEnd>
									<DropdownItem>
										<Button icon='Edit'>Edit</Button>
									</DropdownItem>
									<DropdownItem>
										<Button icon='Delete'>Delete</Button>
									</DropdownItem>
								</DropdownMenu>
							</Dropdown>
						</CardActions>
					</CardHeader>
					<CardBody className='table-responsive' isScrollable>
						<table className='table table-modern table-hover'>
							<thead>
								<tr>
									{/* <th scope='col'>{SelectAllCheck}</th> */}

									<th scope='col'>Nombre</th>
									<th scope='col'>Descripción</th>

									<th scope='col' className='text-end'>
										Acciones
									</th>
								</tr>
							</thead>
							<tbody>
								{categories.length > 0 ? (
									categories.map((category) => (
										<CategoryRow
											key={category._id!}
											id={category._id!}
											name={category.name}
											description={category.description}
										/>
									))
								) : (
									<tr>
										<td colSpan={3}>No hay categorías disponibles</td>
									</tr>
								)}
							</tbody>
						</table>
					</CardBody>
					<PaginationButtons
						data={categories}
						label='items'
						setCurrentPage={setCurrentPage}
						currentPage={page}
						perPage={limit}
						setPerPage={setPerPage}
					/>
				</Card>
			</Page>
			<OffCanvas
				setOpen={setEditPanel}
				isOpen={editPanel}
				isRightPanel
				tag='form'
				noValidate
				onSubmit={formikCategory.handleSubmit}>
				<OffCanvasHeader setOpen={setEditPanel}>
					<OffCanvasTitle id='edit-panel'>
						{editItem?.name || 'Nueva Categoría'}{' '}
						{editItem?.name ? (
							<Badge color='primary'>Editar</Badge>
						) : (
							<Badge color='success'>Nueva</Badge>
						)}
					</OffCanvasTitle>
				</OffCanvasHeader>
				<OffCanvasBody>
					<Card>
						<CardHeader>
							<CardLabel icon='Description' iconColor='success'>
								<CardTitle>Categoría</CardTitle>
							</CardLabel>
						</CardHeader>
						<CardBody>
							<div className='row g-4'>
								<div className='col-12'>
									<FormGroup id='name' label='Name' isFloating>
										<Input
											placeholder='Name'
											onChange={formikCategory.handleChange}
											onBlur={formikCategory.handleBlur}
											value={formikCategory.values.name}
											isValid={formikCategory.isValid}
											isTouched={formikCategory.touched.name}
											invalidFeedback={formikCategory.errors.name}
										/>
									</FormGroup>
								</div>
								<div className='col-12'>
									<FormGroup id='description' label='Description' isFloating>
										<Input
											placeholder='Description'
											onChange={formikCategory.handleChange}
											onBlur={formikCategory.handleBlur}
											value={formikCategory.values.description}
											isValid={formikCategory.isValid}
											isTouched={formikCategory.touched.description}
											invalidFeedback={formikCategory.errors.description}
										/>
									</FormGroup>
								</div>
							</div>
						</CardBody>
					</Card>
				</OffCanvasBody>
				<div className='p-3'>
					<Button
						className='w-100'
						size='lg'
						color='primary'
						icon='Save'
						type='submit'
						isDisable={!formikCategory.isValid}>
						{isLoading && <Spinner isSmall inButton isGrow />}
						Guardar
					</Button>
				</div>
			</OffCanvas>
		</PageWrapper>
	);
};

export default CategoriesPage;
