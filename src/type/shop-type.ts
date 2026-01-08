export interface ShopType {
	address: string;
	addressLegalAgent: string;
	autoAcceptOrders: boolean;
	businessName: string;
	category?: [];
	ciLegalAgent: string;
	city: {
		_id: string;
		description: string;
	};
	completedProfile: boolean;
	country: {
		_id: string;
		name: string;
	};
	createdAt: string;
	description: string;
	descriptionReservation: string;
	email: string;
	expiredInvoice: any;
	haveDeliveryBee: boolean;
	havePickup: boolean;
	haveReservation: boolean;
	identificationBusiness: string;
	identificationLegal: string;
	img: string;
	isInvoice: boolean;
	lat: string;
	legalName: string;
	lng: string;
	maxPeoplePerReservation: number;
	nameLegalAgent: string;
	notifyInvoice: boolean;
	open: boolean;
	openShopSchedule: [];
	phone: string;
	phoneLegalAgent: string;
	prefix: string;
	prefixLegalAgent: string;
	province: {
		_id: string;
		descripcion: string;
	};
	qrShop: string;
	resetPassword: boolean;
	ruc: string;
	status: string;
	tags: [];
	_id: string;
}
