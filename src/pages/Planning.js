import React, { useEffect, useState } from "react"
import {useParams,useNavigate, Navigate} from 'react-router-dom'
import { useJwt } from "react-jwt";
import NavBar from '../components/NavBar';
import festivalAPI from '../api/festivalAPI';
import userAPI from "../api/userAPI";
import PlanningTable from "../components/PlanningTable";
import { formatDate } from "../utils/dateUtils";

const Planning = () => {
  const { festivalId } = useParams();

 const [user, setUser] = useState(null);
 const [comfirmFestivalPopUp, setComfirmFestivalPopUp] = useState(false);
 const [festival, setFestival] = useState(null);


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
    festivalAPI.getCurrentFestival(festivalId).then((res) => {
      if(res.data.find){
       setFestival(res.data.festival)
    }
  })},[])

  const comfirmFestival=()=>{
    festivalAPI.updateFestival({idfestival:festival.idfestival, valide: true}).then((res)=>{
      if(res.data.festival){
       setFestival(res.data.festival)
      }
      setComfirmFestivalPopUp(false)
    })

  }


 return (
  isExpired ?
  <Navigate to={'/'} />
  :
  <div>
    <NavBar festivalId = {festivalId}/>
    {festival && <div>
      <h1>Plannning du festival {festival.annee}</h1>
      <h2 className="center-texte">Du {formatDate(festival.date_debut)} au {formatDate(festival.date_fin)}</h2>
      {user && user.role === "ADMIN" ?
      (festival ?
        <PlanningTable festival={festival} user={user}/>
        :
        <div>Il n'y a pas de festival en cours </div>
        )
        :
        (festival && festival.valide===true && user) ? 
        <PlanningTable festival={festival} user={user}/> 
        : 
        <div className="center-texte">Veuillez patienter, l'inscription pour les bénévoles n'est pas encore ouverte</div>
      }
    </div>
    }

  </div>
 )
}
export default Planning