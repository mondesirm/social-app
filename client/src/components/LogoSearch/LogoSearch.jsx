import React from 'react';
import Logo from '../../img/logo.png';
import './LogoSearch.css';
import { UilSearch } from '@iconscout/react-unicons';
const LogoSearch = () => {
	return (
		<div className='LogoSearch'>
			<div className='Search'>
				<input type='text' placeholder='Search techs...' />
				<div className='s-icon'>
					<UilSearch />
				</div>
			</div>
		</div>
	);
};

export default LogoSearch;