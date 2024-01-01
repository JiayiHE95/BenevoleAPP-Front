import axiosInstance from "./axiosInstance";

const posteAPI = {

    getPostesListe(){
        return axiosInstance.get('poste/allpostes'); 
    },
    getPosteDetails(posteId) {
        return axiosInstance.get('poste/one',{ params: { idposte: posteId } })
    },
    createPoste(data){
        return axiosInstance.post('poste/create',data)
    }
    
}

export default posteAPI;