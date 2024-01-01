import axiosInstance from "./axiosInstance";

const flexibleAPI = {
  getFlexibleUserByCreneau(idcreneau){
    return axiosInstance.get(`flexible/get-user-by-creneau/${idcreneau}`)
  },
  getOneByUserAndCreneau(data){
    return axiosInstance.post(`flexible/get-one`,data)
  },
  createFlexibleUser(data){
    return axiosInstance.post(`flexible/create`,data)
  },
  deleteFlexibleUser(data){
    return axiosInstance.post(`flexible/delete`,data)
  }

}
export default flexibleAPI;