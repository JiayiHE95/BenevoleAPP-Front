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
    getPosteByFestival(idfestival){
        return axiosInstance.get(`poste-creneau/get-poste-by-festival/${idfestival}`); 
    },
    getCreneauxByFestival(idfestival){
        return axiosInstance.get(`poste-creneau/get-creneaux-by-festival/${idfestival}`); 
    },
    updateCreneauHoraire(data){
        return axiosInstance.post(`poste-creneau/update-horaire`,data); 
    },

    getByZoneFestival(data){
        return axiosInstance.post(`poste-creneau/get-by-zone-festival`, data); 
    },
    updateCapacite(data){
        return axiosInstance.post(`poste-creneau/update-capacite`, data); 
    },

    
}

export default posteCreneauAPI;