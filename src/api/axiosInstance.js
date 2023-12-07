import axios from 'axios'

const axiosInstance = axios.create({
    baseURL: 'http://localhost:3005', // URL de base de l'API
  });
  
export default axiosInstance;
  