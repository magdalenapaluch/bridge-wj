import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import reportWebVitals from './reportWebVitals';
import {
	ThemeProvider,
	createTheme
} from '@mui/material/styles';

export const PRIMARY_MAIN = '#1F271B';
export const PRIMARY_LIGHT = '#F5E9E2';

const theme = createTheme({
	palette: {
		primary: {
			light: PRIMARY_LIGHT,
			main: PRIMARY_MAIN,
			contrastText: '#F5E9E2',
		},
		// secondary: {
			// light: '#6E8898',
			// main: '#7EBC89',
			// dark: '#D3D0CB',
			// contrastText: '#e2c044',
		// },
	},
	typography: {
		fontFamily: [
		  '-apple-system',
		  'BlinkMacSystemFont',
		  '"Segoe UI"',
		  'Roboto',
		  '"Helvetica Neue"',
		  'Arial',
		  'sans-serif',
		  '"Apple Color Emoji"',
		  '"Segoe UI Emoji"',
		  '"Segoe UI Symbol"',
		].join(','),
	  },
});
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render( < ThemeProvider theme = {
	theme
} > < App / > < /ThemeProvider>);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();