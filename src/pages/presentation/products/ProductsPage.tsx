import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import SubHeader, { SubHeaderLeft, SubHeaderRight } from '../../../layout/SubHeader/SubHeader';
import Icon from '../../../components/icon/Icon';
import Page from '../../../layout/Page/Page';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import Card, { CardBody } from '../../../components/bootstrap/Card';
import Badge from '../../../components/bootstrap/Badge';
import Button from '../../../components/bootstrap/Button';
import Dropdown, { DropdownMenu, DropdownToggle } from '../../../components/bootstrap/Dropdown';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import Label from '../../../components/bootstrap/forms/Label';
import Input from '../../../components/bootstrap/forms/Input';
import Checks, { ChecksGroup } from '../../../components/bootstrap/forms/Checks';
import { demoPagesMenu } from '../../../menu';
import { useGetProductsQuery } from '../../../store/api/productsApi';
import { ProductType } from '../../../type/product-type';
import Modal, { ModalBody, ModalHeader, ModalTitle } from '../../../components/bootstrap/Modal';
import CreateProduct from '../../../components/products/CreateProduct';
import PaginationButtons from '../../../components/PaginationButtons';
import { ProductCategoryType } from '../../../type/product-category-type';
import { useGetCategoriesQuery } from '../../../store/api/categoryApi';
import Spinner from '../../../components/bootstrap/Spinner';

const ProductsPage = () => {
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(10);
	const [total, setTotal] = useState(0);
	const { data: categoriesData } = useGetCategoriesQuery({
		page: 1,
		limit: 500,
		status: true,
		name: '',
	});
	const [categories, setCategories] = useState<ProductCategoryType[]>([]);

	const [statusProduct, setStatusProduct] = useState<string | null>('AVAILABLE');
	const [searchTerm, setSearchTerm] = useState('');
	const [products, setProducts] = useState<ProductType[]>([]);
	const [categoryFilter, setCategoryFilter] = useState<string>('');
	const {
		data: productsData,
		refetch,
		isLoading: isLoadingProducts,
	} = useGetProductsQuery({
		page,
		limit,
		status: statusProduct,
		search: searchTerm,
		productCategory: categoryFilter,
	});
	const [isCreatingProduct, setIsCreatingProduct] = useState(false);
	const [editingProduct, setEditingProduct] = useState<ProductType | null>(null);

	useEffect(() => {
		if (categoriesData) {
			setCategories(categoriesData.data as ProductCategoryType[]);
		}
		if (productsData) {
			if (productsData.meta.status === 200) {
				setProducts(productsData.data);
				setTotal(productsData.total);
			}
		}
	}, [productsData, categoriesData]);

	useEffect(() => {
		const delayDebounce = setTimeout(() => {
			if (searchTerm.trim().length > 0) {
				refetch();
			}
		}, 500);

		return () => clearTimeout(delayDebounce);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchTerm]);

	const [filterMenu, setFilterMenu] = useState(false);

	return (
		<PageWrapper title={demoPagesMenu.appointment.subMenu.employeeList.text}>
			<SubHeader>
				<SubHeaderLeft>
					<label
						className='border-0 bg-transparent cursor-pointer me-0'
						htmlFor='searchTerm'>
						<Icon icon='Search' size='2x' color='primary' />
					</label>
					<Input
						id='searchTerm'
						type='search'
						className='border-0 shadow-none bg-transparent'
						placeholder='Buscar...'
						onChange={(e: any) => {
							setSearchTerm(e.target.value);
						}}
						value={searchTerm}
					/>
				</SubHeaderLeft>
				<SubHeaderRight>
					<Dropdown isOpen={filterMenu} setIsOpen={setFilterMenu}>
						<DropdownToggle hasIcon={false}>
							<Button icon='FilterAlt' color='primary' isLight aria-label='Filter' />
						</DropdownToggle>
						<DropdownMenu isAlignmentEnd size='lg' isCloseAfterLeave={false}>
							<div className='container py-2'>
								<form className='row g-3'>
									<div className='col-12'>
										<FormGroup>
											<Label htmlFor='available'>Disponibilidad</Label>
											<Checks
												id='available'
												type='switch'
												label='Disponible'
												onChange={() => {
													if (statusProduct === 'AVAILABLE') {
														setStatusProduct('UNAVAILABLE');
													} else {
														setStatusProduct('AVAILABLE');
													}
												}}
												checked={statusProduct === 'AVAILABLE'}
												ariaLabel='Available status'
											/>
										</FormGroup>
									</div>

									<div className='col-12'>
										<FormGroup>
											<Label>Categorías</Label>
											<ChecksGroup>
												{categories?.map((category) => (
													// <h1>ds</h1>
													<Checks
														type='radio'
														key={category._id}
														id={category._id}
														label={category.name}
														name='categories'
														value={category._id}
														checked={categoryFilter}
														onChange={() => {
															setCategoryFilter(category._id!);
															setPage(1);
														}}
														// ariaLabel={category.name}
													/>
												))}
											</ChecksGroup>
										</FormGroup>
									</div>
									<div className='col-12'>
										<Button
											color='primary'
											isOutline
											className='w-100'
											onClick={() => {
												setStatusProduct('AVAILABLE');
												setCategoryFilter('');
											}}>
											Reset
										</Button>
									</div>
									{/* <div className='col-6'>
										<Button color='primary' className='w-100' type='submit'>
											Filter
										</Button>
									</div> */}
								</form>
							</div>
						</DropdownMenu>
					</Dropdown>
					<Button
						icon='PersonAdd'
						color='info'
						isLight
						onClick={() => {
							setEditingProduct(null);
							return setIsCreatingProduct(true);
						}}>
						Nuevo
					</Button>
				</SubHeaderRight>
			</SubHeader>
			{isLoadingProducts ? (
				<div className='d-flex justify-content-center align-items-center vh-100'>
					<Spinner isGrow />
				</div>
			) : (
				<Page container='fluid'>
					{products.length > 0 ? (
						<div className='row row-cols-xxl-3 row-cols-lg-3 row-cols-md-2'>
							{products.map((product) => (
								<div key={product._id} className='col'>
									<Card>
										<CardBody>
											<div className='row g-3'>
												<div className='col d-flex'>
													<div className='flex-shrink-0'>
														<div className='position-relative'>
															<div
																className='ratio ratio-1x1'
																style={{ width: 100 }}>
																<div
																// className={classNames(
																// 	`bg-l25-success`,
																// 	'rounded-2',
																// 	'd-flex align-items-center justify-content-center',
																// 	'overflow-hidden',
																// 	'shadow',
																// 	)
																// }
																>
																	<img
																		src={product.img!.toString()}
																		alt='blur background'
																		className='position-absolute top-0 start-0 w-100 h-100'
																		style={{
																			objectFit: 'cover',
																			filter: 'blur(10px)',
																			transform: 'scale(1)',
																			transition:
																				'filter 0.3s ease',
																		}}
																	/>

																	<img
																		src={product.img!.toString()}
																		alt={product.name}
																		width={95}
																		height={95}
																		className='rounded-2 position-relative m-auto d-block shadow'
																		style={{
																			objectFit: 'cover',
																			// zIndex: 1,
																		}}
																	/>
																</div>
															</div>
															{product.status === 'AVAILABLE' && (
																<span className='position-absolute top-100 start-85 translate-middle badge border border-2 border-light rounded-circle bg-success p-2'>
																	<span className='visually-hidden'>
																		Disponible
																	</span>
																</span>
															)}
														</div>
													</div>
													<div className='flex-grow-1 ms-3 d-flex justify-content-between'>
														<div className='w-100'>
															<div className='row'>
																<div className='col'>
																	<div className='d-flex align-items-center'>
																		<div className='fw-bold fs-5 me-2 truncate-line-1'>
																			{product.name}
																		</div>
																	</div>

																	<div className='text-muted truncate-line-2'>
																		{product.description}
																	</div>
																</div>
																<div className='col-auto'>
																	<Button
																		icon='edit'
																		color='info'
																		isLight
																		hoverShadow='sm'
																		onClick={() => {
																			setEditingProduct(
																				product,
																			);
																			return setIsCreatingProduct(
																				true,
																			);
																		}}
																	/>
																</div>
															</div>
															<div className='row g-2 mt-3'>
																<div
																	key={product._id}
																	className='col-auto ms-auto d-flex align-items-center gap-2'>
																	{product?.haveOptions && (
																		<Badge
																			isLight
																			color='info'
																			className='px-3 py-2'>
																			<Icon
																				icon='List'
																				size='lg'
																				className='me-1'
																			/>
																			Opciones
																		</Badge>
																	)}
																	<small className='border border-success border-2 text-success fw-bold px-2 py-1 rounded-1'>
																		$
																		{Number(
																			product.price,
																		).toFixed(2)}
																	</small>
																</div>
															</div>
														</div>
													</div>
												</div>
											</div>
										</CardBody>
									</Card>
								</div>
							))}
						</div>
					) : (
						<div className='text-center py-5'>No se encontraron productos</div>
					)}
					<Modal
						setIsOpen={setIsCreatingProduct}
						isOpen={isCreatingProduct}
						isCentered
						isStaticBackdrop
						size='xl'>
						<ModalHeader setIsOpen={setIsCreatingProduct}>
							<ModalTitle id='preview'>Crear Producto</ModalTitle>
						</ModalHeader>
						<ModalBody>
							<CreateProduct
								isEditing={editingProduct !== null}
								setIsCreatingProduct={setIsCreatingProduct}
								productToEdit={editingProduct!}
							/>
						</ModalBody>
					</Modal>
					<PaginationButtons
						data={products}
						label='productos'
						setCurrentPage={setPage}
						currentPage={page}
						perPage={limit}
						setPerPage={setLimit}
						totalItems={total}
					/>
				</Page>
			)}
		</PageWrapper>
	);
};

export default ProductsPage;
