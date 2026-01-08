import React, { useContext, useEffect, useLayoutEffect, useRef } from 'react';
import { ThemeProvider } from 'react-jss';
import { ReactNotifications } from 'react-notifications-component';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';
import { ToastContainer } from 'react-toastify';
import Wrapper from '../layout/Wrapper/Wrapper';
import Portal from '../layout/Portal/Portal';
import useDarkMode from '../hooks/useDarkMode';
import COLORS from '../common/data/enumColors';
import { getOS } from '../helpers/helpers';
import AsideRoutes from '../layout/Aside/AsideRoutes';
import { ToastCloseButton } from '../components/bootstrap/Toasts';
import AuthContext from '../contexts/authContext';
// import { lockAudio, playOrderSound, unlockAudio } from '../notifications/notificationSound';
import { useSocket } from '../hooks/useSocket';
import socketService from '../store/socketService';
import { playOrderSound } from '../notifications/notificationSound';
import showNotification from '../components/extras/showNotification';
import Icon from '../components/icon/Icon';

const App = () => {
	getOS();

	dayjs.extend(localizedFormat);
	dayjs.extend(relativeTime);

	const { themeStatus, darkModeStatus } = useDarkMode();
	const theme = {
		theme: themeStatus,
		primary: COLORS.PRIMARY.code,
		secondary: COLORS.SECONDARY.code,
		success: COLORS.SUCCESS.code,
		info: COLORS.INFO.code,
		warning: COLORS.WARNING.code,
		danger: COLORS.DANGER.code,
		dark: COLORS.DARK.code,
		light: COLORS.LIGHT.code,
	};

	useEffect(() => {
		if (darkModeStatus) {
			document.documentElement.setAttribute('theme', 'dark');
			document.documentElement.setAttribute('data-bs-theme', 'dark');
		}
		return () => {
			document.documentElement.removeAttribute('theme');
			document.documentElement.removeAttribute('data-bs-theme');
		};
	}, [darkModeStatus]);

	useEffect(() => {
		const handler = (event: MessageEvent) => {
			if (event.data?.type === 'NEW_ORDER') {
				playOrderSound();
			}
		};

		navigator.serviceWorker.addEventListener('message', handler);
		return () => navigator.serviceWorker.removeEventListener('message', handler);
	}, []);

	const ref = useRef(null);

	useLayoutEffect(() => {
		if (import.meta.env.VITE_MODERN_DESGIN === 'true') {
			document.body.classList.add('modern-design');
		} else {
			document.body.classList.remove('modern-design');
		}
	});

	// useEffect(() => {
	// 	lockAudio();

	// 	const unlock = () => {
	// 		unlockAudio();
	// 	};

	// 	document.addEventListener('pointerdown', unlock, { once: true });

	// 	return () => {
	// 		document.removeEventListener('pointerdown', unlock);
	// 	};
	// }, []);

	const { user: shop } = useContext(AuthContext);

	useSocket();

	useEffect(() => {
		const socket = socketService.getSocket();
		if (!socket) return;

		const handleNewOrder = (data: any) => {
			showNotification(
				<span className='d-flex align-items-center'>
					<Icon icon='Check' size='lg' className='me-1' />
					<span>Nueva orden</span>
				</span>,
				'Tienes un nuevo pedido',
				'success',
				0,
			);
			playOrderSound();
		};

		socket.on('order', handleNewOrder);

		return () => {
			socket.off('order', handleNewOrder);
		};
	}, []);

	return (
		<ThemeProvider theme={theme}>
			<div ref={ref} className='app'>
				{shop.status !== 'PENDING' && shop.completedProfile && <AsideRoutes />}
				<Wrapper />
			</div>
			<Portal id='portal-notification'>
				<ReactNotifications />
			</Portal>
			<ToastContainer closeButton={ToastCloseButton} toastClassName='toast show' />
		</ThemeProvider>
	);
};

export default App;
