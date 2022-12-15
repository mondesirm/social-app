import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import * as User from '../../api/UserRequests';

const Conversation = ({ data, currentUser, online }) => {
	const [userData, setUserData] = useState(null);
	const dispatch = useDispatch();

	useEffect(() => {
		const userId = data.members.find(id => id !== currentUser);
		const getUserData = async () => {
			try {
				const { data } = await User.one(userId);
				setUserData(data);
				dispatch({ type: 'SAVE_USER', data: data });
			} catch (error) {
				console.log(error);
			}
		};

		getUserData();
	});

	return (
		<>
			<div className='fromUser conversation'>
				<div>
					{online && <div className='online-dot'></div>}
					<img
						src={'/images/defaultProfile.png'}
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

export default Conversation;