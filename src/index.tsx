import React from 'react';
// import ReactDOM from 'react-dom'; // For React 17
import { createRoot } from 'react-dom/client'; // For React 18
import { BrowserRouter as Router } from 'react-router-dom';
import './styles/styles.scss';
import App from './App/App';
import reportWebVitals from './reportWebVitals';
import { ThemeContextProvider } from './contexts/themeContext';
import { AuthContextProvider } from './contexts/authContext';
import './i18n';
import { Provider } from 'react-redux';
import { store } from './store';
import { registerFirebaseSW } from './firebase/firebaseSw';
import { initAudioUnlock } from './notifications/notificationSound';

// 🔹 Registro del Service Worker (sin exportar nada)
if ('serviceWorker' in navigator) {
	window.addEventListener('load', () => {
		registerFirebaseSW();
	});
}

initAudioUnlock();
const children = (
	<AuthContextProvider>
		<ThemeContextProvider>
			<Provider store={store}>
				<Router basename='shop'>
					{/* <React.StrictMode> */}
					<App />
					{/* </React.StrictMode> */}
				</Router>
			</Provider>
		</ThemeContextProvider>
	</AuthContextProvider>
);

const container = document.getElementById('root');

createRoot(container as Element).render(children);

reportWebVitals();
