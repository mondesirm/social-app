import React from 'react'
import { SearchIcon } from '@chakra-ui/icons'

import './LogoSearch.css'
// import Logo from '../../img/logo.png'

const LogoSearch = () => {
	return (
		<div className='LogoSearch'>
			<div className='Search'>
				<input type='text' placeholder='Search tags...' />
				<div className='s-icon'>
					<SearchIcon />
				</div>
			</div>
		</div>
	)
}

export default LogoSearch