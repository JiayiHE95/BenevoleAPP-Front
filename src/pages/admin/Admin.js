import NavBarProfil from '../../components/NavbarProfil';
import React, { useEffect, useState } from "react"
import {useParams,useNavigate, Navigate} from 'react-router-dom'
import { useJwt } from "react-jwt";
import Profil from "../../components/Profil";
import userAPI from "../../api/userAPI";
import FileUploader from "../../components/FileUploader";

import FestivalInfo from "../../components/FestivalInfo"
import festivalAPI from '../../api/festivalAPI';
import NewFestival from './NewFestival';

const Admin=()=>{
  const [user, setUser] = useState(null);
  const [festivals, setFestivals] = useState(null);
  const [currentfestivals, setCurrentFestivals] = useState(null);
  const [pastFestivals, setPastFestivals] = useState(null);
  const navigate=useNavigate()

  const token=localStorage.getItem('accessToken')
  const { decodedToken,isExpired } = useJwt(token?token:"");

  useEffect(() => {
    if (decodedToken) {
      userAPI.getUserById(decodedToken.iduser).then((res) => {
        setUser(res.data.user);
      });
    }
  }, [decodedToken]);

  useEffect(() => {
    console.log()
    festivalAPI.getAllFestival().then((res) => {
      if(res.data.find){
       setFestivals(res.data.festivals)
    }
  })},[])

  
  useEffect(() => {
    if (festivals) {
      const currentDate = new Date();
        const currentFestivals = festivals
          .filter((festival) => new Date(festival.date_fin) >= currentDate)
        setCurrentFestivals(currentFestivals);
  
        const pastFestivals = festivals
          .filter((festival) => new Date(festival.date_fin) < currentDate)
          setPastFestivals(pastFestivals);
    }

  },[festivals])


  return (
    isExpired || (user && user.role !=="ADMIN") ? <Navigate to={'/'} />
    :
    <div className="Admin">
      <NavBarProfil />
      <h1>Admin</h1>
      <div className='Admin-main'>
        <div className='boutons'>
        <div 
          className="bouton2 cursor"  
          onClick={() => { navigate("/new-festival") }}
        >Ajouter un festival</div>
        </div>

        <div>
          <h2>Festival en cours</h2>
          {currentfestivals && currentfestivals.length > 0 ? (
            <div>
              <div className='festivals'>

                {currentfestivals.map((festival) => (
                  <FestivalInfo key={festival.idfestival} festival={festival} />
                  ))}
              </div>
            </div>
          ) : (
            <div>Aucun festival en cours</div>
          )}

          <h2>Festivals précédents</h2>
          {pastFestivals && pastFestivals.length > 0 ? (
            <div>
              {pastFestivals.map((festival) => (
                <FestivalInfo key={festival.idfestival} festival={festival} />
              ))}
            </div>
          ) : (
            <div>Aucun festival précédent</div>
          )}
        </div>
      </div>

    </div>
    
  )
}
export default Admin;