import { FiInfo } from 'react-icons/fi'
import { Box, Button, CloseButton, Container, Icon, Square, Stack, Text, useBreakpointValue, useColorModeValue, } from '@chakra-ui/react'

export default function Notification({ icon = FiInfo, title, description, cta, link }) {
	const isMobile = useBreakpointValue({ base: true, md: false })

	return (
		<Box as='section' pb={{ base: '12', md: '24' }}>
			<Box bg='bg-surface' boxShadow={useColorModeValue('sm', 'sm-dark')}>
				<Container py={{ base: '4', md: '2.5' }} position='relative'>
					<CloseButton
						display={{ sm: 'none' }}
						position='absolute'
						right='2'
						top='2'
					/>
					<Stack
						direction={{ base: 'column', sm: 'row' }}
						justify='space-between'
						spacing={{ base: '3', md: '2' }}
					>
						<Stack
							spacing='4'
							direction={{ base: 'column', md: 'row' }}
							align={{ base: 'start', md: 'center' }}
						>
							{!isMobile && (
								<Square
									size='12'
									bg='bg-subtle'
									borderRadius='md'
								>
									<Icon as={icon} boxSize='6' />
								</Square>
							)}
							<Stack
								direction={{ base: 'column', md: 'row' }}
								spacing={{ base: '0.5', md: '1.5' }}
								pe={{ base: '4', sm: '0' }}
							>
								<Text fontWeight='medium'>{title}</Text>

								<Text color='muted'>{description}</Text>
							</Stack>
						</Stack>
						<Stack
							direction={{ base: 'column', sm: 'row' }}
							spacing={{ base: '3', sm: '2' }}
							align={{ base: 'stretch', sm: 'center' }}
						>
							<Button variant='primary' width='full'>{cta}</Button>
							<CloseButton display={{ base: 'none', sm: 'inline-flex' }} />
						</Stack>
					</Stack>
				</Container>
			</Box>
		</Box>
	)
}