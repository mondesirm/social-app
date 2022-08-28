/** @format */

import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { followUser, unfollowUser } from '../../actions/UserAction';
import { Link } from 'react-router-dom';

const User = ({ person }) => {
	const publicFolder = process.env.REACT_APP_PUBLIC_FOLDER;
	const { user } = useSelector(state => state.authReducer.authData);
	const dispatch = useDispatch();

	const [following, setFollowing] = useState(
		user.following.includes(person._id)
	);
	const handleFollow = () => {
		// console.log(person._id);
		following
			? dispatch(unfollowUser(person._id, user))
			: dispatch(followUser(person._id, user));
		setFollowing(prev => !prev);
	};

	return (
		<div className='fromUser'>
			<Link to={`/profile/${person._id}`} style={{ display: 'flex', textDecoration: 'none' }}>
				<img
					src={'/images/defaultProfile.png'}
					alt='profile'
					className='fromUserImage'
				/>
				<div className='name'>
					<span>{person.firstname} {person.lastname}</span>
					<span>{person.username}</span>
					{person.following.includes(user._id) &&
						<span>{person.followers.includes(user._id) ? "(Friends)" : "(Following you)"}</span>
					}
				</div>
			</Link>

			<button
				className={
					following
						? 'button fc-button UnfollowButton'
						: 'button fc-button'
				}
				onClick={handleFollow}
			>
				{following ? "Unfollow" : "Follow"}
			</button>
			
		</div>
	);
};

export default User;