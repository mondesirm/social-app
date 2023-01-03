import { useEffect, useState } from 'react'

import './FromUsersCard.css'
import UserLine from '../User/User'
import * as User from '../../api/UserRequests'
import { useAuth } from '../../contexts/AuthContext'
import FromUsersModal from '../FromUsersModal/FromUsersModal'

const FromUsersCard = ({ location }) => {
	const { currentUser } = useAuth()
	const [persons, setPersons] = useState([])
	const [modalOpened, setModalOpened] = useState(false)

	useEffect(() => {
		const fetchPersons = async () => {
			const { data } = await User.all()
			setPersons(data)
		}
		fetchPersons()
	}, [currentUser])

	return (
		<div className='FromUsersCard'>
			<h3>People you may know</h3>

			{persons.map((person, id) => {
				if (person._id !== currentUser._id) return <UserLine person={person} key={id} />
				return ''
			})}
			{!location ? (
				<span onClick={() => setModalOpened(true)}>Show more</span>
			) : (
				''
			)}

			<FromUsersModal
				modalOpened={modalOpened}
				setModalOpened={setModalOpened}
			/>
		</div>
	)
}

export default FromUsersCard