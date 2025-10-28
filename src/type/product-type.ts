export interface ProductType {
	_id?: string;
	name: string;
	description: string;
	restricted: boolean;
	tax: boolean;
	priceWithoutVAT: number;
	priceWithVAT: number;
	percentPromo: number;
	img: File | null;
	productCategory: string;
	haveOptions: boolean;
	tags?: string[];
	options?: [];
}
