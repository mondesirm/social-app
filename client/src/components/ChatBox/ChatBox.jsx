import React, { useEffect, useRef, useState } from 'react'

//! import { format } from 'timeago.js'
import { useDispatch } from 'react-redux'
import InputEmoji from 'react-input-emoji'

import './ChatBox.css'
// import * as User from '../../api/UserRequests'
import * as Message from '../../api/MessageRequests'
import { useAuth } from '../../contexts/AuthContext'
import { Avatar, AvatarBadge, Box, Card, CardBody, CardFooter, CardHeader, Center, Flex, Heading, IconButton, Input, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Tag, Text, Tooltip, useClipboard, useColorModeValue, useMediaQuery } from '@chakra-ui/react'
import { FaCopy, FaEllipsisV, FaPaperclip, FaPaperPlane, FaUserMinus, FaUserPlus } from 'react-icons/fa'

export default function ChatBox({ chat, user, setCurrentChat, setSendMessage, receivedMessage, ...rest }) {
	const { currentUser, follow, unfollow, toast /* upload */ } = useAuth()
	const dispatch = useDispatch()
	const [image, setImage] = useState(null)
	const [messages, setMessages] = useState(chat?.messages || [])
	// const [user, setUserData] = useState(null)
	const [newMessage, setNewMessage] = useState('')
	const bg = useColorModeValue('white', 'gray.800')
	const { onCopy, setValue, hasCopied } = useClipboard('')
	const [screenIsSmall] = useMediaQuery('(max-width: 690px)')

	// console.log(chat?.members.find(m => m._id !== currentUser._id))

	const format = date => {
		date = new Date(Date.now() - new Date(date).getTime())
		if (date.getTime() < 10000) return 'now'
		if (date.getTime() < 60000) return `${date.getMinutes()} s ago`
		if (date.getTime() < 3600000) return `${date.getHours()} min ago`
		if (date.getTime() < 86400000) return `${date.getDate()}h ago`
		return date.getDate() - 1 < 1 ? 'yesterday' : `${date.getDate() - 1}d+ ago`
	}

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
				const { data } = await Message.of(chat?._id)
				setMessages(data)
			} catch (err) {
				setCurrentChat(null)
				toast({ description: 'This chat does not exist anymore', status: 'warning' })
			}
		}

		if (chat?._id) fetchMessages()
	}, [chat?._id, setCurrentChat, toast])

	useEffect(() => {
		scroll.current?.scrollIntoView({ behavior: 'smooth' })
	}, [messages])

	const handleSend = async e => {
		e.preventDefault()

		if (newMessage.replace(/\s/g, '') === '') return

		const message = {
			sender: currentUser,
			text: newMessage,
			chat: chat
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

		const receiver = chat.members.find(member => member._id !== currentUser._id)

		// send message to socket server
		setSendMessage({ ...message, receiver })

		// send message to database
		try {
			const { data } = await Message.create(message)
			setMessages([...messages, data])
			setNewMessage('')
			resetUpload()
		} catch (err) {
			setCurrentChat(null)
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

	const handleFollow = async user => {
		if (currentUser?.following?.map(other => other._id).includes(user._id)) return
		dispatch(follow(user))
	}

	const handleUnfollow = async user => {
		if (!currentUser?.following?.map(other => other._id).includes(user._id)) return
		dispatch(unfollow(user))
	}

	return (
		<Card w='100%' justify='center' _hover={{ '& button': { opacity: 100 } }} {...rest}>
			{chat && chat?.members ? (
				<>
					<CardHeader>
						<Flex spacing='4'>
							<Flex flex='1' gap='4' alignItems='center' flexWrap='wrap'>
								<Avatar src={'/images/avatars/' + (user?.avatar || 'default.png')} size='sm'>
									<Tooltip label={user?.isOnline ? 'Online' : 'Last seen ' + format(user?.lastSeen)} placement='top'>
										<AvatarBadge boxSize='1em' bg={user?.isOnline ? 'green.500' : 'gray.500'} />
									</Tooltip>
								</Avatar>

								<Box>
									<Heading size='sm'>{user.firstName} {user.lastName}</Heading>
									<Text fontSize='xs' color='gray.500'>(@{user.username})</Text>
								</Box>

								{user.following.includes(currentUser._id) && <Tag>{user.followers.includes(currentUser._id) ? 'Mutual' : 'Follower'}</Tag>}
								{user.followers.includes(currentUser._id) && !user.following.includes(currentUser._id) && <Tag>Following</Tag>}
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
										{currentUser?.following?.map(other => other._id).includes(user._id)
											? <MenuItem icon={<FaUserMinus />} onClick={() => { handleUnfollow(user) }}>Unfollow</MenuItem>
											: <MenuItem icon={<FaUserPlus />} onClick={() => { handleFollow(user) }}>Follow</MenuItem>
										}

										<MenuDivider />

										<MenuItem icon={<FaCopy />} onClick={() => { setValue(user._id); onCopy() }}>
											Copy ID
										</MenuItem>
									</MenuList>
								</>)}
							</Menu>
						</Flex>
					</CardHeader>

					<CardBody display='flex' flexDir='column' gap={2} p={6} overflowY='auto' bg={bg}>
						<Center fontSize='md' fontWeight='bold' color='gray.500'>
							<Text>This is the beginning of your conversation with {user.username}.</Text>
						</Center>

						{messages.map((m, i) => (
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
						))}
					</CardBody>

					<CardFooter sx={{ alignItems: 'center' }}>
						{user.followers.includes(currentUser._id) && user.following.includes(currentUser._id) ? (<>
							<IconButton icon={<FaPaperclip />} onClick={() => imageRef.current.click()} />
							<Input as={InputEmoji} value={newMessage} onChange={handleChange} onKeyDown={async e => e.key === 'Enter' && handleSend(e) } /* ref={inputRef} */ mixBlendMode='plus-lighter' />
							<IconButton icon={<FaPaperPlane />} colorScheme='pink' onClick={handleSend} />
							{/* <input type='file' name='' id='' style={{ display: 'none' }} ref={imageRef} onChange={handleImage} /> */}
						</>) : <Center p={6} flex='1' flexDirection='column' fontSize='md' fontWeight='bold' color='gray.500'>
								<Text>You must be following each other to send messages.</Text>
						</Center>}
					</CardFooter>
				</>
			) : <Center p={6} flex='1' flexDirection='column' fontSize='lg' fontWeight='bold' color='gray.500'>
					{screenIsSmall
						? <Text>Use a larger screen to see your chats!</Text>
						: <>
							<Text>Click on a chat or start one with your mutuals!</Text>
							<Text>You must be following each other to start a chat.</Text>
						</>}
				</Center>
			}
		</Card>
	)
}