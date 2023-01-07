import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { FaComments, FaCompass, FaGlobe, FaMoon, FaSignOutAlt, FaSun } from 'react-icons/fa'
import { Box, Container, HStack, IconButton, Spacer, useColorMode, useColorModeValue } from '@chakra-ui/react'

import Navlink from './Navlink'
import { useAuth } from '../contexts/AuthContext'

export default function Navbar() {
	const { currentUser, logout } = useAuth()
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const { toggleColorMode } = useColorMode()

	return (
		<Container maxW='container.xl'>
			<Box mb={4} py={2} borderBottom='2px' borderBottomColor={useColorModeValue('gray.100', 'gray.700')}>
				<HStack justifyContent='flex-end' maxW='container.lg' mx='auto' spacing={4}>
					<Navlink to='/' name="Social App" size='lg' />
					{currentUser && <Navlink to='/explore' name='Explore' icon={<FaCompass />} />}
					{/* <Navlink to='/timeline' name='Timeline' /> */}

					<Spacer />

					{!currentUser && (<>
						<Navlink to='/login' name='Login' variant='outline' />
						<Navlink to='/register' name='Register' variant='outline' />
					</>)}

					{currentUser && (<>
						<Navlink to='/room' name='Rooms' icon={<FaGlobe />} />
						<Navlink to='/chat' name='Chats' icon={<FaComments />} />
						{/* <Navlink to={`/profile/${currentUser._id}`} name='Profile' /> */}
						<Navlink to='/logout' name='Logout' icon={<FaSignOutAlt />} variant='outline' onClick={async e => { e.preventDefault(); dispatch(logout(currentUser, navigate)) }} />
					</>)}

					<IconButton variant='outline' icon={useColorModeValue(<FaSun />, <FaMoon />)} onClick={toggleColorMode} aria-label='toggle-dark-mode' />
				</HStack>
			</Box>
		</Container>
	)
}