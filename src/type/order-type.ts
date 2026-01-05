import { ProductOrderType } from './product-order-type';

export interface OrderType {
	_id: string;
	buyStatus: 'DELIVERY' | 'PICKUP';
	customer: string;
	feebee: number;
	invoiceUser: string;
	orderDetails: string;
	orderNumber: string;
	products: ProductOrderType[];
	references: string;
	shop: string;
	status:
		| 'PLACED'
		| 'IN_PREPARATION'
		| 'READY_FOR_PICKUP'
		| 'PICKUP_IN_PROGRESS'
		| 'ON_THE_WAY'
		| 'DELIVERED'
		| 'REJECTED_BY_SHOP'
		| 'NO_CARRIER_AVAILABLE'
		| 'CANCELLED'
		| 'ALTERNATIVE_DELIVERY_METHOD';
	subtotalProductsWithTax: number;
	subtotalProductsWithoutTax: number;
	tax: number;
	total: number;
	transactionId: string;
}
