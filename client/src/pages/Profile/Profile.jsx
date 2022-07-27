import React from 'react';
import FromUsersCard from '../../components/FromUsersCard/FromUsersCard';
import NavIcons from '../../components/NavIcons/NavIcons';
import ProfileCard from '../../components/ProfileCard/ProfileCard';
import ProfileLeft from '../../components/ProfileLeft/ProfileLeft';
import RightSide from '../../components/RightSide/RightSide';
import './Profile.css';
const Profile = () => {
	return (
		<div className='Profile'>
			<ProfileLeft />
			<div style={{ marginBottom: '2em', maxWidth: '30em' }}>
				<NavIcons />
				<div className='Profile-center'>
					<ProfileCard location='profilePage' />
				</div>
			</div>
			<FromUsersCard />
		</div>
	);
};

export default Profile;