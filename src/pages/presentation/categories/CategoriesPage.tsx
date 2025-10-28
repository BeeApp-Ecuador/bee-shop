import React, { useContext, useEffect, useState } from 'react';
import { useFormik } from 'formik';
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

import { demoPagesMenu } from '../../../menu';
import PaginationButtons from '../../../components/PaginationButtons';
import useDarkMode from '../../../hooks/useDarkMode';
import CategoryRow from '../../../components/categories/CategoryRow';
import {
	useChangeStatusCategoryMutation,
	useCreateCategoryMutation,
	useGetCategoriesQuery,
	useUpdateCategoryMutation,
} from '../../../store/api/categoryApi';
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
	const [total, setTotal] = useState(0);
	const [statusCategory, setStatusCategory] = useState<boolean>(true);

	const { data: categoriesData, refetch } = useGetCategoriesQuery({
		page,
		limit,
		status: statusCategory,
	});
	const [saveCategory] = useCreateCategoryMutation();
	const [changeStatusCategory] = useChangeStatusCategoryMutation();
	const [updateCategory] = useUpdateCategoryMutation();

	const [editPanel, setEditPanel] = useState<boolean>(false);
	const [editItem, setEditItem] = useState<ProductCategoryType | null>(null);

	const [categories, setCategories] = useState<ProductCategoryType[]>([]);

	const [isLoading, setIsLoading] = useState<boolean>(false);

	const { themeStatus, darkModeStatus } = useDarkMode();

	const handleSaveCategory = async (category: any) => {
		setIsLoading(true);
		const { data } = await saveCategory(category);
		setIsLoading(false);
		if (data && data.meta.status === 201) {
			setEditPanel(false);
			refetch();
		}
	};

	const handleUpdateCategory = async (categoryId: string, category: any) => {
		setIsLoading(true);
		const { data } = await updateCategory({ categoryId, category });
		setIsLoading(false);
		if (data && data.meta.status === 200) {
			setEditPanel(false);
			refetch();
		}
	};

	const handleChangeStatusCategory = async (categoryId: string) => {
		setIsLoading(true);
		const { data } = await changeStatusCategory(categoryId);
		setIsLoading(false);
		if (data && data.meta.status === 200) {
			refetch();
		}
	};

	const handleEditCategory = (category: ProductCategoryType) => {
		setEditItem(category);
		setEditPanel(true);
	};

	useEffect(() => {
		if (categoriesData) {
			if (categoriesData.meta.status === 200) {
				setCategories(categoriesData.data);
				setTotal(categoriesData.total);
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
			console.log(body);
			if (editItem) {
				handleUpdateCategory(editItem._id!, body);
			} else {
				handleSaveCategory(body);
			}
		},
		validateOnMount: true,
	});

	useEffect(() => {
		if (editItem) {
			formikCategory.setValues({
				name: editItem.name,
				description: editItem.description,
			});
		}
		return () => {
			formikCategory.resetForm();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [editItem]);

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
							<Dropdown className='d-inline'>
								<DropdownToggle hasIcon={true}>
									<Button color={themeStatus} aria-label='Actions'>
										{statusCategory ? 'Activas' : 'Inactivas'}
									</Button>
								</DropdownToggle>
								<DropdownMenu isAlignmentEnd>
									<DropdownItem>
										<Button
											icon='CheckCircle'
											onClick={() => setStatusCategory(true)}>
											Activas
										</Button>
									</DropdownItem>
									<DropdownItem>
										<Button
											icon='Block'
											onClick={() => setStatusCategory(false)}>
											Inactivas
										</Button>
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

									<th scope='col'>Estado</th>
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
											status={category.status!}
											onDisableOrEnable={() => {
												handleChangeStatusCategory(category._id!);
											}}
											onEdit={() => handleEditCategory(category)}
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
						label='categorías'
						setCurrentPage={setPage}
						currentPage={page}
						perPage={limit}
						setPerPage={setLimit}
						totalItems={total}
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
