export interface ItemType {
	detail: string;
	tax: boolean;
	price: number;
}
export interface OptionType {
	title: string;
	type: string;
	max: number;
	isRequired: boolean;
	items: ItemType[];
}
