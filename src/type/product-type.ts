export interface ProductType {
	_id?: string;
	name: string;
	description: string;
	restricted: boolean;
	tax: boolean;
	price: number;
	percentPromo: number;
	img: File | null | string;
	productCategory: string;
	haveOptions: boolean;
	tags?: string[];
	options?: [];
	status: 'AVAILABLE' | 'UNAVAILABLE' | 'DELETED';
}
