import axiosInstance from "./axiosInstance";

const festivalAPI = {
 getFestivalByAnnee(annee){
  return axiosInstance.get(`festival/get-festival-by-annee/${annee}`)
 },

 getAllFestival(){
  return axiosInstance.get(`festival/all`)
 }, 

 createFestival(data){
  return axiosInstance.post(`festival/create`,data)
 },

 getCurrentFestival(festivalId){
  return axiosInstance.get(`festival/${festivalId}`)
 },

 updateFestival(data){
  return axiosInstance.post(`festival/update`,data)
 },

 deleteFestival(data){
  return axiosInstance.post(`festival/delete`,data)
 }

}

export default festivalAPI;