import React, { useEffect, useState } from "react"
import { useJwt } from "react-jwt";
import userAPI from "../api/userAPI"
import {useNavigate, Navigate} from 'react-router-dom'
import NavbarAccueil from "../components/NavbarAccueil";

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
      <div className="home">
        <NavbarAccueil></NavbarAccueil>
        <div className="home-main">
          <h1>Système Bénévole du Festival du Jeu de Montpellier</h1>
          <div>

          <div className="bouton2 cursor" onClick={()=>{navigate('/login')}}>Rejoignez-nous dès maintenant</div>
          </div>
        </div>
        {/*
        <div className="navbar">
          <div className="accueil cursor" style={{color:"white"}} onClick={()=>{navigate('/login')}}>Connexion</div>
          <div className="accueil cursor" style={{color:"white"}} onClick={()=>{navigate('/signup')}}>Inscription</div>
        </div>
        */}
    </div>
    );
  }
  export default Home