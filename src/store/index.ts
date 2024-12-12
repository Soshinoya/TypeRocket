import { configureStore, combineReducers } from '@reduxjs/toolkit'

// import app from 'features/App/reducer'

const reducer = combineReducers({
	// app,
})

const store = configureStore({ reducer })

export default store
