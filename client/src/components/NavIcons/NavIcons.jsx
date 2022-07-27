import React from 'react';

import { UilUser, UilHome, UilChat } from '@iconscout/react-unicons';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const NavIcons = () => {
	const { user } = useSelector((state) => state.authReducer.authData);

	return (
		<div className='navIcons'>
			<Link to='../home' style={{display: 'flex', textDecoration: 'none'}}>
				<UilHome className='nav-button' />
			</Link>

			<Link to={`/profile/${user._id}`} style={{ display: 'flex', textDecoration: 'none' }}>
				<UilUser className='nav-button' />
			</Link>

			<Link to='../chat' style={{display: 'flex', textDecoration: 'none'}}>
				<UilChat className='nav-button' />
			</Link>
		</div>
	);
};

export default NavIcons;