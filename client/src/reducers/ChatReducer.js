const chatReducer = (state = { chatUsers: [], loading: false, error: false }, action) => {
	switch (action.type) {
		case 'SAVE_USER':
			return {
				...state, chatUsers: [
					...state.chatUsers.filter(user => user._id !== action.data._id),
					action.data
				]
			}
		default: return state
	}
}

export default chatReducer