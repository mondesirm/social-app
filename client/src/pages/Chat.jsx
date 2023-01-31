import { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'
import { useDispatch } from 'react-redux'
import { SearchIcon } from '@chakra-ui/icons'
import { useNavigate, useParams } from 'react-router-dom'
import { FaCommentAlt, FaCopy, FaEllipsisV, FaEnvelope, FaEnvelopeOpen, FaGlobe, FaPlus, FaRobot, FaTimes, FaUserMinus, FaUserPlus } from 'react-icons/fa'
import { Avatar, AvatarBadge, Box, Button, Card, CardBody, CardHeader, Center, Flex, Heading, HStack, IconButton, Input, InputGroup, InputLeftElement, List, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Popover, PopoverBody, PopoverContent, PopoverHeader, PopoverTrigger, Skeleton, Slide, Tab, TabList, TabPanel, TabPanels, Tabs, Tag, Text, Tooltip, useClipboard, useColorModeValue, useDisclosure, useMediaQuery, VStack } from '@chakra-ui/react'

import './Chat.css'
import { Layout } from '../components/Layout'
import * as ChatAPI from '../api/ChatRequests'
import * as UserAPI from '../api/UserRequests'
import Separator from '../components/Separator'
import { useAuth } from '../contexts/AuthContext'
import ChatBox from '../components/ChatBox/ChatBox'
import { useDatabase } from '../contexts/DatabaseContext'
// import ProfileSide from '../../components/ProfileSide/ProfileSide'

export default function Chat() {
	const { currentUser, onlineUsers, follow, unfollow, toast } = useAuth()
	const { bot, botChat, create } = useDatabase()
	const { id } = useParams()
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const [sent, setSent] = useState([])
	const [chats, setChats] = useState([])
	const [mutuals, setMutuals] = useState([])
	const [received, setReceived] = useState([])
	const [currentChat, setCurrentChat] = useState(null)
	const [sendMessage, setSendMessage] = useState(null)
	const { onCopy, setValue, hasCopied } = useClipboard('')
	const [screenIsSmall] = useMediaQuery('(max-width: 690px)')
	const [receivedMessage, setReceivedMessage] = useState(null)
	const socket = useRef(io(process.env.REACT_APP_SOCKET_HOST))
	const onlineSelf = onlineUsers.find(u => u._id === currentUser._id)
	const [actions, setActions] = useState([{ label: 'Start Chat', step: 'start' }])
	
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

			if (id) setCurrentChat(id === 'bot' ? botChat : data.find(c => c._id === id))
			else setCurrentChat(null)
		}

		// Get list of other users
		const fetchUsers = async () => {
			const { data } = await UserAPI.all()
			const current = data.find(u => u._id === currentUser._id)

			const mutuals = data.filter(u => current.following.includes(u._id) && current.followers.includes(u._id))
			const sentOnly = data.filter(u => current.following.includes(u._id) && !current.followers.includes(u._id))
			const receivedOnly = data.filter(u => current.followers.includes(u._id) && !current.following.includes(u._id))
			// const mutualsWithoutChats = mutuals.filter(u => !chats.find(c => c.members.find(m => m._id === u._id)))

			setSent(sentOnly)
			setReceived(receivedOnly)
			setMutuals(mutuals)
		}

		fetchChats()
		fetchUsers()

		// if (onlineSelf?.shouldUpdate) io.emit('updated', currentUser?._id)
	}, [currentUser, currentChat?._id, onlineSelf, id, bot, botChat])

	// Send message to socket server
	useEffect(() => {
		if (sendMessage !== null) {
			socket.current.emit(id === 'bot' ? 'send-to-bot' : 'send-message', sendMessage)
		}
	}, [id, sendMessage])

	// Get messages from socket server
	useEffect(() => {
		socket.current.on('receive-message', data => {
			console.log(data)
			setReceivedMessage(data)
		})
	}, [])

	// Get bot responses from socket server
	useEffect(() => {
		socket.current.on('receive-from-bot', ({ actions, message }) => {
			console.log(message)
			setActions(actions)
			setReceivedMessage(message)
		})
	}, [])

	const format = date => {
		date = new Date(Date.now() - new Date(date).getTime())
		if (date.getTime() < 10000) return 'now'
		if (date.getTime() < 60000) return `${date.getMinutes()}s ago`
		if (date.getTime() < 3600000) return `${date.getHours()} min ago`
		if (date.getTime() < 86400000) return `${date.getDate()}h ago`
		return date.getDate() - 1 < 1 ? 'yesterday' : `${date.getDate() - 1}d+ ago`
	}

	const handleFollow = async user => {
		if (currentUser?.following?.map(f => f._id).includes(user._id)) return
		dispatch(follow(user))
	}

	const handleUnfollow = async user => {
		if (!currentUser?.following?.map(f => f._id).includes(user._id)) return
		dispatch(unfollow(user))
	}

	const handleMessage = async user => {
		if (!user.following.includes(currentUser._id) && !user.followers.includes(currentUser._id)) return
		dispatch(create('Chat', { self: currentUser._id, other: user._id }))
		setCurrentChat(null)
	}

	const BotItem = ({ onClick, ...rest }) => (
		<Card variant='outline' maxW='md' _hover={{ background: useColorModeValue('gray.100', 'gray.500'), '& button': { opacity: 100 } }} cursor='pointer' {...rest}>
			<CardHeader>
				<Flex spacing='4'>
					<Flex flex='1' gap='4' alignItems='center' flexWrap='wrap' onClick={onClick}>
						<Avatar bg='blue.500' icon={<FaRobot />} size='sm' />

						<Box>
							<Heading size='sm'>{bot.firstName} {bot.lastName}</Heading>
							<Text fontSize='xs' color='gray.500'>(@{bot.username})</Text>
						</Box>

						<Tag bg='blue.500'>Bot</Tag>
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
								<MenuItem icon={<FaCommentAlt />} onClick={() => navigate('/chat/bot')}>Start Chat</MenuItem>
							</MenuList>
						</>)}
					</Menu>
				</Flex>
			</CardHeader>
		</Card>
	)

	const UserItem = ({ user, noChat, onClick, ...rest }) => (
		<Card variant='outline' maxW='md' _hover={{ background: useColorModeValue('gray.100', 'gray.500'), '& button': { opacity: 100 } }} cursor='pointer' {...rest}>
			<CardHeader>
				<Flex spacing='4'>
					<Flex flex='1' gap='4' alignItems='center' flexWrap='wrap' onClick={noChat ? () => handleMessage(user) : onClick}>
						<Avatar src={'/images/avatars/' + (user?.avatar || 'default.png')} size='sm'>
							<Tooltip label={onlineUsers.find(u => u._id === user._id) ? 'Online' : 'Last seen ' + format(user.lastSeen)} placement='top'>
								<AvatarBadge boxSize='1em' bg={onlineUsers.find(u => u._id === user._id) ? 'green.500' : 'gray.500'} />
							</Tooltip>
						</Avatar>

						<Box>
							<Heading size='sm'>{user.firstName} {user.lastName}</Heading>
							<Text fontSize='xs' color='gray.500'>(@{user.username})</Text>
						</Box>

						{user.following.includes(currentUser._id) && <Tag>{user.followers.includes(currentUser._id) ? 'Mutual' : 'Follower'}</Tag>}
						{user.followers.includes(currentUser._id) && !user.following.includes(currentUser._id) && <Tag>Following</Tag>}

						{user?.roles.includes('staff') && <Tag>Staff</Tag>}
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
								<MenuItem icon={<FaCommentAlt />} onClick={noChat ? () => handleMessage(user) : onClick}>{noChat ? 'Create Chat' : 'Message'}</MenuItem>

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

	const PendingRequests = ({ received, sent }) => {
		const { isOpen, onToggle } = useDisclosure()

		return (
			<Flex spacing='4' maxW='md'>
				<Button leftIcon={isOpen ? <FaEnvelopeOpen /> : <FaEnvelope />} variant='solid' onClick={onToggle} gap={4}>
					<Text>Pending Requests</Text>
					<Tag variant='solid' colorScheme={received.length > 0 && 'red'}>{received.length}</Tag>
					<Tag variant='solid' colorScheme={false}>{sent.length}</Tag>
				</Button>

				<Slide direction='bottom' in={isOpen} style={{ zIndex: 10 }}>
					<Card maxW='md' _hover={{ shadow: 'dark-lg' }}>
						<CardHeader>
							<Flex justify='space-between' align='center'>
								<Button leftIcon={<FaTimes />} variant='solid' onClick={onToggle}>Close</Button>
								<Heading size='sm'>Pending Requests</Heading>
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
															There are no pending requests.
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

	const CreateChatPopover = () => {
		const initRef = useRef()
		const [search, setSearch] = useState('')

		return (
			<Popover placement='right' initialFocusRef={initRef}>
				{({ isOpen, onClose }) => (<>
					<PopoverTrigger>
						<IconButton icon={<FaPlus />} variant='solid' />
					</PopoverTrigger>

					{/* <Portal> */}
					<PopoverContent>
						<PopoverHeader>
							<Heading size='md' mb={4}>Select Mutual</Heading>

							<InputGroup>
								<InputLeftElement pointerEvents='none' children={<SearchIcon color='gray.300' />} />
								<Input type='text' placeholder='Type the username of a mutual' autoFocus value={search} onChange={e => setSearch(e.target.value)} />
							</InputGroup>
						</PopoverHeader>

						<PopoverBody>
							<Skeleton isLoaded={mutuals?.length > 0} hidden={mutuals?.length < 1}>
								{mutuals.map(user =>
									(!search ||
										user.username.toLowerCase().includes(search.toLowerCase()) ||
										(user.firstName + ' ' + user.lastName).toLowerCase().includes(search.toLowerCase())
									) && <UserItem key={user._id} user={user} noChat />
								)}

								{(mutuals.length < 1 || mutuals.filter(user =>
									user.username.toLowerCase().includes(search.toLowerCase()) ||
									(user.firstName + ' ' + user.lastName).toLowerCase().includes(search.toLowerCase())
								).length < 1) && (
									<Center>
										<Text fontSize='xl' fontWeight='bold' color='gray.500'>No mutuals found.</Text>
									</Center>
								)}
							</Skeleton>
						</PopoverBody>
					</PopoverContent>
					{/* </Portal> */}
				</>)}
			</Popover>
		)
	}

	return (
		<Layout noFooter>
			<HStack spacing={4} align='stretch' h='calc(100vh - 6.125rem)'>
				<VStack hidden={screenIsSmall} spacing={4} align='stretch' shadow='dark-lg' p={4} rounded='md' bg='gray.700'>
					<PendingRequests received={received} sent={sent} />

					<List spacing={3} display='grid' alignItems='stretch'>
						<Separator mb={3} action={<CreateChatPopover />}>Chats</Separator>

						<BotItem bg={currentChat?._id === 'bot' && 'gray.600'} onClick={() => { setCurrentChat(botChat); navigate('/chat/bot') }} />

						{chats.map(c =>
							<UserItem
								key={c._id}
								user={c.members.find(m => m._id !== currentUser?._id)}
								onClick={() => { setCurrentChat(c); navigate(`/chat/${c._id}`) }}
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

						{/* Find other rooms */}
						<Button leftIcon={<FaGlobe />} colorScheme='blue' variant='solid' onClick={() => navigate('/explore')}>
							Connect with people
						</Button>
					</List>
				</VStack>

				<ChatBox chat={currentChat} setCurrentChat={setCurrentChat} setSendMessage={setSendMessage} receivedMessage={receivedMessage} user={currentChat?.members?.find(m => m._id !== currentUser._id)} actions={actions} />
				{/* <VStack spacing={4} justify='center' align='stretch' shadow='dark-lg' p={4} rounded='md' bg='gray.700'>
				</VStack> */}
			</HStack>
		</Layout>
	)
}