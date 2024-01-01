import axiosInstance from "./axiosInstance";

const espaceAPI = {

     
    getEspacesListe(){
        return axiosInstance.get('espace/allespaces'); 
    },  

    getSousZone(idzonebenevole, idfestival, idcreneau){
        return axiosInstance.get(`espace/get-souszone/${idzonebenevole}/${idfestival}/${idcreneau}`);
    }

}

export default espaceAPI;