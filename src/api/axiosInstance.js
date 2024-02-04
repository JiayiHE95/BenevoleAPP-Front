import axios from 'axios'
axios.defaults.headers.common['Authorization']= 'Bearer '+ localStorage.getItem('accessToken');
const axiosInstance = axios.create({
    baseURL: 'http://localhost:3005', // URL de base de l'API
  });
  
export default axiosInstance;
  