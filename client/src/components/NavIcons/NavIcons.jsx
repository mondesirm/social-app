import React from 'react'
import { Link } from 'react-router-dom'
import { ChatIcon, TimeIcon, TriangleUpIcon, AtSignIcon } from '@chakra-ui/icons'

import { useAuth } from '../../contexts/AuthContext'

const NavIcons = () => {
	const { currentUser } = useAuth()

	return (
		<div className='navIcons'>
			<Link to='../' style={{display: 'flex', textDecoration: 'none'}}>
				<TriangleUpIcon className='nav-button' />
			</Link>

			<Link to='../timeline' style={{display: 'flex', textDecoration: 'none'}}>
				<TimeIcon className='nav-button' />
			</Link>

			<Link to={`/profile/${currentUser._id}`} style={{ display: 'flex', textDecoration: 'none' }}>
				<AtSignIcon className='nav-button' />
			</Link>

			<Link to='../chat' style={{display: 'flex', textDecoration: 'none'}}>
				<ChatIcon className='nav-button' />
			</Link>
		</div>
	)
}

export default NavIcons