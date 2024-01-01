import axiosInstance from "./axiosInstance";

const inscriptionAPI = {
    getInscriptionByUser(iduser,idcreneau){
        return axiosInstance.get(`inscription/get-by-user/${iduser}/${idcreneau}`)
    },  
    
    createInscription(data){
        return axiosInstance.post(`inscription/create`,data)
    },
    deleteInscription(data){
        return axiosInstance.post(`inscription/delete`,data)
    },
    getInscriptionByPosteCreneau(data){
        return axiosInstance.get(`inscription/get-by-poste-creneau?idposte=${data.idposte}&idcreneau=${data.idcreneau}`)
    }
}
export default inscriptionAPI;