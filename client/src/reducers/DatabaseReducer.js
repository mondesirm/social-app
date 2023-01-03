const initialState = {
	db: {},
	isFetching: false, isCreating: false, isUpdating: false, isDeleting: false, isUploading: false, isFailing: false
}

export default function databaseReducer(state = initialState, action) {
	switch (action.type) {
		case 'FETCHING_START': return { ...state, isFetching: true, isFailing: false }
		case 'FETCHING_SUCCESS': return { ...state, db: { ...state.db, [action.model]: action.data }, isFetching: false, isFailing: false }
		case 'FETCHING_FAIL': return { ...state, isFetching: false, isFailing: true }

		case 'CREATING_START': return { ...state, isCreating: true, isFailing: false }
		case 'CREATING_SUCCESS':
			return {
				...state, db: {
					...state.db, [action.model]: [
						...state.db[action.model].filter(m => m._id !== action.data._id),
						action.data
					]
				}, isCreating: false, isFailing: false
			}
		case 'CREATING_FAIL': return { ...state, isCreating: false, isFailing: true }

		case 'DB_UPDATING_START': return { ...state, isUpdating: true, isFailing: false }
		case 'DB_UPDATING_SUCCESS':
			return {
				...state, db: {
					...state.db, [action.model]: [
						...state.db[action.model].filter(m => m._id !== action.data._id),
						action.data
					]
				}, isUpdating: false, isFailing: false
			}
		case 'DB_UPDATING_FAIL': return { ...state, isUpdating: false, isFailing: true }

		case 'DB_DELETING_START': return { ...state, isDeleting: true, isFailing: false }
		case 'DB_DELETING_SUCCESS':
			return {
				...state, db: {
					...state.db, [action.model]: [
						...state.db[action.model].filter(m => m._id !== action.data._id),
						action.data
					]
				}, isDeleting: false, isFailing: false
			}
		case 'DB_DELETING_FAIL': return { ...state, isDeleting: false, isFailing: true }

		case 'UPLOADING_START': return { ...state, isUploading: true, isFailing: false }
		case 'UPLOADING_SUCCESS': return { ...state, isUploading: false, isFailing: false }
		case 'UPLOADING_FAIL': return { ...state, isUploading: false, isFailing: true }

		default: return state
	}
}