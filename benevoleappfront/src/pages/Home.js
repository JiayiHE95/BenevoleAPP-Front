import React from 'react';
import { Link } from 'react-router-dom';

const Home = () =>{
    return (
      <div className="Home">
        <h1>Accueil</h1>
        <Link to="/login">Se connecter</Link>
      </div>
    );
  }
  export default Home