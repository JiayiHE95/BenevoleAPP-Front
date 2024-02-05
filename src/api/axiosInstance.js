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


// Ajoutez un intercepteur pour chaque requête sortante
axiosInstance.interceptors.request.use(
  (config) => {
    // Récupérez le token depuis le stockage local
    const accessToken = localStorage.getItem('accessToken');

    // Ajoutez l'en-tête Authorization avec le token à la requête
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }

    return config;
  },
);
 
  // Ajoutez un intercepteur pour gérer les erreurs de réponse

  export default axiosInstance;