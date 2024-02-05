import axiosInstance from "./axiosInstance";

const inscriptionAPI = {
    getInscriptionByUser(iduser,idcreneau){
        return axiosInstance.get(`inscription//${iduser}/${idcreneau}`)
    }, 

    getInscriptionOfUser(iduser, idfestival){
        return axiosInstance.get(`inscription/user/${iduser}/${idfestival}`)
    }, 
    
    createInscription(data){
        return axiosInstance.post(`inscription/create`,data)
    },
    createInscription2(data){
        return axiosInstance.post(`inscription/create2`,data)
    },
    deleteInscription(data){
        return axiosInstance.post(`inscription/delete`,data)
    },
    getInscriptionByPosteCreneau(data){
        return axiosInstance.get(`inscription/get-by-poste-creneau?idposte=${data.idposte}&idcreneau=${data.idcreneau}`)
    },
    getRegisteredPeopleByCreneau(data){
        return axiosInstance.post(`inscription/registered`, data)
    },
    inscriptionValisation(data){
        return axiosInstance.post(`inscription/validation`, data)
    },
    getByFestival(idfestival){
        return axiosInstance.get(`inscription/get-by-festival/${idfestival}`)
    }
    
    
}
export default inscriptionAPI;