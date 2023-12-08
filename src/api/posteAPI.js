import axiosInstance from "./axiosInstance";

const posteAPI = {

    getPostesListe(){
        return axiosInstance.get('poste/allpostes'); 
    }, 
    
}

export default posteAPI;