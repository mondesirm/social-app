import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { Modal, useColorModeValue } from '@chakra-ui/react'

import './ProfileModal.css'
import { useAuth } from '../../contexts/AuthContext'

const ProfileModal = ({ modalOpened, setModalOpened, data }) => {
	const { user, update } = useAuth()
	const { password, ...other } = data;
	const [formData, setFormData] = useState(other);
	const dispatch = useDispatch();
	const param = useParams();

	const handleChange = e => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	// form submission
	const handleSubmit = e => {
		e.preventDefault();
		let UserData = formData;
		dispatch(update(param.id, UserData));
		setModalOpened(false);
	};

	return (
		<Modal
			overlayColor={useColorModeValue('gray.100', 'gray.700')}
			overlayOpacity={0.55}
			overlayBlur={3}
			size='55%'
			opened={modalOpened}
			onClose={() => setModalOpened(false)}
		>
			<form className='infoForm' onSubmit={handleSubmit}>
				<h3>Your Info</h3>
				<div>
					<input
						value={formData.firstName}
						onChange={handleChange}
						type='text'
						placeholder='First Name'
						name='firstName'
						className='infoInput'
					/>

					<input
						value={formData.lastName}
						onChange={handleChange}
						type='text'
						placeholder='Last Name'
						name='lastName'
						className='infoInput'
					/>
				</div>

				<span>
					{user.rooms.map(room => (
						<span>{room.name} by {room.owner.fullName}</span>
					))}
				</span>

				<button className='button infoButton' type='submit'>
					Update
				</button>
			</form>
		</Modal>
	);
};

export default ProfileModal;