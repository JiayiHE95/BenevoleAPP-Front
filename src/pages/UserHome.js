//import { useJwt } from "react-jwt";
import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from 'react-redux'
import {useParams,useNavigate, Navigate} from 'react-router-dom'
import { authActions } from '../redux/authReducer'
import { useJwt } from "react-jwt";
import { verifyToken } from "../redux/authReducer";

const UserHome = () => {
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn)
  //const isAdmin = useSelector(state => state.auth.isAdmin)
  //const user = useSelector(state => state.auth.user)
  const token=localStorage.getItem('accessToken')
  const [userId, setUserId] = useState(null);
  const navigate=useNavigate()

  //const {idUser}=useParams() 

  const { decodedToken,isExpired } = useJwt(token?token:"token");

  useEffect(() => {
    // Vérifiez d'abord si decodedToken existe pour éviter les erreurs
    if (decodedToken) {
      // Mise à jour de l'état userId avec la valeur de iduser du token
      setUserId(decodedToken.iduser);
    }
  }, [decodedToken]);

  const dispatch = useDispatch();
  console.log("est expiré:",isExpired)
/*
  useEffect(()=>{ 
    console.log("je suis dans user home")
    dispatch(verifyToken())
})*/

  return (
    !token||isExpired?
    <Navigate to={'/'} />:
    <div className="UserHome">
      <h1>User Home Page</h1>
      {/* Utilisez la valeur mise à jour de userId ici */}
      <p>User ID: {userId}</p>
      <div className='clickable' onClick={() => {
      localStorage.removeItem('accessToken');
      navigate(`/`);
    }}>Déconnexion</div>
    </div> 
  )
};

export default UserHome;