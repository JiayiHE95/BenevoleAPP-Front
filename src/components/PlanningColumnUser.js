import { useEffect, useState } from "react"
import flexibleAPI from "../api/flexibleAPI";
import inscriptionAPI from "../api/inscriptionAPI";
import InscriptionPopUp from "./InscriptionPopUp";

const PlanningColumnUser = ({ festival, user, creneaux, onColonneChange }) => {

 const [listeInscription, setListeInscription] = useState(null);
 const [flexibePopUp, setFlexiblePopUp]=useState(false)
 const [inscriptionPopUp, setInscriptionPopUp]=useState(false)
 const [estFlexible, setEstFlexible]=useState(false)
 const [estInscrit, setEstInscrit]=useState(null)
 const [selectedCreaneau, setSelectedCreaneau]=useState(null)

 useEffect(() => {
  fetchEstFlexible();
  fetchInscriptions(); 
 }, []);


 const fetchEstFlexible = async () => {
  const data = { iduser: user.iduser, idcreneau: creneaux[0][0].Creneau.idcreneau };
  const res = await flexibleAPI.getOneByUserAndCreneau(data);
  if (res.data.find) {
    setEstFlexible(true)
  } else {
    setEstFlexible(false)
 }
}

 const fetchInscriptions = async () => {
  const data = { idposte: 1, idcreneau: creneaux[0][0].idcreneau };

  const estinscriptemp=await inscriptionAPI.getInscriptionByUser(user.iduser,creneaux[0][0].idcreneau );
  if(estinscriptemp.data.find){
   setEstInscrit(estinscriptemp.data.inscriptions[0].idposte)
  }

  const res = await inscriptionAPI.getInscriptionByPosteCreneau(data);
      if (res.data.find) {
       setListeInscription(res.data.inscriptions)
      } 

 }


 const inscrireBenevole=(idcreneau,idposte)=>{
   const data={
     iduser:user.iduser, 
     idcreneau:idcreneau, 
     idposte:idposte,
     idfestival:festival.idfestival,
     idzonebenevole: null,
 }
   inscriptionAPI.createInscription(data).then((res)=>{
     if(res.data.created){
       console.log(res.data);
       fetchInscriptions();
       handleClickCreneau(null)
       onColonneChange()
     }
   })
 }

 const inscrireFlexible=(idcreneau)=>{
  flexibleAPI.createFlexibleUser({iduser:user.iduser, idcreneau:idcreneau}).then((res)=>{
    if(res.data.created){
      setFlexiblePopUp(false)
      setEstFlexible(true)
    }
  })
 }

 const desinscrireFlexible=(idcreneau)=>{
  flexibleAPI.deleteFlexibleUser({iduser:user.iduser, idcreneau:idcreneau}).then((res)=>{
    if(res.data.deleted){
      setFlexiblePopUp(false)
      setEstFlexible(false)
    }
  })
 }
 const handleClickCreneau = (idposte) => {
   setInscriptionPopUp(inscriptionPopUp? false: true)
   setSelectedCreaneau(idposte)
 }

 const popupStyle = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  width: '500px',
  transform: 'translate(-50%, -50%)',
  backgroundColor: 'white',
  padding: '20px',
  border: '1px solid #ccc',
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
  zIndex: '1000',
};


 return(
  <div>
   <div>
     {creneaux.map((c, index) => (
      c.length>1?

      <div key={index} onClick={()=>{handleClickCreneau("jeu")}}>
        <div style={{ color: estInscrit === c[0].Poste.idposte ? "blue" : "black" }}> 
       {listeInscription? listeInscription.length:0}/
        {Object.values(c).reduce((somme, posteCreneau) => somme + posteCreneau.capacite, 0)}
       </div>

       {inscriptionPopUp && selectedCreaneau==="jeu" &&
        (!estInscrit && !estFlexible ?   
         (listeInscription?.length !== Object.values(c).reduce((somme, posteCreneau) => somme + posteCreneau.capacite, 0) ?
         
         <InscriptionPopUp
            user={user}
            creneau={c}
            festival={festival}
            fetchInscriptions={fetchInscriptions}
            setInscriptionPopUp={setInscriptionPopUp}
       />
         
          :
          <div>
            <div style={popupStyle}>Le créneau est complet</div>
            <div onClick={()=>{handleClickCreneau(null)}}>Annuler</div>
          </div>
         )
         :
         <div style={popupStyle}>
         {estFlexible?
         <div>Vous êtes déjà inscrit sur ce créneau en tant que benevole flexible, annule le statut flexible avant de vous inscrire </div>
          :
         selectedCreaneau===estInscrit? 
          <div>Vous êtes déjà inscrit sur ce créneau, allez à Inscription pour gérer vos inscriptions </div>
         :
          <div>Vous êtes déjà inscrit sur un des créneaux de cette horaire, allez à Inscription pour gérer vos inscriptions </div>
         }
         <div onClick={()=>{handleClickCreneau(null)}}>Annuler</div>
        </div>
        
         )
        }

      </div>
     
      :

      c.map((creneau, index) => (
       <div key={index} onClick={()=>{handleClickCreneau(creneau.Poste.idposte)}}>
         <div style={{ color: estInscrit === creneau.Poste.idposte ? "blue" : "black" }}> 
         {creneau.capacite-creneau.capacite_restante}/{creneau.capacite}
         </div>
      
        {inscriptionPopUp && selectedCreaneau===creneau.Poste.idposte &&
         (!estInscrit && !estFlexible ?   
          (creneau.capacite_restante>0?
          <div style={popupStyle} onClick={(e) => e.stopPropagation()}>
           <div>Vous allez vous inscrire sur ce créneau</div>
           <div onClick={()=>{inscrireBenevole(creneau.Creneau.idcreneau, creneau.Poste.idposte)}}>Comfirmer</div>
           <div onClick={()=>{handleClickCreneau(null)}}>Annuler</div>
          </div>
           :
           <div>
           <div>Le créneau est complet</div>
           <div onClick={()=>{handleClickCreneau(null)}}>Annuler</div>
           </div>
          )
          :
         <div style={popupStyle}>
          {estFlexible?
          <div>Vous êtes déjà inscrit sur ce créneau en tant que benevole flexible, annule le statut flexible avant de vous inscrire </div>
           :
          selectedCreaneau===estInscrit? 
           <div>Vous êtes déjà inscrit sur ce créneau, allez à Inscription pour gérer vos inscriptions </div>
          :
           <div>Vous êtes déjà inscrit sur un des créneaux de cette horaire , allez à Inscription pour gérer vos inscriptions </div>
          }
          <div onClick={()=>{handleClickCreneau(null)}}>Annuler</div>
        </div>
          
         )
        }
       </div>
     
      ))
     ))}
   </div>
   
   <input
    type="checkbox"
    id="est_flexible"
    name="est_flexible"
    checked={ estFlexible ? true : false}
    onClick={()=>{ setFlexiblePopUp(flexibePopUp? false: true)}}
   />
   {flexibePopUp  && 
    (!estFlexible  ?
     (estInscrit?
      <div style={popupStyle}>
       <div>Vous êtes déjà inscrit sur un créneau, annuler l'inscription pour devenir flexible sur ce créneau </div>
       <div onClick={()=>{setFlexiblePopUp(false)}}>ok</div>
      </div>
      :
    <div style={popupStyle}>
     <div>Est ce que vous êtes flexible ? Vous ne pouvez plus choisir d'autres postes sur le même créneau</div>
      <div onClick={()=>{inscrireFlexible(creneaux[0][0].Creneau.idcreneau)}}>oui</div>
      <div onClick={()=>{setFlexiblePopUp(false)}}> non</div>
     </div>
      )
     :
      <div style={popupStyle}>
       <div>Ete-vous sûr d'annuler la statut flexible sur ce créneau?</div>
       <div onClick={()=>{desinscrireFlexible(creneaux[0][0].Creneau.idcreneau)}}>oui</div>
       <div onClick={()=>{setFlexiblePopUp(false)}}> non</div>
     </div>
    )  
   }

  </div>
 )

}

export default PlanningColumnUser;