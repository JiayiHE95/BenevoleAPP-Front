import axiosInstance from "./axiosInstance";

const jeuEspaceAPI = {

    getJeuxListe(idzonebenevole){
        return axiosInstance.get('jeu/all', { params: { idzonebenevole: idzonebenevole } }); 
    },
    
    
    
}

export default jeuEspaceAPI;