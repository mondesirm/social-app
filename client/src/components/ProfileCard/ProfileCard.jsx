import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import './ProfileCard.css';
import * as UserApi from '../../api/UserRequests.js';
import { useAuth } from '../../contexts/AuthContext';

const ProfileCard = ({ location }) => {
	const { currentUser } = useAuth()

	// Get path from location
	const params = useParams();
	const profileUserId = params.id ?? currentUser._id;
	const [profileUser, setProfileUser] = useState(currentUser);

	useEffect(() => {
		const fetchProfileUser = async () => {
			if (profileUserId === currentUser._id) {
				setProfileUser(currentUser);
			} else {
				const { data } = await UserApi.one(profileUserId);
				setProfileUser(data);
			}
		};
		fetchProfileUser();
	}, [profileUserId, currentUser]);

	return (
		<div className='ProfileCard'>
			<div className='ProfileImages'>
			{/* src={'/images/banners/' + (inputs?.banner || 'default.png')} */}
				<img src={'/images/banners/' + currentUser?.banner} alt='CoverImage' />
				<img src={'/images/avatars/' + currentUser?.avatar} alt='ProfileImage' />
			</div>
			<div className='ProfileName'>
				<span>
					{profileUser.firstName} {profileUser.lastName}
				</span>
				
				<span>
					{profileUser.rooms.map(room => (
						<span key={room._id}>{room.name} ({room.limits})</span>
					))}
				</span>
			</div>

			<div className='followStatus'>
				<hr />
				<div>
					<div className='follow'>
						<span>{profileUser.followers.length}</span>
						<span>Followers</span>
					</div>
					<div className='vl'></div>
					<div className='follow'>
						<span>{profileUser.following.length}</span>
						<span>Following</span>
					</div>
				</div>
				<hr />
			</div>

			{location === 'profilePage' ? (
				''
			) : (
				<span>
					<Link
						to={`/profile/${profileUser._id}`}
						style={{ textDecoration: 'none', color: 'inherit' }}
					>
						My Profile
					</Link>
				</span>
			)}
		</div>
	);
};

export default ProfileCard;
