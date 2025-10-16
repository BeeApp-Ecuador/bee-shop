import React from 'react';
import { RouteProps } from 'react-router-dom';
// import { demoPagesMenu, pageLayoutTypesPagesMenu } from '../menu';
import DefaultAside from '../pages/_layout/_asides/DefaultAside';

const asides: RouteProps[] = [
	{ path: 'login', element: null },
	{ path: '*', element: <DefaultAside /> },
];

export default asides;
