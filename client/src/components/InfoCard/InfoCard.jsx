import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import './InfoCard.css'
import { EditIcon } from '@chakra-ui/icons'
import ProfileModal from '../ProfileModal/ProfileModal'
import { useParams } from 'react-router-dom'
import * as User from '../../api/UserRequests.js'
import { useAuth } from '../../contexts/AuthContext'

const InfoCard = () => {
	const { currentUser, logout } = useAuth()
	const dispatch = useDispatch()
	const params = useParams()
	const [modalOpened, setModalOpened] = useState(false)
	const profileUserId = params?.id || currentUser._id
	const [profileUser, setProfileUser] = useState(currentUser)

	const handleLogOut = () => dispatch(logout())

	useEffect(() => {
		const fetchProfileUser = async () => {
			if (profileUserId === currentUser._id) {
				setProfileUser(currentUser)
			} else {
				const { data } = await User.one(profileUserId)
				setProfileUser(data)
			}
		}
		fetchProfileUser()
	}, [profileUserId, currentUser])

	return (
		<div className='InfoCard'>
			<div className='infoHead'>
				<h4>Profile Info</h4>
				{currentUser._id === profileUserId ? (
					<div>
						<EditIcon
							width='2rem'
							height='1.2rem'
							onClick={() => setModalOpened(true)}
						/>
						<ProfileModal
							modalOpened={modalOpened}
							setModalOpened={setModalOpened}
							data={profileUser}
						/>
					</div>
				) : (
					''
				)}
			</div>

			<div className='info'>
				{/* */}
				<span>
					<b>First Name: </b>
				</span>
				<span>{profileUser.firstName}</span>
			</div>
			<div className='info'>
				<span>
					<b>Last Name: </b>
				</span>
				<span>{profileUser.lastName}</span>
			</div>
			<div className='info'>
				<span>
					<b>Username </b>
				</span>
				<span>{profileUser.username}</span>
			</div>

			<div className='info'>
				<span>
					<b>Rooms </b>
				</span>
				<span>
					{profileUser.rooms.map(room => (
						<span key={room._id}>{room.name} ({room.limits})</span>
					))}
				</span>
			</div>

			<button className='button logout-button' onClick={handleLogOut}>
				Log Out
			</button>
		</div>
	)
}

export default InfoCard