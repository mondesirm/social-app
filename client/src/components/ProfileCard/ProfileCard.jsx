import React, { useEffect, useState } from 'react';
import './ProfileCard.css';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import * as UserApi from '../../api/UserRequests.js';

const ProfileCard = ({ location }) => {
	const { user } = useSelector(state => state.authReducer.currentUser);
	// Get path from location
	const params = useParams();
	const profileUserId = params.id ?? user._id;
	const [profileUser, setProfileUser] = useState(user);

	useEffect(() => {
		const fetchProfileUser = async () => {
			if (profileUserId === user._id) {
				setProfileUser(user);
			} else {
				const { data } = await UserApi.one(profileUserId);
				setProfileUser(data);
			}
		};
		fetchProfileUser();
	}, [profileUserId, user]);

	return (
		<div className='ProfileCard'>
			<div className='ProfileImages'>
				<img
					src={'/images/defaultCover.jpg'}
					alt='CoverImage'
				/>
				<img
					src={'/images/defaultProfile.png'}
					alt='ProfileImage'
				/>
			</div>
			<div className='ProfileName'>
				<span>
					{profileUser.firstName} {profileUser.lastName}
				</span>
				
				<span>
					{profileUser.rooms.map(room => (
						<span>{room.name} by {room.owner.fullName}</span>
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
