import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'

import store from './store/ReduxStore'
import AppRouter from './components/AppRouter';
import AuthContextProvider from './contexts/AuthContext';

export default function App() {
	return (
		<Provider store={store}>
			<AuthContextProvider>
				<BrowserRouter>
					<AppRouter />
				</BrowserRouter>
			</AuthContextProvider>
		</Provider>
	)
}