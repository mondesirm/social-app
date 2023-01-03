import React from 'react'
import { Box, Container } from '@chakra-ui/react'

import Navbar from '../components/Navbar'
import Footer from './Footer'

export function Layout({ noFooter, children }) {
	return (
		<Box mb={4}>
			<Navbar />
			<Container maxW='container.xl'>{children}</Container>
			{!noFooter && <Footer />}
		</Box>
	)
}