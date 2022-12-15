const authReducer = (state = { currentUser: null, rooms: [], isAuthenticating: false, isUpdating: false, isFailing: false }, action) => {
	// const hidden = ['password']

	switch (action.type) {
		case 'AUTH_START': return { ...state, isAuthenticating: true, isFailing: false }

		case 'AUTH_SUCCESS':
			action.data.isOnline = true

			// localStorage.setItem('profile', JSON.stringify(currentUser))
			// localStorage.setItem('rooms', JSON.stringify(rooms))
			return { ...state, currentUser: action.data, isAuthenticating: false, isFailing: false }

		case 'AUTH_FAIL': return { ...state, isAuthenticating: false, isFailing: true }

		case 'UPDATING_START': return { ...state, isUpdating: true, isFailing: false }

		case 'UPDATING_SUCCESS':
			// localStorage.setItem('profile', JSON.stringify({ ...action?.data }))
			return { ...state, currentUser: action.data, isUpdating: false, isFailing: false }

		case 'UPDATING_FAIL': return { ...state, isUpdating: false, isFailing: true }

		case 'LOG_OUT':
			localStorage.clear()
			return { ...state, currentUser: null, rooms: [], isAuthenticating: false, isUpdating: false, isFailing: false }

		case 'FOLLOW_USER':
			localStorage.setItem('profile', JSON.stringify({ ...action?.data }))

			return {
				...state,
				currentUser: {
					...state.currentUser,
					user: {
						...state.currentUser.user,
						following: [
							...state.currentUser.user.following.filter(personId => personId !== action.data),
							action.data
						]
					}
				}
			}

		case 'UNFOLLOW_USER':
			localStorage.setItem('profile', JSON.stringify({ ...action?.data }))

			return {
				...state, currentUser: {
					...state.currentUser, user: {
						...state.currentUser.user, following: [
							...state.currentUser.user.following.filter(id => id !== action.data)
						]
					}
				}
			}

		default: return state
	}
}

export default authReducer