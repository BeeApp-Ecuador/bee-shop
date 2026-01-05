import React, { useEffect, useState } from 'react';
import { useGetOrdersQuery } from '../../../store/api/ordersApi';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import SubHeader, { SubHeaderLeft, SubHeaderRight } from '../../../layout/SubHeader/SubHeader';
import Icon from '../../../components/icon/Icon';
import Input from '../../../components/bootstrap/forms/Input';
import Card, { CardBody, CardLabel, CardTitle } from '../../../components/bootstrap/Card';
import Button from '../../../components/bootstrap/Button';
import useDarkMode from '../../../hooks/useDarkMode';
import Page from '../../../layout/Page/Page';
const OrdersPage = () => {
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(10);
	const [total, setTotal] = useState(0);
	const { themeStatus, darkModeStatus } = useDarkMode();

	const { data: ordersData, isLoading: isLoadingOrders } = useGetOrdersQuery({
		page,
		limit,
		// status: 'PENDING',
		// search: '',
	});
	const [orders, setOrders] = useState([]);
	useEffect(() => {
		console.log(ordersData);
		if (ordersData && ordersData.data) {
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
							<small className='ms-2'>Item: {total}</small>
						</CardTitle>
					</CardLabel>
				</SubHeaderLeft>
				<SubHeaderRight>
					<Button
						color={darkModeStatus ? 'light' : 'dark'}
						isLight={false}
						icon='Assignment'
						onClick={() => {
							// setEditItem(null);
							// setEditPanel(true);
						}}>
						Nuevos Pedidos
					</Button>
					<Button
						color={darkModeStatus ? 'light' : 'dark'}
						isLight={true}
						icon='History'
						onClick={() => {
							// setEditItem(null);
							// setEditPanel(true);
						}}>
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
					<div>
						{orders.map((order: any) => (
							<Card key={order.id} className='mb-3'>
								<CardBody>
									<h5>Orden ID: {order.id}</h5>
									<p>Cliente: {order.customerName}</p>
									<p>Total: ${order.totalAmount}</p>
									<p>Estado: {order.status}</p>
								</CardBody>
							</Card>
						))}
					</div>
				)}
			</Page>
		</PageWrapper>
	);
};

export default OrdersPage;
