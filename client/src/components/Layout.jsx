import React from 'react'
import { Box, Container } from '@chakra-ui/react'

import Footer from './Footer'
import Navbar from '../components/Navbar'
import StickyTop from './StickyTop'

export function Layout({ noFooter, children }) {
	return (
		<Box mb={4}>
			<Navbar />
			<Container maxW='container.xl'>{children}</Container>
			{!noFooter && <Footer />}
			{!noFooter && <StickyTop />}
		</Box>
	)
}