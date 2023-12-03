import axiosInstance from "./axiosInstance"

const userAPI={

 createUser(data){
  return axiosInstance.post(`user/inscription`,data)
 },

 connexion(data){
  return axiosInstance.post(`user/connexion`,data)
 },

 checkLoggedIn(data){
  return axiosInstance.get(`user/isLogged`,data)
 },

 checkToken(data){
  return axiosInstance.get(`user/check-pw-token`,data)
 },
 
 passwordReset(data){
  return axiosInstance.post(`user/password-reset`,data)
 },

 passwordForgot(data){
  return axiosInstance.post(`user/password-forgot`,data)
 },
 
 getUserByMail(mail){
  return axiosInstance.get(`user/get-user-by-mail/${mail}`)
 },
 getUserByPWToken(token){
  return axiosInstance.get(`user/get-user-by-pwtoken/${token}`)
 },
 

}

export default userAPI