import axiosInstance from "./axiosInstance";

const notificationAPI = {
    getNotificationByUser(iduser,idfestival){
        return axiosInstance.get(`notification/get-by-user/${iduser}/${idfestival}`)
    }, 
    deleteNotification(data){
        return axiosInstance.post(`notification/delete`,data)
    }
    
    
}
export default notificationAPI;