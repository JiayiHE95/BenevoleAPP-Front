import axios from 'axios'
import { useNavigate } from 'react-router-dom';
axios.defaults.headers.common['Authorization']= 'Bearer '+ localStorage.getItem('accessToken');


{/*
const axiosInstance = axios.create({
  baseURL: 'http://localhost:3005', // URL de base de l'API
});

*/}
const axiosInstance = axios.create({
  baseURL: 'https://benevole-app-back.onrender.com', // URL de base de l'API
});



export const handleUnauthorizedError = () => {
  window.location.replace('/login'); 
};


axiosInstance.interceptors.request.use(
  (config) => {

    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }

    return config;
  },
);
 
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      handleUnauthorizedError();
    }
    return Promise.reject(error);
  }
);

  export default axiosInstance;