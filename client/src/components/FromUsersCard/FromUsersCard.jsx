import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import './FromUsersCard.css'
import UserLine from '../User/User'
import * as User from '../../api/UserRequests'
import FromUsersModal from '../FromUsersModal/FromUsersModal'

const FromUsersCard = ({ location }) => {
	const [modalOpened, setModalOpened] = useState(false)
	const [persons, setPersons] = useState([])
	const { user } = useSelector(state => state.authReducer.currentUser)

	useEffect(() => {
		const fetchPersons = async () => {
			const { data } = await User.all()
			setPersons(persons.concat(data))
		}
		fetchPersons()
	})

	return (
		<div className='FromUsersCard'>
			<h3>People you may know</h3>

			{persons.map((person, id) => {
				if (person._id !== user._id)
					return <UserLine person={person} key={id} />
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