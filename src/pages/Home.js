import React, { useEffect, useState } from "react"
import {useNavigate} from 'react-router-dom'
import NavBar from '../components/NavBar';
import SignUp from '../components/SignUp';
import Login from '../components/Login';
import { verifyToken } from "../redux/authReducer";
import { useDispatch, useSelector } from 'react-redux'

const Home = () =>{
  const navigate=useNavigate()
  const dispatch = useDispatch();
  /*
  useEffect(()=>{ 
    console.log("je suis dans home")
    dispatch(verifyToken())
})*/


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