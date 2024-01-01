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

 getCurrentFestival(){
  return axiosInstance.get(`festival/current`)
 },

 updateFestival(data){
  return axiosInstance.post(`festival/update`,data)
 }

}

export default festivalAPI;