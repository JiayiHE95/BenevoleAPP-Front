import React from 'react'
import {useNavigate} from 'react-router-dom'

const ErrorPage = () => {
 const navigate=useNavigate()

 return(
  <div className='site-container'>
     <div>Cette page n'existe pas</div>
     <div className='clickable' onClick={()=>{navigate("/")}}>Retourner à la page d'accueil</div>
   </div>
 )
}

export default ErrorPage