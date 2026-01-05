import React, { useEffect, useRef, useState } from 'react';
import { useGetOrdersQuery } from '../../../store/api/ordersApi';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import SubHeader, { SubHeaderLeft, SubHeaderRight } from '../../../layout/SubHeader/SubHeader';
import Card, {
	CardBody,
	CardFooter,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../../components/bootstrap/Card';
import Button from '../../../components/bootstrap/Button';
import Page from '../../../layout/Page/Page';
import useDarkMode from '../../../hooks/useDarkMode';
import { OrderType } from '../../../type/order-type';

const OrdersPage = () => {
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(10);
	const [total, setTotal] = useState(0);
	const [orders, setOrders] = useState<OrderType[]>([]);
	const { darkModeStatus } = useDarkMode();

	// refs por orden
	const scrollRefs = useRef<Record<string, HTMLDivElement | null>>({});

	const scrollProducts = (orderId: string, direction: 'left' | 'right') => {
		const el = scrollRefs.current[orderId];
		if (!el) return;

		const amount = 240;
		el.scrollBy({
			left: direction === 'left' ? -amount : amount,
			behavior: 'smooth',
		});
	};

	const { data: ordersData, isLoading: isLoadingOrders } = useGetOrdersQuery({
		page,
		limit,
	});

	useEffect(() => {
		if (ordersData?.data) {
			setOrders(ordersData.data);
			setTotal(ordersData.total);
		}
	}, [ordersData]);

	return (
		<PageWrapper title='Órdenes'>
			<SubHeader>
				<SubHeaderLeft>
					<CardLabel icon='ReceiptLong' iconColor='primary'>
						<CardTitle tag='div' className='h5'>
							Órdenes
							<small className='ms-2'>Items: {total}</small>
						</CardTitle>
					</CardLabel>
				</SubHeaderLeft>

				<SubHeaderRight>
					<Button color={darkModeStatus ? 'light' : 'dark'} icon='Assignment'>
						Nuevos Pedidos
					</Button>
					<Button color={darkModeStatus ? 'light' : 'dark'} isLight icon='History'>
						Historial
					</Button>
				</SubHeaderRight>
			</SubHeader>

			<Page>
				{isLoadingOrders ? (
					<div>Cargando órdenes...</div>
				) : orders.length === 0 ? (
					<div>No hay órdenes disponibles.</div>
				) : (
					orders.map((order) => (
						<Card key={order._id} className='mb-3'>
							<CardHeader className='d-flex justify-content-between align-items-center'>
								<h5 className='mb-0'>Orden #{order.orderNumber}</h5>
								<strong className='text-primary'>${order.total.toFixed(2)}</strong>
							</CardHeader>

							<CardBody>
								{/* ocultar scrollbar */}
								<style>{`
									.hide-scrollbar::-webkit-scrollbar {
										display: none;
									}
								`}</style>

								{/* botones */}
								<div className='d-flex justify-content-end gap-2 mb-2'>
									<Button
										color='light'
										isLight
										icon='ChevronLeft'
										onClick={() => scrollProducts(order._id, 'left')}
									/>
									<Button
										color='light'
										isLight
										icon='ChevronRight'
										onClick={() => scrollProducts(order._id, 'right')}
									/>
								</div>

								{/* productos */}
								<div
									ref={(el) => (scrollRefs.current[order._id] = el)}
									className='d-flex gap-3 hide-scrollbar'
									style={{
										overflowX: 'auto',
										overflowY: 'hidden',
										scrollbarWidth: 'none',
										msOverflowStyle: 'none',
										WebkitOverflowScrolling: 'touch',
									}}>
									{order.products.map((product) => (
										<Card
											key={product._id}
											shadow='none'
											style={{ minWidth: 150 }}>
											<div className='text-center'>
												<img
													src={product.product?.img}
													alt={product.name}
													className='img-fluid mb-2 rounded-circle'
													style={{
														width: 80,
														height: 80,
														objectFit: 'cover',
													}}
												/>

												<div className='fw-semibold'>{product.name}</div>
												<div className='text-muted small'>
													X {product.quantity}
												</div>
											</div>

											{product.selectedOptions.length > 0 && (
												<ul className='mt-2 small ps-3 mb-0'>
													{product.selectedOptions.map(
														(option, index) => (
															<li key={index}>{option}</li>
														),
													)}
												</ul>
											)}
										</Card>
									))}
								</div>
							</CardBody>

							<CardFooter className='d-flex justify-content-end'>
								<strong>Total: ${order.total.toFixed(2)}</strong>
							</CardFooter>
						</Card>
					))
				)}
			</Page>
		</PageWrapper>
	);
};

export default OrdersPage;
