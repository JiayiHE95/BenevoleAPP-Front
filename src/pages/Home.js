import React, { useEffect, useState } from "react"
import {useNavigate} from 'react-router-dom'

const Home = () =>{
  const navigate=useNavigate()

    return (
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