import React, { Fragment, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { useEffect } from 'react';
import { getAllUser, getUserFriends } from '../api/UserRequests';
import { getFriendRequest } from '../api/UserRequests';

import User from './User/User';

const FriendRequest = ({ person }) => {
	const publicFolder = process.env.REACT_APP_PUBLIC_FOLDER;
	const { user } = useSelector(state => state.authReducer.authData);

	const [friendRequest, setFriendRequest] = useState([]);
	const [persons, setPersons] = useState([]);

	useEffect(() => {
		getFriendRequest(user._id).then(res => {
			setFriendRequest(res.data);
		});
    }, []);
    
    useEffect(() => {
		const fetchFriends = async () => {
			const { data } = await getUserFriends(user._id);
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