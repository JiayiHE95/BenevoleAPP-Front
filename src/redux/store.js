import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authReducer';
//import checkoutReducer from './checkoutReducer';

const store = configureStore({
 reducer: {
   auth: authReducer,
   //checkout:checkoutReducer
 }
})

export default store;
