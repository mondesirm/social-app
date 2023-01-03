import React from 'react'
import { Button } from '@chakra-ui/react'
import { NavLink as Link, useLocation } from 'react-router-dom'

export default function Navlink({ to, name, icon, variant = 'ghost', colorScheme = 'blue', ...rest }) {
	const { pathname } = useLocation()
	const isActive = pathname === to

	return (
		<Link to={to}>
			<Button leftIcon={icon} variant={isActive ? 'solid' : variant} colorScheme={isActive ? 'pink' : colorScheme} {...rest}>{name}</Button>
		</Link>
	)
}