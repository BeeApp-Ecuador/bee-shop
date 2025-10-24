import React, { useEffect, useState } from 'react';
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

import data from '../../../common/data/dummyProductData';
import { demoPagesMenu } from '../../../menu';
import PaginationButtons, {
	dataPagination,
	PER_COUNT,
} from '../../../components/PaginationButtons';
import useSortableData from '../../../hooks/useSortableData';
import useSelectTable from '../../../hooks/useSelectTable';
import useDarkMode from '../../../hooks/useDarkMode';
import useTourStep from '../../../hooks/useTourStep';
import { enUS } from 'date-fns/locale';
import CategoryRow from '../../../components/categories/CategoryRow';
import { useGetCategoriesQuery } from '../../../store/api/categoryApi';
import { ProductCategoryType } from '../../../type/product-category-type';
import OffCanvas, {
	OffCanvasBody,
	OffCanvasHeader,
	OffCanvasTitle,
} from '../../../components/bootstrap/OffCanvas';
import { Badge } from '../../../components/icon/material-icons';

const CategoriesPage = () => {
	/**
	 * For Tour
	 */
	useTourStep(6);
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [limit, setLimit] = useState(10);
	const { data: categoriesData } = useGetCategoriesQuery({ page, limit });

	const [editPanel, setEditPanel] = useState<boolean>(false);
	const [editItem, setEditItem] = useState<ProductCategoryType | null>(null);

	const [categories, setCategories] = useState<ProductCategoryType[]>([]);

	useEffect(() => {
		if (categoriesData) {
			console.log(categoriesData);
			if (categoriesData.meta.status === 200) {
				setCategories(categoriesData.data);
				setTotalPages(categoriesData.totalPages);
			}
		}
	}, [categoriesData]);

	const { themeStatus, darkModeStatus } = useDarkMode();

	const [date, setDate] = useState<Date>(new Date());

	const [filterMenu, setFilterMenu] = useState<boolean>(false);
	const formik = useFormik<ProductCategoryType>({
		initialValues: {
			name: '',
			description: '',
		},
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		onSubmit: (values) => {
			setFilterMenu(false);
			// alert(JSON.stringify(values, null, 2));
		},
	});

	const filteredData = data.filter(
		(f) =>
			// Category
			f.category === formik.values.categoryName &&
			// Price
			(formik.values.minPrice === '' || f.price > Number(formik.values.minPrice)) &&
			(formik.values.maxPrice === '' || f.price < Number(formik.values.maxPrice)) &&
			//	Company
			((formik.values.companyA ? f.store === 'Company A' : false) ||
				(formik.values.companyB ? f.store === 'Company B' : false) ||
				(formik.values.companyC ? f.store === 'Company C' : false) ||
				(formik.values.companyD ? f.store === 'Company D' : false)),
	);

	const [currentPage, setCurrentPage] = useState<number>(1);
	const [perPage, setPerPage] = useState<number>(PER_COUNT['10']);

	const { items, requestSort, getClassNamesFor } = useSortableData(filteredData);
	const onCurrentPageItems = dataPagination(items, currentPage, perPage);
	const { selectTable, SelectAllCheck } = useSelectTable(onCurrentPageItems);

	return (
		<PageWrapper title={demoPagesMenu.listPages.subMenu.listBoxed.text}>
			<SubHeader>
				<SubHeaderLeft>
					<CardLabel icon='Category' iconColor='primary'>
						<CardTitle tag='div' className='h5'>
							Categorías
							<small className='ms-2'>
								Item:{' '}
								{selectTable.values.selectedList.length
									? `${selectTable.values.selectedList.length} / `
									: null}
								{filteredData.length}
							</small>
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
											key={category._id}
											id={category._id}
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
				onSubmit={formik.handleSubmit}>
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
											onChange={formik.handleChange}
											onBlur={formik.handleBlur}
											value={formik.values.name}
											isValid={formik.isValid}
											isTouched={formik.touched.name}
											invalidFeedback={formik.errors.name}
											validFeedback='Looks good!'
										/>
									</FormGroup>
								</div>
								<div className='col-12'>
									<FormGroup id='description' label='Description' isFloating>
										<Input
											placeholder='Description'
											onChange={formik.handleChange}
											onBlur={formik.handleBlur}
											value={formik.values.description}
											isValid={formik.isValid}
											isTouched={formik.touched.description}
											invalidFeedback={formik.errors.description}
											validFeedback='Looks good!'
										/>
									</FormGroup>
								</div>
							</div>
						</CardBody>
					</Card>
				</OffCanvasBody>
				<div className='p-3'>
					<Button
						color='info'
						icon='Save'
						type='submit'
						isDisable={!formik.isValid && !!formik.submitCount}>
						Save
					</Button>
				</div>
			</OffCanvas>
		</PageWrapper>
	);
};

export default CategoriesPage;
