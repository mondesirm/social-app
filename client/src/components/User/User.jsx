import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import { useAuth } from '../../contexts/AuthContext'

const User = ({ person }) => {
	// const publicFolder = process.env.PUBLIC_FOLDER;
	const { user, follow, unfollow } = useAuth()
	const dispatch = useDispatch();

	const [following, setFollowing] = useState(
		user.following.includes(person._id)
	);
	const handleFollow = () => {
		// console.log(person._id);
		following
			? dispatch(unfollow(person._id, user))
			: dispatch(follow(person._id, user));
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
					<span>{person.firstName} {person.lastName}</span>
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