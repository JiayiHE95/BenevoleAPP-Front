import React, { useState } from 'react';
import NavBar from '../components/NavBar';
import Sidebar from '../components/Sidebar';
import PosteDetails from '../components/PosteDetails'
import { useParams, Navigate } from 'react-router-dom';
import { useJwt } from 'react-jwt';
import userAPI from '../api/userAPI';
import { useEffect } from 'react';
import festivalAPI from '../api/festivalAPI';


const Infos = () => {
    const { festivalId } = useParams();
    const [festival, setFestival] = useState(null);

    const [selectedPosteId, setSelectedPosteId] = useState(null);


    const [user, setUser] = useState(null);
    const token=localStorage.getItem('accessToken')
     const { decodedToken,isExpired } = useJwt(token?token:"");
   
     useEffect(() => {
       if (decodedToken) {
         userAPI.getUserById(decodedToken.iduser).then((res) => {
           setUser(res.data.user);
         });
       }
         festivalAPI.getCurrentFestival(festivalId).then((res) => {
           if(res.data.find){
            console.log(res.data.festival)
            setFestival(res.data.festival)
         }
        })

     }, [decodedToken]);

    const handlePosteClick = (posteId) => {
        setSelectedPosteId(posteId);
    };


    return (
  
    user && festival && <div>
        <NavBar festivalId = {festivalId}/>
        
        <h1>Informations sur les postes</h1>
        <div className='contenant'>        
          {(user.role==="ADMIN" || festival.valide) && 
            <Sidebar dataName="poste" onPosteClick={handlePosteClick} />}
          
          {(user.role==="ADMIN" || festival.valide) && selectedPosteId != null && 
            <PosteDetails posteId={selectedPosteId} idfestival={festivalId} user={user} />}
       </div>


        {(user.role==="BENEVOLE" && !festival.valide )&& 
          <div>Veuillez patienter, les informations du festival seront bientôt disponible</div>}
    </div>
    
    );

}
export default Infos