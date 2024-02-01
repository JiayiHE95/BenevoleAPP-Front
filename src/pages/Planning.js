import React, { useEffect, useState } from "react"
import {useParams,useNavigate, Navigate} from 'react-router-dom'
import { useJwt } from "react-jwt";
import NavBar from '../components/NavBar';
import festivalAPI from '../api/festivalAPI';
import userAPI from "../api/userAPI";
import PlanningTable from "../components/PlanningTable";

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
       console.log(res.data.festival)
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
  isExpired  ?
  <Navigate to={'/'} />
  :
  <div>
  <NavBar festivalId = {festivalId}/>
   <h1>Planning</h1>
   {user && user.role === "ADMIN" ?
    (festival?
     <div>
     {festival.valide===false && <div onClick={()=>setComfirmFestivalPopUp(true)}>Comfirmer la date et les créneaux du festival</div>}
     {comfirmFestivalPopUp &&
      <div>
      <div>Attention, cette action est irréversible. Les dates et les creneaux seront bloqué pour que les bénévoles puissent s'inscrire, mais vous pouvez toujours ajouster le nombre de bénévole pour chaque creneau</div>
      <div onClick={()=>setComfirmFestivalPopUp(false)}>Annuler</div>
      <div onClick={()=>comfirmFestival()}>Comfirmer</div>
      </div>
     }
     <PlanningTable festival={festival} user={user}/>
     </div>
     :
     <div>Il n'y a pas de festival en cours </div>
    )
    :
    (festival && festival.valide===true &&user) ? <PlanningTable festival={festival} user={user}/> : <div>Veuillez patienter, l'inscription pour les bénévoles n'est pas encore ouverte</div>
    }

  </div>
 )
}
export default Planning