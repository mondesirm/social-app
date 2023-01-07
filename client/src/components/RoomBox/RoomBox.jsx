import React, { useEffect, useRef, useState } from 'react'

//! import { format } from 'timeago.js'
import { useDispatch } from 'react-redux'
import InputEmoji from 'react-input-emoji'
import { useLocation, useNavigate } from 'react-router-dom'

import './RoomBox.css'
// import * as User from '../../api/UserRequests'
import * as Message from '../../api/MessageRequests'
import { useAuth } from '../../contexts/AuthContext'
import { FaCopy, FaEllipsisV, FaMotorcycle, FaPaperclip, FaPaperPlane, FaUserMinus, FaUserPlus } from 'react-icons/fa'
import { Avatar, AvatarBadge, AvatarGroup, Box, Card, CardBody, CardFooter, CardHeader, Center, Flex, Heading, IconButton, Input, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Text, Tooltip, useClipboard, useColorModeValue, useMediaQuery } from '@chakra-ui/react'

export default function RoomBox({ icon, room, users, setCurrentRoom, setSendMessage, receivedMessage, ...rest }) {
	const { currentUser, /* follow, unfollow, */ join, leave, toast /* upload */ } = useAuth()
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const location = useLocation()
	const [image, setImage] = useState(null)
	const [messages, setMessages] = useState(room?.messages || [])
	// const [user, setUserData] = useState(null)
	const [newMessage, setNewMessage] = useState('')
	const bg = useColorModeValue('white', 'gray.800')
	const { onCopy, setValue, hasCopied } = useClipboard('')
	const [screenIsSmall] = useMediaQuery('(max-width: 690px)')

	// console.log(chat?.members.find(m => m._id !== currentUser._id))

	// const format = date => {
	// 	date = new Date(Date.now() - new Date(date).getTime())
	// 	if (date.getTime() < 10000) return 'now'
	// 	if (date.getTime() < 60000) return `${date.getMinutes()} s ago`
	// 	if (date.getTime() < 3600000) return `${date.getHours()} min ago`
	// 	if (date.getTime() < 86400000) return `${date.getDate()}h ago`
	// 	return date.getDate() - 1 < 1 ? 'yesterday' : `${date.getDate() - 1}d+ ago`
	// }

	useEffect(() => {
		if (hasCopied) {
			if (toast.isActive('auth')) toast.update('auth', { description: 'Copied to clipboard!' })
			else toast({ id: 'auth', description: 'Copied to clipboard!' })
		}
	}, [hasCopied, toast])

	/* const onImageChange = event => {
		if (event.target.files && event.target.files[0]) {
			let img = event.target.files[0]
			setImage(img)
		}
	} */

	useEffect(() => {
		const fetchMessages = async () => {
			try {
				const { data } = await Message.of(room?._id)
				setMessages(data)
			} catch (err) {
				setCurrentRoom(null)
				toast({ description: 'This chat does not exist anymore', status: 'warning' })
			}
		}

		if (room?._id) fetchMessages()
	}, [room?._id, setCurrentRoom, toast])

	useEffect(() => {
		scroll.current?.scrollIntoView({ behavior: 'smooth' })
	}, [messages])

	const handleSend = async e => {
		e.preventDefault()

		if (newMessage.replace(/\s/g, '') === '') return

		const message = {
			sender: currentUser,
			text: newMessage,
			chat: room
		}

		if (image) {
			const data = new FormData()
			const fileName = Date.now() + image.name
			data.append('name', fileName)
			data.append('file', image)
			newMessage.image = fileName
			console.log(newMessage)

			try {
				dispatch(image(data))
			} catch (err) {
				console.log(err)
			}
		}

		const receiver = room.members.find(member => member._id !== currentUser._id)

		// send message to socket server
		setSendMessage({ ...message, receiver })

		// send message to database
		try {
			const { data } = await Message.create(message)
			setMessages([...messages, data])
			setNewMessage('')
			resetUpload()
		} catch (err) {
			setCurrentRoom(null)
			toast({ description: 'This chat does not exist anymore', status: 'warning' })
			console.log(err.message)
		}
	}

	// TODO Receive Message from parent component
	// useEffect(() => {
	// 	console.log('Message Arrived: ', receivedMessage)
	// 	if (receivedMessage?.id && receivedMessage?.chat?._id === chat?._id) {
	// 		setMessages([...messages, receivedMessage])
	// 	}
	// }, [chat?._id, messages, receivedMessage])

	const scroll = useRef()
	const imageRef = useRef()

	const resetUpload = () => setImage(null)
	const handleChange = msg => setNewMessage(msg)

	// const handleFollow = async user => {
	// 	if (currentUser?.following?.map(other => other._id).includes(user._id)) return
	// 	dispatch(follow(user))
	// }

	// const handleUnfollow = async user => {
	// 	if (!currentUser?.following?.map(other => other._id).includes(user._id)) return
	// 	dispatch(unfollow(user))
	// }

	const handleJoin = async room => {
		if (room?.members?.map(member => member._id).includes(currentUser._id)) return
		dispatch(join(room, navigate))
	}

	const handleLeave = async room => {
		if (!room?.members?.map(member => member._id).includes(currentUser._id)) return
		dispatch(leave(room, navigate, location))
	}

	return (
		<Card w='100%' justify='center' _hover={{ '& button': { opacity: 100 } }} {...rest}>
			{room && room?.members ? (
				<>
					<CardHeader>
						<Flex spacing='4'>
							<Flex flex='1' gap='4' alignItems='center' flexWrap='wrap'>
								{room?.brand
									? <Avatar
										src={'/images/logos/' + (room?.brand?.logo || 'default.png')}
										sx={{ '& img': { objectFit: 'contain' } }}
									/>
									: <Avatar bg={icon?.bg} icon={icon?.icon || <FaMotorcycle />} />
								}

								<Box>
									<Heading size='sm'>{room.name}</Heading>
									{room?.brand && <Text fontSize='xs' color='gray.500'>{room.brand.name}</Text>}
								</Box>
							</Flex>

							<Menu>
								{({ isOpen }) => (<>
									<MenuButton
										as={IconButton}
										variant='outline'
										bg='gray.600'
										shadow='dark-lg'
										aria-label='Options'
										icon={<FaEllipsisV />}
										opacity={0}
										_active={{ opacity: 100 }}
										transform={isOpen ? 'rotate(90deg)' : 'rotate(0deg)'}
									/>

									<MenuList>
										{room?.members?.map(m => m._id).includes(currentUser?._id)
											? <MenuItem icon={<FaUserMinus />} onClick={() => { handleLeave(room) }}>Leave</MenuItem>
											: <MenuItem icon={<FaUserPlus />} onClick={() => { handleJoin(room) }}>Join</MenuItem>
										}

										<MenuDivider />

										<MenuItem icon={<FaCopy />} onClick={() => { setValue(room._id); onCopy() }}>
											Copy ID
										</MenuItem>
									</MenuList>
								</>)}
							</Menu>
						</Flex>
					</CardHeader>

					<CardBody display='flex' flexDir='column' gap={2} p={6} overflowY='auto' bg={bg}>
						<Center fontSize='md' fontWeight='bold' color='gray.500'>
							<Text>This is the very start of the {room.name} room.</Text>
						</Center>

						{/* {messages.map((m, i) => (
							<Tooltip key={m._id} label={format(m.createdAt)}>
								<Box ref={scroll}
									className={
										(m.sender._id === currentUser._id ? 'message self' : 'message other') +
										(m.sender._id === messages[i - 1]?.sender._id && messages[i - 1]?.text?.length >= m.text.length ? ' top' : '') +
										(m.sender._id === messages[i + 1]?.sender._id && messages[i + 1]?.text?.length >= m.text.length ? ' bottom' : '')
									}
								>
									<Text>{m.text}</Text>
								</Box>
							</Tooltip>
						))} */}
					</CardBody>

					<CardFooter sx={{ alignItems: 'center' }}>
						{room.members.map(m => m._id).includes(currentUser._id) ? (<>
							<IconButton icon={<FaPaperclip />} onClick={() => imageRef.current.click()} />
							<Input as={InputEmoji} value={newMessage} onChange={handleChange} onKeyDown={async e => e.key === 'Enter' && handleSend(e) } /* ref={inputRef} */ mixBlendMode='plus-lighter' />
							<IconButton icon={<FaPaperPlane />} colorScheme='pink' onClick={handleSend} />
							{/* <input type='file' name='' id='' style={{ display: 'none' }} ref={imageRef} onChange={handleImage} /> */}
						</>) : <Center p={6} flex='1' flexDirection='column' fontSize='md' fontWeight='bold' color='gray.500'>
								<Text>You must join this room to send messages.</Text>
						</Center>}
					</CardFooter>
				</>
			) : <Center p={6} flex='1' flexDirection='column' fontSize='lg' fontWeight='bold' color='gray.500'>
					{screenIsSmall
						? <Text>Use a larger screen to see your rooms!</Text>
						: <>
							<Text>Click on a room to open it.</Text>
							<Text>You must join a room to send messages.</Text>
						</>}
				</Center>
			}
		</Card>
	)
}