import React from 'react'
import { Button } from '@chakra-ui/react'
import { NavLink as Link, useLocation } from 'react-router-dom'

export default function Navlink({ to, name, ...rest }) {
	const { pathname } = useLocation()
	const isActive = pathname === to

	return (
		<Link to={to}>
			<Button
				variant={isActive ? 'outline' : 'ghost'}
				colorScheme={isActive ? 'pink' : 'blue'}
				{...rest}
			>
				{name}
			</Button>
		</Link>
	)
}