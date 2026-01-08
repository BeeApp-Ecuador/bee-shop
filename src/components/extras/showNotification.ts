import { Store } from 'react-notifications-component';

const showNotification = (
	title: string | JSX.Element,
	message: string | JSX.Element,
	type = 'default',
	duration: number = 5000, // ms | 0 = persistente
) => {
	Store.addNotification({
		title,
		message,
		// @ts-ignore
		type,
		insert: 'top',
		container: 'top-right',
		animationIn: ['animate__animated', 'animate__fadeIn'],
		animationOut: ['animate__animated', 'animate__fadeOut'],
		dismiss: {
			duration: duration,
			pauseOnHover: true,
			onScreen: true,
			showIcon: true,
			waitForAnimation: true,
		},
	});
};

export default showNotification;
