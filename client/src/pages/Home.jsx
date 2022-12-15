import { useEffect, useState } from 'react'
import { Box, Button, Card, CardBody, CardFooter, Checkbox, CheckboxGroup, Flex, Heading, HStack, Image, Text, Tooltip, VStack, Skeleton, SkeletonCircle, SkeletonText, Stack } from '@chakra-ui/react'

import { Layout } from '../components/Layout'
import { useAuth } from '../contexts/AuthContext'

export default function Home() {
	const { currentUser } = useAuth()

	/* const RoomCard = ({ room, ...rest }) => (
		<Box p={5} shadow='md' borderWidth='1px' {...rest}>
			<Image loading='lazy' src={room.image} />
			<Heading fontSize='xl'>{room.name}</Heading>
			<Tooltip label={room.owner}>
				<Text mt={4}>{room.owner}</Text>
			</Tooltip>
		</Box>
	) */

	const RoomCard = ({ room, ...rest }) => (
		<Card direction={{ base: 'column', sm: 'row' }} overflow='hidden' variant='outline'>
		<Image
			objectFit='cover'
			maxW={{ base: '100%', sm: '200px' }}
			src='https://images.unsplash.com/photo-1667489022797-ab608913feeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw5fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60'
			alt='Caffe Latte'
		/>

		<Stack>
			<CardBody>
				<Heading size='md'>{room.name}</Heading>
				{room?.description && <Text py='2'>{room?.description}</Text>}
			</CardBody>

			<CardFooter>
				<Button variant='solid' colorScheme='pink'>Enter</Button>
			</CardFooter>
		</Stack>
		</Card>
	)

	return (
		<Layout>
			{currentUser && (<>
				<Heading size='md' mt={8} mb={2}>Joined Rooms</Heading>
			</>)}

			{currentUser?.rooms.length > 0 ? (<>
				<HStack spacing={8}>
					{currentUser?.rooms.map(room => (<RoomCard key={room._id} room={room} />))}
				</HStack>
			</>) : (<>
				<SkeletonText>Create a new room</SkeletonText>
				<SkeletonText>Create a new room</SkeletonText>

				<HStack spacing={8}>
					{[1, 2, 3, 4, 5, 6, 7, 8, 9].map(index => (
						<Skeleton key={index} height='200px' width='200px' />
					))}
				</HStack>
			</>)}

			{/* { currentUser && <pre>{JSON.stringify(currentUser, null, 2)}</pre> } */}

			<Flex mt={4} justify='space-around'>
				<CheckboxGroup colorScheme='green'>
					<VStack align='stretch'>
						<Heading size='md'>Base features</Heading>

						{[
							'Error pages',
							'Protected routes',
							'Authentication with credentials',
							'Authentication with third-party providers',
							'Password reset from login and profile pages',
							'Redirection to or back from state',
							'Custom hooks: useAuth() and useMounted()',
							'Loading indicators during form submission',
							'Dark mode'
						].map((feature, index) => (
							<Checkbox key={index} defaultChecked>{feature}.</Checkbox>
						))}
					</VStack>
				</CheckboxGroup>

				<CheckboxGroup colorScheme='teal'>
					<VStack align='stretch'>
						<Heading size='md'>Main features</Heading>

						{[
							'Error pages',
							'Protected routes',
							'Authentication with credentials',
							'Authentication with third-party providers',
							'Password reset from login and profile pages',
							'Redirection to or back from state',
							'Custom hooks: useAuth() and useMounted()',
							'Loading indicators during form submission',
							'Dark mode'
						].map((feature, index) => (
							<Checkbox key={index} defaultChecked>{feature}.</Checkbox>
						))}
					</VStack>
				</CheckboxGroup>
			</Flex>
		</Layout>
	)
}