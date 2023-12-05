import { configureStore,getDefaultMiddleware } from '@reduxjs/toolkit'
import authReducer from './authReducer';

//import checkoutReducer from './checkoutReducer';

const store = configureStore({
 reducer: {
   auth: authReducer,
 },
})

export default store;
