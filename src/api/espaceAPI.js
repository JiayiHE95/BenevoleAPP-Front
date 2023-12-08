import axiosInstance from "./axiosInstance";

const espaceAPI = {

     
    getEspacesListe(){
        return axiosInstance.get('espace/allespaces'); 
    },  

}

export default espaceAPI;