import React from 'react';
import FromUsersCard from '../FromUsersCard/FromUsersCard';
import InfoCard from '../InfoCard/InfoCard';
import LogoSearch from '../LogoSearch/LogoSearch';
import ProfileCard from '../ProfileCard/ProfileCard';
import './ProfileSide.css';

const ProfileSide = ({ children }) => {
	return (
		<div className='ProfileSide'>
			<LogoSearch />
			<ProfileCard location='homepage' />
			{children}
		</div>
	);
};

export default ProfileSide;