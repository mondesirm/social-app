import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ChakraProvider, ColorModeScript, extendTheme } from '@chakra-ui/react'

import App from './App'

const config = { initialColorMode: 'light', useSystemColorMode: false }
const theme = extendTheme({ config })

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<ChakraProvider>
			<ColorModeScript initialColorMode={theme.config.initialColorMode} />
			<App />
		</ChakraProvider>
	</StrictMode>
)