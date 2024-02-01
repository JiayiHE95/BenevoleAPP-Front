import axiosInstance from "./axiosInstance";

const jeuEspaceAPI = {

    getJeuxListe(idzonebenevole){
        return axiosInstance.get('jeu/all', { params: { idzonebenevole: idzonebenevole } }); 
    },

    getOneByFestival(festivalId){
        return axiosInstance.get(`jeu/get-one-by-festival/${festivalId}`)
    }
    
    
    
}

export default jeuEspaceAPI;