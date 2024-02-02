import React, { useState, useEffect } from 'react'
import {useNavigate} from 'react-router-dom'
import userAPI from '../api/userAPI'
import { useJwt } from "react-jwt";

const NavBar =({ festivalId })=>{
 const [user, setUser] = useState(null);
 const navigate=useNavigate()
 //const [isOpenedDropdown, setIsOpenedDropdown] = useState(false)
 //let imagePath = window.location.origin+"/picture/";
 const token=localStorage.getItem('accessToken')
 const { decodedToken,isExpired } = useJwt(token?token:"");

 useEffect(() => {
  if (decodedToken) {
    userAPI.getUserById(decodedToken.iduser).then((resp)=>{
      if(resp.data){
        setUser(resp.data.user)
      }
    })
  }
}, [decodedToken]);


 return(

  <div className='navbar-container'>
   <div onClick={()=>{navigate("/")}}>
      <div className='logo-name'>Festival de Jeux</div>
   </div>  
   {user&&
    <div className='navbar'>
    <div  onClick={() => { navigate("/home/user"); }}>Home</div>
    <div  onClick={() => { navigate(`/festival/${festivalId}`); }}>Accueil</div>
    <div  onClick={() => { navigate(`/notification/${festivalId}`)}}>Notifications</div>
    <div  onClick={() => { navigate(`/infos/${festivalId}`); }}>Infos</div>
    <div  onClick={() => { navigate(`/planning/${festivalId}`); }}>Planning</div>
    {(user.role === "BENEVOLE") &&
      <div  onClick={() => { navigate(`/registration/${festivalId}`); }}>Inscription</div>
    }
    <div class="material-icons" onClick={() => {localStorage.removeItem('accessToken');navigate(`/`);}}>logout</div>
  </div>
  
    }
   </div>
   )
}
export default NavBar