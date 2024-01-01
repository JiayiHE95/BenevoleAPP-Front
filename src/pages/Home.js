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
      <div className="site-container">
        <h1>Accueil</h1>
    <div >
      <div>Festival du Jeu Montpellier</div>
      <div>Bienvenue sur notre site </div>
      <div>
      <div className='navbar'>
      <div className='clickable' onClick={()=>{navigate('/login')}}>Connexion</div>
      <div className='clickable' onClick={()=>{navigate('/signup')}}>Inscription</div>
      </div >
    </div>
    </div>
      </div>
    );
  }
  export default Home