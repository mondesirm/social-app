import { combineReducers } from 'redux'

import authReducer from './AuthReducer'
import chatReducer from './ChatReducer'
import databaseReducer from './DatabaseReducer'

export default combineReducers({ authReducer, chatReducer, databaseReducer })