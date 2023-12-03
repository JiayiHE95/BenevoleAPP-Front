import React from 'react';
import {useNavigate} from 'react-router-dom'
import NavBar from '../components/NavBar';

const Home = () =>{
  const navigate=useNavigate()
    return (
      <div className="site-container">
        <h1>Accueil</h1>
        <NavBar/>
    <div className="home-presentation">
      <div className="presentation-title">Festival du Jeu Montpellier</div>
      <div>Bienvenue sur notre site </div>
    </div>
      </div>
    );
  }
  export default Home