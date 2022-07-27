import React from 'react';
import './ProfileCard.css';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Select from 'react-select';
import { programmingLanguageOptions } from '../../docs/data';

const ProfileCard = ({ location }) => {
	const { user } = useSelector(state => state.authReducer.authData);

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
					{user.firstname} {user.lastname}
				</span>
				<span>
				<Select
					isMulti 
					name="languages"
					value={(user.languages || []).map(language => ({ label: language }))}
					options={programmingLanguageOptions}
					closeMenuOnSelect={false}
					className="basic-multi-select"
					classNamePrefix="select"
					isDisabled={true}
				/>
				</span>
			</div>

			<div className='followStatus'>
				<hr />
				<div>
					<div className='follow'>
						<span>{user.followers.length}</span>
						<span>Amis</span>
					</div>
					<div className='vl'></div>
					<div className='follow'>
						<span>{user.following.length}</span>
						<span>Demande envoyées</span>
					</div>
				</div>
				<hr />
			</div>

			{location === 'profilePage' ? (
				''
			) : (
				<span>
					<Link
						to={`/profile/${user._id}`}
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
