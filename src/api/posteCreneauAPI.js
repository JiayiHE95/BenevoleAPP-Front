import axiosInstance from "./axiosInstance";

const posteCreneauAPI = {
    getEspaceCreneau(){
        return axiosInstance.get('poste-creneau/all'); 
    },  
    createPosteCreneau(data){
        return axiosInstance.post('poste-creneau/create',data); 
    },
    getPosteCreneauByFestival(idfestival){
        return axiosInstance.get(`poste-creneau/get-by-festival/${idfestival}`); 
    },

    getCreneauxByFestival(idfestival){
        return axiosInstance.get(`poste-creneau/get-creneaux-by-festival/${idfestival}`); 
    }
    
}

export default posteCreneauAPI;