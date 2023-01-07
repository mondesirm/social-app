const initialState = {
	currentUser: null, rooms: [],
	isAuthenticating: false, isLoggingOut: false, isUpdating: false, isJoining: false, isLeaving: false, isFailing: false
}

export default function authReducer(state = initialState, action) {
	switch (action.type) {
		case 'AUTH_START': return { ...state, isAuthenticating: true, isFailing: false }
		case 'AUTH_SUCCESS': return { ...state, currentUser: action.data, isAuthenticating: false, isFailing: false }
		case 'AUTH_FAIL': return { ...state, isAuthenticating: false, isFailing: true }

		case 'LOGOUT_START': return { ...state, isLoggingOut: true, isFailing: false }
		case 'LOGOUT_SUCCESS': localStorage.removeItem('store'); return initialState
		case 'LOGOUT_FAIL': return { ...state, isLoggingOut: false, isFailing: true }

		case 'UPDATING_START': return { ...state, isUpdating: true, isFailing: false }
		case 'UPDATING_SUCCESS': return { ...state, currentUser: action.data, isUpdating: false, isFailing: false }
		case 'UPDATING_FAIL': return { ...state, isUpdating: false, isFailing: true }

		case 'JOINING_START': return { ...state, isJoining: true, isFailing: false }
		case 'JOINING_SUCCESS': return { ...state, currentUser: action.data, isJoining: false, isFailing: false }
		case 'JOINING_FAIL': return { ...state, isJoining: false, isFailing: true }

		case 'LEAVING_START': return { ...state, isLeaving: true, isFailing: false }
		case 'LEAVING_SUCCESS': return { ...state, currentUser: action.data, isLeaving: false, isFailing: false }
		case 'LEAVING_FAIL': return { ...state, isLeaving: false, isFailing: true }

		/* case 'FOLLOW_USER':
			return {
				...state, currentUser: {
					...state.currentUser, following: [
						...state.currentUser.following.filter(user => user._id !== action.data._id),
						action.data
					]
				}
			}

		case 'UNFOLLOW_USER':
			return {
				...state, currentUser: {
					...state.currentUser, following: [
						...state.currentUser.following.filter(user => user._id !== action.data._id)
					]
				}
			} */
		default: return state
	}
}