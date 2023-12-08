import axiosInstance from "./axiosInstance";

const posteAPI = {

    getPostesListe(){
        return axiosInstance.get('poste/allpostes'); 
    },
    getPosteDetails(posteId) {
        return axiosInstance.get('poste/one',{ params: { idposte: posteId } })
    }
    
    
}

export default posteAPI;