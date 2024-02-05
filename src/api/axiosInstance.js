import axios from 'axios'
import { useNavigate } from 'react-router-dom';
axios.defaults.headers.common['Authorization']= 'Bearer '+ localStorage.getItem('accessToken');



const axiosInstance = axios.create({
    baseURL: 'http://localhost:3005', // URL de base de l'API
  });

export const handleUnauthorizedError = () => {
  // Redirection vers la page de connexion
  console.log('Erreur 401 détectée. Redirection vers la page de connexion...');
  window.location.replace('/login'); // Utilisez window.location pour la redirection
};
 
  // Ajoutez un intercepteur pour gérer les erreurs de réponse

  export default axiosInstance;