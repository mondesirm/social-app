import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import * as User from '../../api/UserRequests'
import { useAuth } from '../../contexts/AuthContext'

export default function Conversation({ chat, online }) {
	const { currentUser } = useAuth()
	const [userData, setUserData] = useState(null)
	const dispatch = useDispatch()

	useEffect(() => {
		const other = chat.members.find(member => member._id !== currentUser._id)

		const getUserData = async () => {
			try {
				const { data } = await User.one(other._id);
				setUserData(data);
				dispatch({ type: 'SAVE_USER', data: data });
			} catch (error) {
				console.log(error);
			}
		};

		getUserData();
	}, [chat.members, currentUser._id, dispatch]);

	return (
		<>
			<div className='fromUser conversation'>
				<div>
					{online && <div className='online-dot'></div>}
					<img
						src={'/images/avatars/' + currentUser?.avatar}
						alt='Profile'
						className='fromUserImage'
						style={{ width: '50px', height: '50px' }}
					/>
					<div className='name' style={{ fontSize: '0.8rem' }}>
						<span>
							{userData?.firstName} {userData?.lastName}
						</span>
						<span style={{ color: online ? '#51e200' : '' }}>
							{online ? 'Online' : 'Offline'}
						</span>
              			{/* <div className="button fc-button" style={{ marginLeft: '100px' }}>Unfollow</div> */}
					</div>
				</div>
			</div>
			<hr style={{ width: '85%', border: '0.1px solid #ececec' }} />
		</>
	);
};