import { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'
import { useDispatch } from 'react-redux'
import { FaCommentAlt, FaCopy, FaEllipsisV, FaEnvelope, FaEnvelopeOpen, FaTimes, FaUserMinus, FaUserPlus } from 'react-icons/fa'
import { Avatar, AvatarBadge, Box, Button, Card, CardBody, CardHeader, Center, Collapse, Flex, Heading, HStack, IconButton, List, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Skeleton, Slide, Tab, TabList, TabPanel, TabPanels, Tabs, Tag, Text, Tooltip, useClipboard, useColorModeValue, useDisclosure, useMediaQuery, VStack } from '@chakra-ui/react'

import './Chat.css'
import { Layout } from '../components/Layout'
import * as ChatAPI from '../api/ChatRequests'
import * as UserAPI from '../api/UserRequests'
import Separator from '../components/Separator'
import { useAuth } from '../contexts/AuthContext'
import ChatBox from '../components/ChatBox/ChatBox'
// import Conversation from '../components/Conversation/Conversation'
import { useDatabase } from '../contexts/DatabaseContext'
// import ProfileSide from '../../components/ProfileSide/ProfileSide'

export default function Chat() {
	const { currentUser, onlineUsers, follow, unfollow, toast } = useAuth()
	const { /* of, */ create } = useDatabase()
	const socket = useRef(io('ws://localhost:9000'))
	const dispatch = useDispatch()
	const [sent, setSent] = useState([])
	const [chats, setChats] = useState([])
	const [mutuals, setMutuals] = useState([])
	const [received, setReceived] = useState([])
	const [recommended, setRecommended] = useState([])
	const [currentChat, setCurrentChat] = useState(null)
	const [sendMessage, setSendMessage] = useState(null)
	const { onCopy, setValue, hasCopied } = useClipboard('')
	const [screenIsSmall] = useMediaQuery('(max-width: 690px)')
	const [receivedMessage, setReceivedMessage] = useState(null)
	const onlineSelf = onlineUsers.find(u => u._id === currentUser._id)

	const format = date => {
		date = new Date(Date.now() - new Date(date).getTime())
		if (date.getTime() < 10000) return 'now'
		if (date.getTime() < 60000) return `${date.getMinutes()}s ago`
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

	useEffect(() => {
		// Get current user's chats
		const fetchChats = async () => {
			// dispatch(of('Chat', currentUser._id))
			const { data } = await ChatAPI.of(currentUser._id)
			setChats(data)
		}

		// Get list of other users
		const fetchUsers = async () => {
			const { data } = await UserAPI.all()
			const current = data.find(u => u._id === currentUser._id)

			const mutuals = data.filter(u => current.following.includes(u._id) && current.followers.includes(u._id))
			const sentOnly = data.filter(u => current.following.includes(u._id) && !current.followers.includes(u._id))
			const receivedOnly = data.filter(u => current.followers.includes(u._id) && !current.following.includes(u._id))
			const neitherOfThem = data.filter(u => !current.following.includes(u._id) && !current.followers.includes(u._id) && current._id !== u._id)
			// const mutualsWithoutChats = mutuals.filter(u => !chats.find(c => c.members.find(m => m._id === u._id)))

			setSent(sentOnly)
			setReceived(receivedOnly)
			setRecommended(neitherOfThem)
			setMutuals(mutuals)
		}

		fetchChats()
		fetchUsers()

		// if (onlineSelf?.shouldUpdate) io.emit('updated', currentUser?._id)
	}, [currentUser, currentChat?._id, onlineSelf])

	// Send message to socket server
	useEffect(() => {
		if (sendMessage !== null) socket.current.emit('send-message', sendMessage)
	}, [sendMessage])

	// Get the message from socket server
	useEffect(() => {
		socket.current.on('receive-message', data => {
			console.log(data)
			setReceivedMessage(data)
		})
	}, [])

	const checkOnlineStatus = chat => {
		const member = chat.members.find(m => m._id !== currentUser._id)
		const online = onlineUsers.find(u => u._id === member._id)
		return online ? true : false
	}

	const handleFollow = async user => {
		if (currentUser?.following?.map(other => other._id).includes(user._id)) return
		dispatch(follow(user))
	}

	const handleUnfollow = async user => {
		if (!currentUser?.following?.map(other => other._id).includes(user._id)) return
		dispatch(unfollow(user))
	}

	const handleMessage = async user => {
		if (!user.following.includes(currentUser._id) && !user.followers.includes(currentUser._id)) return
		dispatch(create('Chat', { self: currentUser._id, other: user._id }))
		setCurrentChat(null)
	}

	const handleToast = () => toast({ description: 'You must be mutuals with this user to message them.', status: 'info' })

	const UserItem = ({ user, noChat, online, onClick, ...rest }) => (
		<Card variant='outline' maxW='md' _hover={{ background: useColorModeValue('gray.100', 'gray.500'), '& button': { opacity: 100 } }} cursor='pointer' {...rest}>
			<CardHeader>
				<Flex spacing='4'>
					<Flex flex='1' gap='4' alignItems='center' flexWrap='wrap' onClick={noChat ? () => handleMessage(user) : onClick}>
						<Avatar src={'/images/avatars/' + (user?.avatar || 'default.png')} size='sm'>
							<Tooltip label={/* user.isOnline || */ online ? 'Online' : 'Last seen ' + format(user.lastSeen)} placement='top'>
								<AvatarBadge boxSize='1em' bg={/* user.isOnline || */ online ? 'green.500' : 'gray.500'} />
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
								<MenuItem icon={<FaCommentAlt />} onClick={noChat ? () => handleMessage(user) : onClick}>Message</MenuItem>

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
		</Card>
	)

	const MessageRequests = ({ received, sent }) => {
		const { isOpen, onToggle } = useDisclosure()

		return (
			<Flex spacing='4' maxW='md'>
				<Button leftIcon={isOpen ? <FaEnvelopeOpen /> : <FaEnvelope />} variant='solid' onClick={onToggle} gap={4}>
					<Text>Message Requests</Text>
					<Tag variant='solid' colorScheme={received.length > 0 && 'red'}>{received.length}</Tag>
					<Tag variant='solid' colorScheme={false}>{sent.length}</Tag>
				</Button>

				<Slide direction='bottom' in={isOpen} style={{ zIndex: 10 }}>
					<Card maxW='md' _hover={{ shadow: 'dark-lg' }}>
						<CardHeader>
							<Flex justify='space-between' align='center'>
								<Button leftIcon={<FaTimes />} variant='solid' onClick={onToggle}>Close</Button>
								<Heading size='sm'>Message Requests</Heading>
							</Flex>
						</CardHeader>

						<CardBody>
							<Tabs isFitted isLazy variant='soft-rounded' colorScheme='green'>
								<TabList overflowX='auto'>
									<Tab gap={4}>
										<Text>Received</Text>
										<Tag variant='solid' colorScheme={received.length > 0 && 'red'}>{received.length}</Tag>
									</Tab>

									<Tab gap={4}>
										<Text>Sent</Text>
										<Tag variant='solid' colorScheme={false}>{sent.length}</Tag>
									</Tab>
								</TabList>

								<TabPanels>
									{[received, sent].map((requests, i) => (
										<TabPanel key={i}>
											<List>
												{requests.map(user => (
													<Skeleton key={user._id} isLoaded={requests?.length > 0}>
														<UserItem user={user} />
													</Skeleton>
												))}

												{requests.length < 1 && (
													<Center>
														<Text fontSize='xl' fontStyle='italic' color='gray.500'>
															There are no pending message requests.
														</Text>
													</Center>
												)}
											</List>
										</TabPanel>
									))}
								</TabPanels>
							</Tabs>
						</CardBody>
					</Card>
				</Slide>
			</Flex>
		)
	}

	return (
		<Layout noFooter>
			<HStack spacing={4} align='stretch' h='calc(100vh - 6.125rem)'>
				<VStack hidden={screenIsSmall} spacing={4} align='stretch' shadow='dark-lg' p={4} rounded='md' bg='gray.700'>
					<MessageRequests received={received} sent={sent} />

					<List spacing={3}>
						{/* <div key={chat._id} onClick={() => setCurrentChat(chat)}>
							<Conversation chat={chat} online={checkOnlineStatus(chat)} />
						</div> */}

						{chats.map(c =>
							<UserItem
								key={c._id}
								user={c.members.find(m => m._id !== currentUser?._id)}
								onClick={() => setCurrentChat(c)}
								online={checkOnlineStatus(c)}
								bg={currentChat?._id === c._id && 'gray.600'}
							/>
						)}

						{chats.length === 0 && (
							<Center>
								<Text fontSize='xl' fontWeight='bold' color='gray.500'>
									No chats yet
								</Text>
							</Center>
						)}

						<Skeleton isLoaded={mutuals?.length > 0} hidden={mutuals?.length < 1}>
							<Separator my={6}>Start a conversation</Separator>
							{mutuals.map(user => <UserItem key={user._id} user={user} noChat />)}
						</Skeleton>

						<Skeleton isLoaded={recommended?.length > 0} hidden={recommended?.length < 1}>
							<Separator my={6}>Find new friends</Separator>
							{recommended.map(user => <UserItem key={user._id} user={user} onClick={() => handleToast()} />)}
						</Skeleton>
					</List>
				</VStack>

				<ChatBox chat={currentChat} setCurrentChat={setCurrentChat} setSendMessage={setSendMessage} receivedMessage={receivedMessage} user={currentChat?.members?.find(member => member._id !== currentUser._id)} />
				{/* <VStack spacing={4} justify='center' align='stretch' shadow='dark-lg' p={4} rounded='md' bg='gray.700'>
				</VStack> */}
			</HStack>
		</Layout>
	)
}