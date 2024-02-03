import React, { useState, useEffect } from 'react'
import {useNavigate} from 'react-router-dom'
import userAPI from '../api/userAPI'
import { useJwt } from "react-jwt";
import notificationAPI from '../api/notificationAPI';

const NavBar =({ festivalId })=>{

  const [notifications, setNotifications] = useState([]);
  const [compteur, setCompteur] = useState([]);
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
useEffect(() => {
  // Update the notification counter whenever the notifications change
  setCompteur(notifications.length);
}, [notifications]);
 useEffect(() => {
    // Fetch the list of inscriptions when the component mounts
    if (user) {
      recuperationNotifications();
      setCompteur(notifications.length);
    }
  }, [user]);

  const recuperationNotifications = async () => {
    
    try {
      const response = await notificationAPI.getNotificationByUser(user.iduser, festivalId);
      console.log("notifs ..........................", response.data.notifications);
      setNotifications(response.data.notifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };
 return(

  <div className='navbar-container'>
   <div onClick={()=>{navigate("/")}}>
      <div className='logo-name'>Festival de Jeux</div>
   </div>  
   {user&&
    <div className='navbar'>
    <div  onClick={() => { navigate("/home/user"); }}>Home</div>
    <div  onClick={() => { navigate(`/festival/${festivalId}`); }}>Accueil</div>
    <div  onClick={() => { navigate(`/notification/${festivalId}`)}}>Notifications <span className='bulle'>{compteur}</span></div>
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