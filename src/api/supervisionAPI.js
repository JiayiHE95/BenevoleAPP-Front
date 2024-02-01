import axiosInstance from "./axiosInstance";

const supervisionAPI = {
    
    getReferentByPoste(data){
        return axiosInstance.post(`supervision/getByPoste`,data)
    },
    addReferent(data){
        return axiosInstance.post(`supervision/addReferent`,data)
    }
    
    
}
export default supervisionAPI;