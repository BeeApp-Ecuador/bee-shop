export interface ProductOrderType {
	_id: string;
	basePrice: number;
	name: string;
	percentPromo: number;
	product: {
		_id: string;
		img: string;
		name: string;
	};
	promotion: boolean;
	quantity: number;
	selectedOptions: any[];
	totalPrice: number;
}
