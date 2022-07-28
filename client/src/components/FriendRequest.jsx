import React, { Fragment, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { useEffect } from 'react';
import { getFriendRequest } from '../api/UserRequests';





const FriendRequest = ({ person }) => {
	const publicFolder = process.env.REACT_APP_PUBLIC_FOLDER;
    const { user } = useSelector(state => state.authReducer.authData);
 
    const [friendRequest, setFriendRequest] = useState([]);

    useEffect(() => {
          
        getFriendRequest(user._id).then((res) => {
            setFriendRequest(res.data);
        });

    },[]);

    return (
    <Fragment>
            jdjd
    </Fragment>

);





};



export default FriendRequest;