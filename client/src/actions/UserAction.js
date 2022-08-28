import * as UserApi from '../api/UserRequests';
import * as ChatApi from '../api/ChatRequests';

export const getCurrentUser = (id) => async dispatch => {
	dispatch({ type: 'UPDATING_START' });

	try {
		const { data } = await UserApi.getUser(id);
		dispatch({ type: 'UPDATING_SUCCESS', data: data });
	} catch (error) {
		dispatch({ type: 'UPDATING_FAIL' });
	}
};

export const updateUser = (id, formData) => async dispatch => {
	dispatch({ type: 'UPDATING_START' });
	try {
		const { data } = await UserApi.updateUser(id, formData);
		dispatch({ type: 'UPDATING_SUCCESS', data: data });
	} catch (error) {
		dispatch({ type: 'UPDATING_FAIL' });
	}
};

export const followUser = (id, formData) => async dispatch => {
	dispatch({ type: 'UPDATING_START' });
	try {
		const { data } = await UserApi.followUser(id, formData);
		await ChatApi.createChat({ senderId: id, receiverId: formData._id });
  
		dispatch({type: "FOLLOW_USER", data: id})
	} catch (error) {
		dispatch({ type: 'UPDATING_FAIL' });
	}
};

export const unfollowUser = (id, formData) => async dispatch => {
	dispatch({ type: 'UPDATING_START' });
	try {
		const { data } = await UserApi.unfollowUser(id, formData);
		await ChatApi.removeChat({ senderId: id, receiverId: formData._id });
		dispatch({type: "UNFOLLOW_USER", data: id})
	} catch (error) {
		dispatch({ type: 'UPDATING_FAIL' });
	}
};