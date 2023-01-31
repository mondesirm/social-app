import { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'
import { useDispatch } from 'react-redux'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { FaCommentAlt, FaCopy, FaEllipsisV, FaHome, FaMotorcycle, FaPlus, FaQuestion, FaRecycle, FaSearch, FaTimes, FaUserMinus, FaUserPlus, FaUsers } from 'react-icons/fa'
import { Avatar, AvatarBadge, Box, Button, Card, CardBody, CardHeader, Center, Flex, Heading, HStack, IconButton, List, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Skeleton, Slide, Tab, TabList, TabPanel, TabPanels, Tabs, Tag, Text, Tooltip, useClipboard, useColorModeValue, useDisclosure, useMediaQuery, VStack } from '@chakra-ui/react'

import './Chat.css'
import { Layout } from '../components/Layout'
import * as RoomAPI from '../api/RoomRequests'
import Separator from '../components/Separator'
import { useAuth } from '../contexts/AuthContext'
import RoomBox from '../components/RoomBox/RoomBox'

export default function Room() {
	const { currentUser, onlineUsers, follow, unfollow, join, leave, toast } = useAuth()
	const { id } = useParams()
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const location = useLocation()
	const [rooms, setRooms] = useState([])
	// const [members, setMembers] = useState([])
	const socket = useRef(io(process.env.REACT_APP_SOCKET_HOST))
	const [currentRoom, setCurrentRoom] = useState(null)
	const [sendMessage, setSendMessage] = useState(null)
	const { onCopy, setValue, hasCopied } = useClipboard('')
	const [screenIsSmall] = useMediaQuery('(max-width: 690px)')
	const [receivedMessage, setReceivedMessage] = useState(null)
	const onlineSelf = onlineUsers.find(u => u._id === currentUser._id)

	const icons = {
		Main: { bg: 'pink.500', icon: <FaHome /> },
		Help: { bg: 'blue.500', icon: <FaQuestion /> },
		Misc: { bg: 'green.500', icon: <FaRecycle /> }
	}

	useEffect(() => {
		if (hasCopied) {
			if (toast.isActive('auth')) toast.update('auth', { description: 'Copied to clipboard!' })
			else toast({ id: 'auth', description: 'Copied to clipboard!' })
		}
	}, [hasCopied, toast])

	useEffect(() => {
		// Get current user's rooms
		const fetchRooms = async () => {
			// get params from url
			const { data } = await RoomAPI.of(currentUser._id)
			setRooms(data)

			if (id) setCurrentRoom(data.find(r => r._id === id))
			else setCurrentRoom(null)
		}

		// Get current room's members
		// const fetchMembers = async () => {
		// 	if (!currentRoom) return
		// 	const { data } = await RoomAPI.members(currentRoom._id)

		fetchRooms()

		// if (onlineSelf?.shouldUpdate) io.emit('updated', currentUser?._id)
	}, [currentUser, currentRoom?._id, onlineSelf, id])

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

	const handleJoin = async room => {
		if (room?.members?.map(m => m._id).includes(currentUser._id)) return
		dispatch(join(room, navigate))
	}

	const handleLeave = async room => {
		if (!room?.members?.map(m => m._id).includes(currentUser._id)) return
		dispatch(leave(room, navigate, location))
	}

	const handleMessage = ({ _id }) => navigate(`/chat/${_id}`)

	// const handleToast = () => toast({ description: 'You must be mutuals with this user to message them.', status: 'info' })

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

						{user._id !== currentUser._id && (<>
							{user.following.includes(currentUser._id) && <Tag>{user.followers.includes(currentUser._id) ? 'Mutual' : 'Follower'}</Tag>}
							{user.followers.includes(currentUser._id) && !user.following.includes(currentUser._id) && <Tag>Following</Tag>}
						</>)}

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
								{user._id !== currentUser._id && (<>
									<MenuItem icon={<FaCommentAlt />} onClick={noChat ? () => handleMessage(user) : onClick}>Message</MenuItem>

									{currentUser?.following?.map(other => other._id).includes(user._id)
										? <MenuItem icon={<FaUserMinus />} onClick={() => { handleUnfollow(user) }}>Unfollow</MenuItem>
										: <MenuItem icon={<FaUserPlus />} onClick={() => { handleFollow(user) }}>Follow</MenuItem>
									}

									<MenuDivider />
								</>)}

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

	const RoomItem = ({ icon, room, onClick, ...rest }) => (
		<Card variant='outline' maxW='md' _hover={{ background: useColorModeValue('gray.100', 'gray.500'), '& button': { opacity: 100 } }} cursor='pointer' {...rest}>
			<CardHeader>
				<Flex spacing='4'>
					<Flex flex='1' gap='4' alignItems='center' flexWrap='wrap' onClick={onClick}>
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
								<MenuItem icon={<FaCommentAlt />} onClick={onClick}>Enter</MenuItem>

								
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
		</Card>
	)

	const MembersList = ({ online, offline, disabled }) => {
		const { isOpen, onToggle } = useDisclosure()

		return (
			<Flex spacing='4' maxW='md'>
				<Button leftIcon={<FaUsers />} variant='solid' onClick={onToggle} gap={4}>
					<Text>Members</Text>
					<Tag variant='solid' colorScheme={online.length > 0 && 'green'}>{online.length}</Tag>
					<Tag variant='solid' colorScheme={false}>{offline.length}</Tag>
				</Button>

				<Slide direction='bottom' in={isOpen} style={{ zIndex: 10 }}>
					<Card maxW='md' _hover={{ shadow: 'dark-lg' }}>
						<CardHeader>
							<Flex justify='space-between' align='center'>
								<Button leftIcon={<FaTimes />} variant='solid' onClick={onToggle}>Close</Button>
								<Heading size='sm'>Members</Heading>
							</Flex>
						</CardHeader>

						<CardBody>
							<Tabs isFitted isLazy variant='soft-rounded' colorScheme='green'>
								<TabList overflowX='auto'>
									<Tab gap={4}>
										<Text>Online</Text>
										<Tag variant='solid' colorScheme={online.length > 0 && 'green'}>{online.length}</Tag>
									</Tab>

									<Tab gap={4}>
										<Text>Offline</Text>
										<Tag variant='solid' colorScheme={false}>{offline.length}</Tag>
									</Tab>
								</TabList>

								<TabPanels>
									{[online, offline].map((users, i) => (
										<TabPanel key={i}>
											<List>
												{users.map(user => (
													<Skeleton key={user._id} isLoaded={users?.length > 0}>
														<UserItem user={user} />
													</Skeleton>
												))}

												{users.length < 1 && (
													<Center>
														<Text fontSize='xl' fontStyle='italic' color='gray.500'>
															Nothing to see here...
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
					<MembersList online={currentRoom?.members.filter(m => onlineUsers.map(u => u._id).includes(m._id)) || []} offline={currentRoom?.members.filter(m => !onlineUsers.map(u => u._id).includes(m._id)) || []} />

					<List spacing={3} display='grid' alignItems='stretch'>
						<Separator mb={3} action={<FaPlus />} staff>Rooms</Separator>

						{rooms.map(r =>
							<RoomItem
								key={r._id}
								icon={icons[r.name] || null}
								room={r}
								onClick={() => { setCurrentRoom(r); navigate(`/room/${r._id}`) }}
								bg={currentRoom?._id === r._id && 'gray.600'}
							/>
						)}

						{rooms.length === 0 && (
							<Center>
								<Text fontSize='xl' fontWeight='bold' color='gray.500'>
									No rooms yet
								</Text>
							</Center>
						)}

						{/* Find other rooms */}
						<Button leftIcon={<FaSearch />} colorScheme='blue' variant='solid' onClick={() => navigate('/explore')}>
							Find other rooms
						</Button>
					</List>
				</VStack>

				<RoomBox icon={icons[currentRoom?.name] || null} room={currentRoom} setCurrentRoom={setCurrentRoom} setSendMessage={setSendMessage} receivedMessage={receivedMessage} users={currentRoom?.members?.filter(m => m._id !== currentUser?._id)} />
				{/* <VStack spacing={4} justify='center' align='stretch' shadow='dark-lg' p={4} rounded='md' bg='gray.700'>
				</VStack> */}
			</HStack>
		</Layout>
	)
}