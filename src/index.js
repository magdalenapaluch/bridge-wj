import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import reportWebVitals from './reportWebVitals';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
	palette: {
		primary: {
			main: '#1F271B',
			contrastText: '#fff',
		},
		// secondary: {
		// 	light: '#6E8898',
		// 	main: '#503B31',
		// 	dark: '#D3D0CB',
		// 	contrastText: '#e2c044',
		// },
	},
});
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render( <ThemeProvider theme={theme}><App/></ThemeProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();