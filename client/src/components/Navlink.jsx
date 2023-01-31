import { NavLink as Link, useLocation } from 'react-router-dom'
import { Button, IconButton, useMediaQuery } from '@chakra-ui/react'

export default function Navlink({ to, name, icon, variant = 'ghost', colorScheme = 'blue', ...rest }) {
	const { pathname } = useLocation()
	const isActive = pathname.startsWith(to)
	const [screenIsSmall] = useMediaQuery('(max-width: 768px)')

	return (
		<Link to={to}>
			{screenIsSmall
				? <IconButton icon={icon} variant={isActive ? 'solid' : variant} colorScheme={isActive ? 'pink' : colorScheme} {...rest} />
				: <Button leftIcon={icon} variant={isActive ? 'solid' : variant} colorScheme={isActive ? 'pink' : colorScheme} {...rest}>{name}</Button>
			}
		</Link>
	)
}