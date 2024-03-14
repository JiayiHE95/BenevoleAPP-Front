import axiosInstance from "./axiosInstance";

const jeuEspaceAPI = {

    getJeuxListe(idzonebenevole, idfestival){
        return axiosInstance.get('jeu/all', { 
            params: { 
                idzonebenevole: idzonebenevole,
                idfestival: idfestival
         } }); 
    },

    getOneByFestival(festivalId){
        return axiosInstance.get(`jeu/get-one-by-festival/${festivalId}`)
    }
    
    
    
}

export default jeuEspaceAPI;