import React, { useEffect, useRef, useState } from 'react';

import { ShopType } from '../../type/shop-type';
import Card, {
	CardBody,
	CardFooter,
	CardFooterRight,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../bootstrap/Card';
import FormGroup from '../bootstrap/forms/FormGroup';
import Input from '../bootstrap/forms/Input';
import Button from '../bootstrap/Button';
import MapCard, { MapCardRef } from './MapCard';

const AddressInfo = ({ shop }: { shop: ShopType }) => {
	const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
	// const [error, setError] = useState<string | null>(null);
	const [searchAddress, setSearchAddress] = useState<string>('');
	const handleCoordsChange = (coords: { lat: number; lng: number }) => {
		console.log('Nuevas coordenadas:', coords);
	};
	const mapRef = useRef<MapCardRef>(null);
	useEffect(() => {
		if (shop.completedProfile) {
			setCoords({
				lat: parseFloat(shop.lat),
				lng: parseFloat(shop.lng),
			});
		} else {
			if ('geolocation' in navigator) {
				navigator.geolocation.getCurrentPosition(
					(position) => {
						setCoords({
							lat: position.coords.latitude,
							lng: position.coords.longitude,
						});
					},
					(err) => {
						// setError('No se pudo obtener la ubicación. Activa los permisos de ubicación.');
						console.error(err);
					},
				);
			} else {
				// setError('Tu navegador no soporta geolocalización.');
			}
		}
	}, []);
	return (
		<Card
			className='rounded-2'
			tag='form'
			// onSubmit={formik.handleSubmit}
		>
			<CardHeader>
				<CardLabel icon='HolidayVillage'>
					<CardTitle>Dirección del local</CardTitle>
				</CardLabel>
			</CardHeader>
			<CardBody>
				<div className='row g-4'>
					<FormGroup className='col-md-4' id='formCountry' label='País'>
						<Input disabled value={shop.country.name} />
					</FormGroup>
					<FormGroup className='col-md-4' id='formState' label='Provincia'>
						<Input disabled value={shop.province.descripcion} />
					</FormGroup>
					<FormGroup className='col-md-4' id='formCity' label='Ciudad'>
						<Input disabled value={shop.city.description} />
					</FormGroup>
					<FormGroup className='col-12' id='formAddressLine' label='Dirección'>
						<Input disabled value={shop.address} />
					</FormGroup>
					<MapCard
						lat={shop.completedProfile ? shop.lat : (coords?.lat ?? '-2.90055')}
						lng={shop.completedProfile ? shop.lng : (coords?.lng ?? '-79.00454')}
						heightE='300px'
						onCoordsChange={handleCoordsChange}
						ref={mapRef}
						interactive={false}
					/>
				</div>
			</CardBody>
			<CardFooter>
				<CardFooterRight>
					<Button type='submit' color='primary' icon='Save'>
						Guardar
					</Button>
				</CardFooterRight>
			</CardFooter>
		</Card>
	);
};

export default AddressInfo;
