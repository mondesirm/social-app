import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { CopyIcon, SearchIcon } from '@chakra-ui/icons'
import { useLocation, useNavigate } from 'react-router-dom'
import { FaShare, FaEllipsisV, FaHome, FaMotorcycle, FaQuestion, FaRecycle } from 'react-icons/fa'
import { Button, Card, CardBody, CardFooter, Flex, Heading, Image, Text, Skeleton, InputGroup, InputLeftElement, Input, CardHeader, Avatar, IconButton, ButtonGroup, MenuButton, MenuDivider, Menu, MenuList, MenuItem, Tag, GridItem, Wrap, Collapse, useMediaQuery, useClipboard, Tabs, TabList, Tab, TabPanels, Grid } from '@chakra-ui/react'

import * as RoomAPI from '../api/RoomRequests'
import { Layout } from '../components/Layout'
import { useAuth } from '../contexts/AuthContext'
// import { useDatabase } from '../contexts/DatabaseContext'

export default function Explore() {
	const { currentUser, join, leave, toast } = useAuth()
	// const { db: { Room: rooms }, all } = useDatabase()
	const dispatch = useDispatch()
	const location = useLocation()
	const navigate = useNavigate()
	const [rooms, setRooms] = useState([])
	const [selectedTab, setSelectedTab] = useState(-1)
	const { onCopy, setValue, hasCopied } = useClipboard('') // used to copy room id
	const [screenIsSmall] = useMediaQuery('(min-width: 22em)') // used to collapse the top card

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
		const fetchRooms = async () => {
			// dispatch(all('Room'))
			const { data } = await RoomAPI.all()
			setRooms(data)
		}
		fetchRooms()
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentUser])

	/* useEffect(() => {
		const fetchRooms = async () => {
			const { data } = await Room.all()
			setRooms(data)
		}
		fetchRooms()
	}, [currentUser]) */

	const RoomCard = ({ room, icon, ...rest }) => (
		<Card maxW='md' _hover={{ shadow: 'dark-lg', '& button': { opacity: 100 } }} {...rest}>
			<Image
				objectFit='cover'
				src={'/images/banners/' + (room?.brand?.banner || 'default.png')}
				alt={'Room ' + room.name}
				borderTopRadius='lg'
				mb={-6}
				h={8}
			/>

			<Flex justify='space-between' align='center' marginInline={4}>
				{room?.brand
					? <Avatar
						src={'/images/logos/' + (room?.brand?.logo || 'default.png')}
						sx={{ '& img': { objectFit: 'contain' } }}
					/>
					: <Avatar bg={icon?.bg} icon={icon?.icon || <FaMotorcycle />} />
				}

				<Tag bg={room.isPrivate ? 'pink' : 'teal'}>{room.isPrivate ? 'Private' : 'Public'}</Tag>

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
							{navigator.share && (<>
								<MenuItem icon={<FaShare />} onClick={() => { handleShare(room) }}>
									Share Room
								</MenuItem>

								<MenuDivider />
							</>)}

							<MenuItem icon={<CopyIcon />} onClick={() => { setValue(room._id); onCopy() }}>
								Copy ID
							</MenuItem>
						</MenuList>
					</>)}
				</Menu>
						
			</Flex>

			<CardBody>
				<Heading size='sm'>{room.name}</Heading>

				{room?.description
					? <Text noOfLines={3} color='gray.400'>{room.description}</Text>
					: <Text fontStyle='italic' color='gray.500'>No description provided.</Text>
				}
			</CardBody>

			<Wrap marginInline={4}>
				<Tag bg='green'>{room.members.filter(member => member.isOnline).length} Online</Tag>
				<Tag bg='gray'>{room.members.length} / {room.limits > 0 ? room.limits : '∞'} Members</Tag>
			</Wrap>

			<CardFooter>
				<ButtonGroup spacing='2' w='100%'>
					{/* members is an array of users */}
					{room?.members?.map(member => member._id).includes(currentUser._id) ? (<>
						<Button w='100%' variant='solid' colorScheme='red' onClick={() => handleLeave(room)}>Leave</Button>
						<Button w='100%' variant='solid' colorScheme='blue' onClick={() => handleEnter(room)}>Enter</Button>
					</>) : (
						<Button w='100%' variant='solid' colorScheme='green' onClick={() => handleJoin(room)}>Join</Button>
					)}
				</ButtonGroup>
			</CardFooter>
		</Card>
	)

	const handleJoin = async room => {
		if (room?.members?.map(member => member._id).includes(currentUser._id)) return
		dispatch(join(room, navigate))
	}

	const handleLeave = async room => {
		if (!room?.members?.map(member => member._id).includes(currentUser._id)) return
		dispatch(leave(room, navigate, location))
	}

	const handleEnter = async room => {
		if (!room?.members?.map(member => member._id).includes(currentUser._id)) return
		navigate(`/room/${room._id}`, { replace: true })
	}

	const handleShare = room => {
		if (navigator.share) {
			navigator.share({ title: room.name, text: room.description, url: '/room/' + room._id })
				.then(() => toast({ title: 'Room shared.' }))
				.catch(err => console.err('Error sharing', err))
		}
	}

	return (
		<Layout>
			<Skeleton isLoaded={rooms?.length > 0}>
				<Card align='center' mb={4} bg='url(/images/helmet.png)' bgSize='cover' bgPosition='center'>
					<Collapse in={screenIsSmall} animateOpacity>
						<CardHeader>
							<Heading>Explore</Heading>
						</CardHeader>
					</Collapse>

					<CardBody>
						<Collapse in={screenIsSmall} animateOpacity>
							<Text mb={4}>Find rooms that match your interests and join one to start chatting.</Text>
						</Collapse>

						<InputGroup>
							<InputLeftElement pointerEvents='none' children={<SearchIcon color='gray.300' />} />
							<Input type='text' placeholder='Search' autoFocus />
						</InputGroup>
					</CardBody>
				</Card>
			</Skeleton>

			<Tabs isFitted isLazy variant='soft-rounded' colorScheme='green'>
				<Skeleton isLoaded={rooms?.length > 0}>
					<TabList overflowX='auto'>
						<Tab onClick={() => setSelectedTab(-1)}>All</Tab>

						{Array.from(new Set(rooms?.map(r => r.brand)))?.map(b => (
							<Tab key={b?._id || 'General'} onClick={() => setSelectedTab(b?._id || undefined)}>
								{b?.name || 'General'}
							</Tab>
						))}
					</TabList>
				</Skeleton>

				<TabPanels>
					<Grid mt={4} gap={4} templateColumns={['repeat(1, 1fr)', 'repeat(2, 1fr)', 'repeat(3, 1fr)', 'repeat(4, 1fr)']}>
						{rooms?.map(room =>
							// If room is private, only show to admins
							(!room?.isPrivate || currentUser?.roles?.includes('admin'))
							// If selectedTab is -1, show all rooms else show only rooms with the selected brand
							// General rooms (without brand) are shown if selectedTab is undefined because room.brand?._id would be undefined
							&& room.brand?._id === (selectedTab === -1 ? room.brand?._id : selectedTab) && (
							<GridItem key={room._id} display='grid'>
								<Skeleton isLoaded={rooms?.length > 0} display='grid'>
									<RoomCard room={room} icon={icons[room.name] || null} />
								</Skeleton>
							</GridItem>
						))}
					</Grid>
				</TabPanels>
			</Tabs>
		</Layout>
	)
}