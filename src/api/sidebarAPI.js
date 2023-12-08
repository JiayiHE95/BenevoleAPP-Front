import axiosInstance from "./axiosInstance";

const sidebarAPI = {

    getPostesListe(){
        return axiosInstance.get('poste/allpostes'); 
    }, 
    getEspacesListe(){
        return axiosInstance.get('espace/allespaces'); 
    },  

}

export default sidebarAPI;