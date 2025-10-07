export interface CountryType {
	_id?: string;
	name: string;
	nameTranslations: any;
	flag: string;
	code: string;
	dialCode: string;
	regionCode?: string;
	minLength: number;
	maxLength: number;
}
