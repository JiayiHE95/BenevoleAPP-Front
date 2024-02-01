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
   <div className='logo clickable' onClick={()=>{navigate("/")}}>
      <div className='logo-name'>Benevole APP</div>
   </div>  
   {user&&
    <div className='navbar'>
    <div className='clickable' onClick={() => { navigate("/home/user"); }}>{user.pseudo}</div>
    <div className='clickable' onClick={() => { navigate(`/notification/${festivalId}`)}}>Notifications</div>
    <div className='clickable' onClick={() => { navigate(`/infos/${festivalId}`); }}>Infos</div>
    <div className='clickable' onClick={() => { navigate(`/planning/${festivalId}`); }}>Planning</div>
    {(user.role === "BENEVOLE") &&
      <div className='clickable' onClick={() => { navigate(`/registration/${festivalId}`); }}>Inscription</div>
    }
     {(user.role === "ADMIN") &&
      <div className='clickable' onClick={() => { navigate(`/referents/${festivalId}`); }}>Référents</div>
    }
    <div className='clickable' onClick={() => { localStorage.removeItem('accessToken'); navigate(`/`); }}>Déconnexion</div>
  </div>
  
    }
   </div>
   )
}
export default NavBar