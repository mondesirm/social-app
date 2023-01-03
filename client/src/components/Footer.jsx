import { FaGithub, FaLinkedin, FaTwitch } from 'react-icons/fa'
import { ButtonGroup, Container, IconButton, Stack, Text, } from '@chakra-ui/react'

import Logo from './Logo'

export default function Footer() {
	return (
		<Container as='footer' role='contentinfo' maxW='container.xl' mt={4}>
			<Stack spacing={{ base: '4', md: '5' }} p={8}>
				<Stack justify='space-between' direction='row' align='center'>
					<Logo />
					<ButtonGroup variant='ghost'>
						<IconButton
							as='a'
							href='https://github.com/mondesirm/social-app'
							aria-label='GitHub'
							icon={<FaGithub fontSize='1.25rem' />}
						/>

						<IconButton
							as='a'
							href='https://linkedin.com/school/esgi'
							aria-label='LinkedIn'
							icon={<FaLinkedin fontSize='1.25rem' />}
						/>

						<IconButton
							as='a'
							href='https://www.twitch.tv/esgi_paris'
							aria-label='Twitch'
							icon={<FaTwitch fontSize='1.25rem' />}
						/>
					</ButtonGroup>
				</Stack>

				<Text fontSize='sm' color='subtle'>
					&copy; {new Date().getFullYear()} Chakra UI Pro, Inc. All rights reserved.
				</Text>
			</Stack>
		</Container>
	)
}