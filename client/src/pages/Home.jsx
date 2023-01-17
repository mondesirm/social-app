import React, { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { FaCheck, FaTimes, FaTrash } from 'react-icons/fa'
import { Avatar, AvatarBadge, AvatarGroup, Button, ButtonGroup, Container, Editable, EditableInput, EditablePreview, Flex, FormControl, FormErrorMessage, FormHelperText, FormLabel, Heading, HStack, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, /* Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverFooter, PopoverHeader, PopoverTrigger, */ Text, Tooltip, useColorModeValue, useDisclosure, useEditableControls } from '@chakra-ui/react'

import useMounted from '../hooks/useMounted'
import { Layout } from '../components/Layout'
import Separator from '../components/Separator'
import { useAuth } from '../contexts/AuthContext'

export default function Home() {
	const { currentUser, onlineUsers, update, remove } = useAuth()
	const avatarRef = useRef()
	const initialRef = useRef()
	const mounted = useMounted()
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const [inputs, setInputs] = useState(currentUser)
	const [isDeleting, setIsDeleting] = useState(false)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const { isOpen, onOpen, onClose, onToggle } = useDisclosure()

	useEffect(() => setInputs(currentUser), [currentUser])

	const format = date => {
		date = new Date(Date.now() - new Date(date).getTime())
		if (date.getTime() < 60000) return `${date.getMinutes()} min ago`
		if (date.getTime() < 3600000) return `${date.getHours()}h ago`
		return date.getDate() - 1 < 1 ? 'yesterday' : `${date.getDate() - 1}d+ ago`
	}

	const EditableControls = ({ target }) => {
		const { isEditing, /* getSubmitButtonProps, getCancelButtonProps */ } = useEditableControls()

		return (<>
			{target === 'avatar' && (<Input hidden={!isEditing} py={2} px={4} ref={avatarRef} name='avatar' type='url' autoFocus onBlur={handleSubmit} onChange={handleChange} />)}

			{/* {isEditing && (
				<ButtonGroup pos='absolute' top='4em' m='1em 0 !important' size='sm'>
					<IconButton icon={<FaTimes />} {...getCancelButtonProps()} />
					<IconButton type='submit' icon={<FaCheck />} {...getSubmitButtonProps()} />
				</ButtonGroup>
			)} */}
		</>)
	}

	const EditableAvatar = () => {
		return (<Avatar
			name={inputs.username}
			loading='lazy'
			src={'/images/avatars/' + (inputs?.avatar || 'default.png')}
			boxSize='100px'
			borderRadius='full'
		/>)
	}

	const handleChange = ({ target: { name, value } }) => {
		setInputs(values => ({ ...values, [name]: value }))
		console.log(inputs)
	}

	const handleSubmit = async e => {
		const { name, value } = e.target ?? e

		setIsSubmitting(true)

		if (currentUser[name] === value) {
			mounted.current && setIsSubmitting(false)
			return
		}

		switch (name) {
			case 'email':
			case 'password':
				if (isDeleting) {
					dispatch(remove(currentUser._id, inputs, navigate))
				} else {
					dispatch(update(currentUser._id, inputs))
				}

				onClose()
				mounted.current && setIsDeleting(false)
				break
			default:
				dispatch(update(currentUser._id, inputs))
				break
		}

		mounted.current && setIsSubmitting(false)
	}

	return (
		<Layout>
			<Heading>Account</Heading>

			<pre>{JSON.stringify(onlineUsers, null, 2)}</pre>

			<Container maxW='container.lg' overflowX='auto' py={4}>
				<Flex w='100%' columnGap='.5em'>
					<FormControl>
						{/* <FormLabel>Avatar</FormLabel> */}

						<Editable isDisabled defaultValue={<EditableAvatar />} onClick={() => avatarRef.current.click()}>
							<Tooltip label='Read Only'>
								<EditablePreview py={2} px={4} _hover={{ background: useColorModeValue('gray.100', 'gray.700') }} />
							</Tooltip>

							<HStack>
								<EditableControls target='avatar' />
							</HStack>
						</Editable>
					</FormControl>

					<FormControl>
						<FormLabel>First Name</FormLabel>

						<Editable defaultValue={inputs.firstName}>
							<Tooltip label='Click to edit first name'>
								<EditablePreview py={2} px={4} _hover={{ background: useColorModeValue('gray.100', 'gray.700') }} border='1px solid' borderColor='whiteAlpha.100' borderRadius='md' />
							</Tooltip>

							<HStack justifyContent='space-between'>
								<Input py={2} px={4} as={EditableInput} name='firstName' type='text' autoComplete='firstName' autoFocus value={inputs.firstName} required onBlur={handleSubmit} onChange={handleChange} />
								<EditableControls target='firstName' />
							</HStack>
						</Editable>
					</FormControl>

					<FormControl>
						<FormLabel>Last Name</FormLabel>

						<Editable defaultValue={inputs.lastName}>
							<Tooltip label='Click to edit last name'>
								<EditablePreview py={2} px={4} _hover={{ background: useColorModeValue('gray.100', 'gray.700') }} border='1px solid' borderColor='whiteAlpha.100' borderRadius='md' />
							</Tooltip>

							<HStack justifyContent='space-between'>
								<Input py={2} px={4} as={EditableInput} name='lastName' type='text' autoComplete='lastName' autoFocus value={inputs.lastName} required onBlur={handleSubmit} onChange={handleChange} />
								<EditableControls target='lastName' />
							</HStack>
						</Editable>
					</FormControl>

					<FormControl>
						<FormLabel>Username</FormLabel>

						<Editable defaultValue={inputs.username}>
							<Tooltip label='Click to edit username'>
								<EditablePreview py={2} px={4} _hover={{ background: useColorModeValue('gray.100', 'gray.700') }} border='1px solid' borderColor='whiteAlpha.100' borderRadius='md' />
							</Tooltip>

							<HStack justifyContent='space-between'>
								<Input py={2} px={4} as={EditableInput} name='username' type='text' autoComplete='username' autoFocus value={inputs.username} required onBlur={handleSubmit} onChange={handleChange} />
								<EditableControls target='username' />
							</HStack>
						</Editable>
					</FormControl>

					<FormControl>
						<FormLabel>Email Address</FormLabel>

						<Editable defaultValue={inputs.email}>
							<Tooltip label='Click to edit email address'>
								<EditablePreview py={2} px={4} _hover={{ background: useColorModeValue('gray.100', 'gray.700') }} border='1px solid' borderColor='whiteAlpha.100' borderRadius='md' />
							</Tooltip>

							<HStack justifyContent='space-between'>
								<Input py={2} px={4} as={EditableInput} name='email' type='email' autoComplete='email' autoFocus value={inputs.email} required onBlur={(e) => { if (currentUser.email !== e.target.value) { handleChange(e); onOpen() } }} onChange={handleChange} />
								<EditableControls target='email' />
							</HStack>
						</Editable>
					</FormControl>

					<FormControl>
						<FormLabel>Password</FormLabel>
						<Button variant='outline' onClick={() => navigate('/reset-password')} colorScheme='orange' size='md' fontSize='md'>Reset</Button>
					</FormControl>
				</Flex>

				{currentUser?.following.length > 0 && (<>
					<Separator my={6}>Following</Separator>

					<AvatarGroup size='md' max={2}>
						{currentUser.following.map(user => (
							<Avatar key={'following_' + user._id} name={user.username} src={'/images/avatars/' + (inputs?.avatar || 'default.png')}>
								<Tooltip label={user.username + (onlineUsers.find(u => u._id === user._id) ? ' is online' : ' was last seen ' + format(user.lastSeen))} placement='top'>
									<AvatarBadge boxSize='1em' bg={onlineUsers.find(u => u._id === user._id) ? 'green.500' : 'gray.500'} />
								</Tooltip>
							</Avatar>
						))}
					</AvatarGroup>
				</>)}

				{currentUser?.followers.length > 0 && (<>
					<Separator my={6}>Followers</Separator>

					<AvatarGroup size='md' max={2}>
						{currentUser.followers.map(user => (
							<Avatar key={'followers_' + user._id} name={user.username} src={'/images/avatars/' + (inputs?.avatar || 'default.png')} onClick={onToggle}>
								<Tooltip label={user.username + (onlineUsers.some(u => u._id === user._id) ? ' is online' : ' was last seen ' + format(user.lastSeen))} placement='top'>
									<AvatarBadge boxSize='1em' bg={onlineUsers.some(u => u._id === user._id) ? 'green.500' : 'gray.500'} />
								</Tooltip>
							</Avatar>
						))}
					</AvatarGroup>
				</>)}

				<Separator my={6} textColor='red'>DANGER ZONE</Separator>

				<Tooltip label='Irreversible'>
					<Button variant='outline' colorScheme='red' leftIcon={<FaTrash />} onClick={() => { setIsDeleting(true); onOpen() }} isLoading={isSubmitting}>Delete Account</Button>
				</Tooltip>
			</Container>

			<Modal initialFocusRef={initialRef} isOpen={isOpen} onClose={onClose} isCentered>
				<ModalOverlay />

				<ModalContent>
					<ModalHeader>{isDeleting ? 'Deleting Account' : 'Updating Email'}</ModalHeader>

					<ModalCloseButton />

					<ModalBody pb={6}>
						<Text fontSize='sm'>This action is irreversible.</Text>

						<FormControl id='password' mt={4}>
							<FormLabel>Password</FormLabel>
							<Input ref={initialRef} name='password' type='password' autoComplete='password' required onSubmit={handleSubmit} onChange={handleChange} />
						</FormControl>
					</ModalBody>

					<ModalFooter>
						<Button colorScheme='blue' mr={3} onClick={(e) => handleSubmit(initialRef.current)} isLoading={isSubmitting}>Confirm</Button>
						<Button onClick={onClose}>Cancel</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</Layout>
	)
}