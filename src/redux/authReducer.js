import { createSlice } from '@reduxjs/toolkit'
import userAPI from '../api/userAPI'

const authReducerInit = () => {
 try {
   const auth = JSON.parse(localStorage.getItem('auth'))
   return {
     isLoggedIn: true,
     token: auth.token,
     user: auth.user,
     isAdmin:auth.user.isAdmin,
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

export const getUser =()=>{
  let user=JSON.parse(localStorage.getItem("auth"))
  let token=JSON.parse(localStorage.getItem("auth")).token
  if(user){
    userAPI.getUserById(user.user.idUser).then((resp) => {
      localStorage.setItem("auth",JSON.stringify({
        token: token,
        user:resp.data
       }))
    }).catch(error => {
    console.log(error)
    })
  }
}

const initialState = authReducerInit();

const authSlice = createSlice({
 name: "auth",
 initialState,
 reducers: {
     loginSuccess(state) {
         const auth = JSON.parse(localStorage.getItem("auth"));
         state.isLoggedIn = true
         state.token = auth.token
         state.user = auth.user
         state.isAdmin = auth.user.isAdmin
     },

     loginUpdate(state) {
      getUser()
      const auth = JSON.parse(localStorage.getItem("auth"));
      state.isLoggedIn = true
      state.token = auth.token
      state.user = auth.user
      state.isAdmin = auth.user.isAdmin
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
      //console.log("une erreur est survenu lors de la vérification du token")
     }
  }
}

export const authActions = authSlice.actions
export default authSlice.reducer