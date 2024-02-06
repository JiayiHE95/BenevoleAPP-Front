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
  <>
     {creneaux.map((c, index) => (
      c.length>1?

      <div key={index} onClick={()=>{handleClickCreneau("jeu")}} >
        <div 
         className={`planningTable__creneau cursor ${estInscrit === c[0].Poste.idposte && "estInscrit"}`}
        > 
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
         <div className="popup popup__small">
          <h3>Attention</h3>
         {estFlexible?
         <div>Vous êtes déjà inscrit sur ce créneau en tant que benevole flexible, annule le statut flexible avant de vous inscrire </div>
          :
        estInscrit ? 
          <div>Vous êtes déjà inscrit sur ce créneau, allez à Inscription pour gérer vos inscriptions </div>
         :
          <div>Vous êtes déjà inscrit sur un des créneaux de cette horaire, allez à Inscription pour gérer vos inscriptions </div>
         }
         <div className="boutons">
          <div className="bouton1 cursor" onClick={()=>{handleClickCreneau(null)}}>Fermer</div>
         </div>
        </div>
        
         )
        }

      </div>
     
      :

      c.map((creneau, index) => (
       <div key={index} onClick={()=>{handleClickCreneau(creneau.Poste.idposte)}}>
       <div
          className={`planningTable__creneau cursor ${estInscrit === creneau.Poste.idposte && "estInscrit"}`}
        >
          {creneau.capacite - creneau.capacite_restante}/{creneau.capacite}
        </div>

      
        {inscriptionPopUp && selectedCreaneau===creneau.Poste.idposte &&
         (!estInscrit && !estFlexible ?   
          (creneau.capacite_restante>0?
          <div className="popup popup__small" onClick={(e) => e.stopPropagation()}>
            <h3>Inscription</h3>
           <div className="content__small">Etes-vous sûr(e) de vouloir vous inscrire à ce créneau ? </div>
           <div className="boutons">
            <div className="bouton1 cursor"  onClick={()=>{inscrireBenevole(creneau.Creneau.idcreneau, creneau.Poste.idposte)}}>Comfirmer</div>
            <div className="bouton1 cursor"  onClick={()=>{handleClickCreneau(null)}}>Annuler</div>
           </div>
          </div>
           :
           <div  className="popup popup__small">
            <h3>Attention</h3>
           <div className="content__small">Ce créneau est complet. Veuillez vous inscrire à un autre créneau</div>
           <div className="boutons">
            <div className="bouton1 cursor" onClick={()=>{handleClickCreneau(null)}}>Annuler</div>
           </div>
           </div>
          )
          :
         <div className="popup popup__small">
          <h3>Attention</h3>
          {estFlexible?
          <div className="content__small">Vous êtes déjà inscrit sur ce créneau en tant que benevole flexible, annule le statut flexible avant de vous inscrire </div>
           :
          selectedCreaneau===estInscrit? 
           <div className="content__small">Vous êtes déjà inscrit sur ce créneau, allez à Inscription pour gérer vos inscriptions </div>
          :
           <div className="content__small">Vous êtes déjà inscrit sur un des créneaux de cette horaire, allez à Inscription pour gérer vos inscriptions </div>
          }
          <div className="boutons">
            <div className="bouton1 cursor" onClick={()=>{handleClickCreneau(null)}}>Fermer</div>
          </div>
        </div>
          
         )
        }
       </div>
     
      ))
     ))}
   
   <div className="planningTable__checkbox"> 
    <input
    className="cursor"
      type="checkbox"
      id="est_flexible"
      name="est_flexible"
      checked={ estFlexible ? true : false}
      onClick={()=>{ setFlexiblePopUp(flexibePopUp? false: true)}}
    />
   </div>
   {flexibePopUp  && 
    (!estFlexible  ?
     (estInscrit?
      <div className="popup popup__small">
        <h3>Attention</h3>
       <div className="content__small">Vous êtes déjà inscrit sur un créneau, annuler l'inscription pour devenir bénévole flexible sur ce créneau </div>
       <div className="boutons">
       <div className="bouton1 cursor"  onClick={()=>{setFlexiblePopUp(false)}}>Fermer</div>
       </div>
      </div>
      :
    <div className="popup popup__small">
        <h3>Inscription</h3>
     <div className="content__small">Vous voulez devenir bénévole flexible ? Admin va bientôt vous attribuer un des poste de ce créneau</div>
     <div className="boutons">
      <div className="bouton1 cursor"  onClick={()=>{inscrireFlexible(creneaux[0][0].Creneau.idcreneau)}}>Comfirmer</div>
      <div className="bouton1 cursor"  onClick={()=>{setFlexiblePopUp(false)}}>Annuler</div>
     </div>
     </div>
      )
     :
      <div className="popup popup__small">
        <h3>Attention</h3>
       <div className="content__small">Etes-vous sûr d'annuler le statut flexible sur ce créneau ?</div>
       <div className="boutons">
        <div className="bouton1 cursor"  onClick={()=>{desinscrireFlexible(creneaux[0][0].Creneau.idcreneau)}}>Comfirmer</div>
        <div className="bouton1 cursor"  onClick={()=>{setFlexiblePopUp(false)}}>Annuler</div>
       </div>
     </div>
    )  
   }

  </>
 )

}

export default PlanningColumnUser;