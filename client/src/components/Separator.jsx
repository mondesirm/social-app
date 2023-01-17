import { Flex, Box, Divider, useColorModeValue, Text } from '@chakra-ui/react'

import { useAuth } from '../contexts/AuthContext'

export default function Separator({ children, hasComponents, action, staff, ...rest }) {
	const { currentUser } = useAuth()

	return (
		<Flex align='center' color={useColorModeValue('gray.600', 'gray.400')} {...rest}>
			<Box flex={1}>
				<Divider borderColor='currentcolor' />
			</Box>

			{hasComponents ? children : <Text as='span' px={3} fontWeight='medium'>{children}</Text>}

			<Box flex={action ? .5 : 1}>
				<Divider borderColor='currentcolor' />
			</Box>

			{/* {action && <Box pl={3}>{action}</Box>} */}
			{action && (!staff || (staff && currentUser.roles.includes('staff'))) && <Box pl={3}>{action}</Box>}
		</Flex>
	)
}

/*

if action exists, show Box unless it's for staff only
{action && (!staff || (staff && user.roles.includes('staff'))) && <Box pl={3}>{action}</Box>}

*/