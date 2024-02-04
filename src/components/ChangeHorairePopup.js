import React, { useState } from 'react';
import posteCreneauAPI from '../api/posteCreneauAPI';

const ChangeHorairePopup = ({festival,horaire, date, setChangeHoraire, getPosteCreneau}) => {

 const [heure_debut, setHeure_debut] = useState(horaire.split('-')[0])
 const [heure_fin, setHeure_fin] = useState(horaire.split('-')[1])

 const [newHeure_debut, setNewHeure_debut] = useState(horaire.split('-')[0])
 const [newHeure_fin, setNewHeure_fin] = useState(horaire.split('-')[1])

 const handleChangeHoraire=()=>{
  const data={
   idfestival:festival.idfestival,
   jour:date,
   heure_debut:heure_debut,
   heure_fin:heure_fin,
   newHeure_debut:newHeure_debut,
   newHeure_fin:newHeure_fin,
  }
  posteCreneauAPI.updateCreneauHoraire(data).then((resp)=>{
   console.log(resp.data);
   getPosteCreneau()
   setChangeHoraire(false)
  })
 
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
  <div  className='popup popup__small'>
   <h3>Changer l'horaire</h3>
   <div className="content__small">
    <div className='heure'>
      <div>Heure de début</div>
      <input className='cursor' type="time" value={newHeure_debut} onChange={(e)=>setNewHeure_debut(e.target.value)}/>
    </div>
    <div className='heure'>
      <div>Heure de fin</div>
      <input className='cursor' type="time" value={newHeure_fin} onChange={(e)=>setNewHeure_fin(e.target.value)}/>
    </div>
   </div>
   <div className='boutons'>
    <div className='bouton1 cursor' onClick={()=>handleChangeHoraire()}>Valider</div>
    <div className='bouton1 cursor' onClick={()=>setChangeHoraire(false)}>Annuler</div>
   </div>

  </div>
 )

}
export default ChangeHorairePopup;