//import { useJwt } from "react-jwt";
import React, { useEffect, useState } from "react"
import {useParams,useNavigate, Navigate} from 'react-router-dom'
import { useJwt } from "react-jwt";
import NavBar from "../components/NavBar";
import Profil from "../components/Profil";
import userAPI from "../api/userAPI";
import FileUploader from "../components/FileUploader";

const UserHome = () => {

  const [user, setUser] = useState(null);
  const navigate=useNavigate()

  const token=localStorage.getItem('accessToken')
  const { decodedToken,isExpired } = useJwt(token?token:"");
  isExpired && localStorage.removeItem('accessToken')

  useEffect(() => {
    if (decodedToken) {
      userAPI.getUserById(decodedToken.iduser).then((res) => {
        setUser(res.data.user);
      });
    }
  }, [decodedToken]);

  const handleUpdateUser = (updatedUser) => {
    setUser(updatedUser);
  };



  return (
    isExpired ?
    <Navigate to={'/'} />:
    <div className="UserHome">
      <NavBar/>
      <h1>User Home Page</h1>
      {user && <Profil user={user} onUpdateUser={handleUpdateUser}/>}
    </div> 
  )
};

export default UserHome;