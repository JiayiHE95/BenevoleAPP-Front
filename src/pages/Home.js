import React, { useEffect, useState } from "react"
import { useJwt } from "react-jwt";
import userAPI from "../api/userAPI"
import {useNavigate, Navigate} from 'react-router-dom'

const Home = () =>{
  const navigate=useNavigate()
  const token=localStorage.getItem('accessToken')
  const { decodedToken,isExpired } = useJwt(token?token:"");
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (decodedToken) {
      userAPI.getUserById(decodedToken.iduser).then((res) => {
        setUser(res.data.user);
      });
    }
  }, [decodedToken]);

    return (
      user ? 
      <Navigate to={'/home/user'} />
      :
      <div className="site-container"  >
        <div className="navbar">
          <div className="accueil" style={{color:"white"}} onClick={()=>{navigate('/login')}}>Connexion</div>
          <div className="accueil" style={{color:"white"}} onClick={()=>{navigate('/signup')}}>Inscription</div>
      </div >
    </div>
    );
  }
  export default Home