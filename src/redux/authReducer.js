import { createSlice } from '@reduxjs/toolkit'
import userAPI from '../api/userAPI'



const authReducerInit = () => {
  try {
    const auth = JSON.parse(localStorage.getItem('auth'))
    return {
      isLoggedIn: true,
      token: auth.token,
      user: auth.user,
      isAdmin:false,
    }
  } catch {
    return {
      isLoggedIn: false,
      token: null,
      user: null,
      isAdmin:false,
    }
  }
}

const initialState = authReducerInit();

const authSlice = createSlice({
 name: "auth",
 initialState,
 reducers: {
     loginSuccess(state) {

         state.isLoggedIn = true
         state.token = null
         state.user = null
         state.isAdmin = null
     },

     loginTimeOut(state) {  
      localStorage.removeItem('auth')
      state.isLoggedIn = false
      state.token = null
      state.user = null
      state.isAdmin = false
     },

     logout(state) {
      localStorage.removeItem('auth')
      state.isLoggedIn = false
      state.token = null
      state.user = null
      state.isAdmin = false
     }
 }
})

export const verifyToken=()=>{
  return async (dispatch) => {
    try{

      const auth=JSON.parse(localStorage.getItem("auth"))
      if(!auth){
        console.log("log out")
      }else{
        console.log("checko token")
        userAPI.checkLoggedIn({
          headers:{"x-access-token":auth.token}
        }).then((resp) => {
          if (resp.data.auth){
           console.log("login succes")
           dispatch(authSlice.actions.loginSuccess())
         }else{
           console.log("login time out")
           dispatch(authSlice.actions.loginTimeOut())
         }
        }).catch(error => {
         console.log(error)
        })
      }
     } catch{ 
     }
  }
}

export const authActions = authSlice.actions
export default authSlice.reducer