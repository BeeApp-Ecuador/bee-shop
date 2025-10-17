/* eslint-disable import/no-extraneous-dependencies */
import React, {
	useEffect,
	useRef,
	useState,
	useCallback,
	forwardRef,
	useImperativeHandle,
} from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import { fromLonLat, transform } from 'ol/proj';
import { defaults as defaultControls } from 'ol/control.js';

interface MapCardProps {
	lat?: number | string | null;
	lng?: number | string | null;
	heightE?: string;
	onCoordsChange?: (coords: { lat: number; lng: number }) => void;
}

export interface MapCardRef {
	centerMap: (lng: number, lat: number, zoom?: number) => void;
}

const MapCard = forwardRef<MapCardRef, MapCardProps>(
	({ lat, lng, heightE, onCoordsChange }, ref) => {
		const mapRef = useRef<HTMLDivElement>(null);
		const mapInstance = useRef<Map | null>(null);
		const markerLayerRef = useRef<VectorLayer<any> | null>(null);

		const [isNew, setIsNew] = useState(true);
		const [zoom, setZoom] = useState(15);

		// 🔹 Inicialización del mapa
		useEffect(() => {
			const defaultLat = lat && lat !== 'null' ? Number(lat) : -0.21542619772706928;
			const defaultLng = lng && lng !== 'null' ? Number(lng) : -78.51745989941895;
			const initialZoom = lat && lng ? 15 : 7;

			setIsNew(!(lat && lng));
			setZoom(initialZoom);

			if (mapRef.current) {
				const map = new Map({
					controls: defaultControls({
						zoom: false,
						rotate: false,
					}),
					target: mapRef.current,
					layers: [
						new TileLayer({
							source: new XYZ({
								url: 'https://mt0.google.com/vt/lyrs=m&hl=en&x={x}&y={y}&z={z}&s=Ga',
							}),
						}),
					],
					view: new View({
						center: fromLonLat([defaultLng, defaultLat]),
						zoom: initialZoom,
						maxZoom: 18,
						minZoom: 7,
					}),
				});

				mapInstance.current = map;
				setMarker(defaultLng, defaultLat);
				map.on('click', handleMapClick);
			}

			return () => {
				mapInstance.current?.setTarget(undefined);
			};
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, []);

		// 🔹 Crear marcador
		const setMarker = (lng: number, lat: number) => {
			const map = mapInstance.current;
			if (!map) return;

			if (markerLayerRef.current) {
				map.removeLayer(markerLayerRef.current);
			}

			const point = new Point(fromLonLat([lng, lat]));
			const marker = new Feature({ geometry: point });
			marker.setStyle(
				new Style({
					image: new Icon({
						crossOrigin: 'anonymous',
						anchor: [20, 53],
						anchorXUnits: 'pixels',
						anchorYUnits: 'pixels',
						src: `https://bee.com.ec/register/shop/assets/img/bee_location.png`,
					}),
				}),
			);

			const vectorSource = new VectorSource({ features: [marker] });
			const markerLayer = new VectorLayer({ source: vectorSource });

			map.addLayer(markerLayer);
			markerLayerRef.current = markerLayer;

			onCoordsChange?.({ lat, lng });
		};

		// 🔹 Evento click
		const handleMapClick = (event: any) => {
			const map = mapInstance.current;
			if (!map) return;

			const coordinate = event.coordinate;
			const [lon, lat] = transform(coordinate, 'EPSG:3857', 'EPSG:4326');
			setMarker(lon, lat);
		};

		// 🔹 Método para centrar el mapa externamente
		const centerMap = useCallback((lng: number, lat: number, zoomLevel = 14) => {
			const map = mapInstance.current;
			if (!map) return;

			map.getView().setCenter(transform([lng, lat], 'EPSG:4326', 'EPSG:3857'));
			map.getView().setZoom(zoomLevel);
			setMarker(lng, lat);
		}, []);

		useImperativeHandle(ref, () => ({
			centerMap,
		}));

		return (
			<div
				id='mapC'
				ref={mapRef}
				style={{
					width: '100%',
					height: heightE || '300px',
					borderRadius: '8px',
					overflow: 'hidden',
				}}
			/>
		);
	},
);
MapCard.displayName = 'MapCard';
export default MapCard;
