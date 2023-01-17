import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'

import './App.css';
import store from './store/ReduxStore'
import AppRouter from './components/AppRouter';
import AuthContextProvider from './contexts/AuthContext';
import DatabaseContextProvider from './contexts/DatabaseContext';

export default function App() {
	return (
		<Provider store={store}>
			<AuthContextProvider>
				<DatabaseContextProvider>
					<BrowserRouter>
						<AppRouter />
					</BrowserRouter>
				</DatabaseContextProvider>
			</AuthContextProvider>
		</Provider>
	)
}