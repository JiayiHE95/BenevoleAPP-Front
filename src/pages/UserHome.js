//import { useJwt } from "react-jwt";
import React, { useEffect, useState } from "react"
import {useParams,useNavigate, Navigate} from 'react-router-dom'
import { useJwt } from "react-jwt";
import NavBar from "../components/NavBar";
import Profil from "../components/Profil";
import userAPI from "../api/userAPI";

const UserHome = () => {

  const [iduser, setIdUser] = useState(null);
  const [user, setUser] = useState(null);
  const navigate=useNavigate()

  const token=localStorage.getItem('accessToken')
  const { decodedToken,isExpired } = useJwt(token?token:"");

  useEffect(() => {
    if (decodedToken) {
      setIdUser(decodedToken.iduser);
    }
  }, [decodedToken]);



  return (
    !token||isExpired ?
    <Navigate to={'/'} />:
    <div className="UserHome">
      <NavBar/>
      {iduser &&<Profil iduser={iduser}/>}
      <h1>User Home Page</h1>
      <p>User ID: {iduser}</p>
      <div className='clickable' onClick={() => {
      localStorage.removeItem('accessToken');
      navigate(`/`);
      }}>Déconnexion</div>
    </div> 
  )
};

export default UserHome;