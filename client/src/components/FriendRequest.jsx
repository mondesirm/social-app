import { useState } from 'react';

import { useEffect } from 'react';
import { getAllUser, getUserFriends } from '../api/UserRequests';
import { getFriendRequest } from '../api/UserRequests';

import User from './User/User';
import { useAuth } from '../contexts/AuthContext';

const FriendRequest = ({ person }) => {
	// const imagesFolder = process.env.IMAGES_FOLDER;
	const { currentUser } = useAuth()

	const [friendRequest, setFriendRequest] = useState([]);
	const [persons, setPersons] = useState([]);

	useEffect(() => {
		getFriendRequest(currentUser._id).then(res => {
			setFriendRequest(res.data);
		});
    }, []);
    
    useEffect(() => {
		const fetchFriends = async () => {
			const { data } = await getUserFriends(currentUser._id);
			console.log(data);
			setPersons(persons.concat(data));
		};

		const fetchPersons = async () => {
			const { data } = await getAllUser();
			// console.log(data);
			setPersons(persons.concat(data));
		};
		// fetchFriends();
		fetchPersons();
	}, []);

    return (
        <div className='FromUsersCard'>
            <h3>People you've followed</h3>

            {persons.map((person, id) => {
                return <User person={person} key={id} />;
            })}
        </div>
    );
};

export default FriendRequest;