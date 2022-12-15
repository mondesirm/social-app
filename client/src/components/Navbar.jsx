import { useDispatch } from 'react-redux'
import { FaMoon, FaSun } from 'react-icons/fa'
import { Box, HStack, IconButton, Spacer, useColorMode, useColorModeValue } from '@chakra-ui/react'

import Navlink from './Navlink'
import { useAuth } from '../contexts/AuthContext'
import { useLocation, useNavigate } from 'react-router-dom'

export default function Navbar() {
	const { currentUser, logout } = useAuth()
	const navigate = useNavigate()
	const location = useLocation()
	const { toggleColorMode } = useColorMode()
	const dispatch = useDispatch()

	return (
		<Box borderBottom='2px' borderBottomColor={useColorModeValue('gray.100', 'gray.700')} mb={4} py={4}>
			<HStack justifyContent='flex-end' maxW='container.lg' mx='auto' spacing={4}>
				<Navlink to='/' name="Social App" size='lg' />
				<Navlink to='/timeline' name='Timeline' />

				<Spacer />

				{!currentUser && (<>
					<Navlink to='/login' name='Login' />
					<Navlink to='/register' name='Register' />
				</>)}

				{currentUser && (<>
					<Navlink to='/chat' name='Chat' />
					<Navlink to='/profile' name='Profile' />
					<Navlink to='/logout' name='Logout' onClick={async e => { e.preventDefault(); dispatch(logout(currentUser, navigate, location)) }} />
				</>)}

				<IconButton variant='outline' icon={useColorModeValue(<FaSun />, <FaMoon />)} onClick={toggleColorMode} aria-label='toggle-dark-mode' />
			</HStack>
		</Box>
	)
}