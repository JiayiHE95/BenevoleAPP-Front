import Sidebar from "./Sidebar"
import { useEffect, useState } from "react"
import posteCreneauAPI from "../api/posteCreneauAPI";
import flexibleAPI from "../api/flexibleAPI";
import inscriptionAPI from "../api/inscriptionAPI";
import espaceAPI from "../api/espaceAPI";

const InscriptionPopUp=({user,creneau,festival,fetchInscriptions, setInscriptionPopUp})=>{

 const [selectedZones,setSelectedZones]=useState({}) 
 const [listeZoneBenevole, setListeZoneBenevole]=useState(null)
 const [selectZoneAlerte, setSelectZoneAlert]=useState(false)

 console.log("c dans inscription popop",creneau)

 useEffect(() => {
    fetchListeZoneBenevole();
 },[]);

 
 const fetchListeZoneBenevole = async () => {
  const res = await espaceAPI.getEspacesListe()
  if (res.data) {
   const espaces=res.data.espaces;
   const temp={}
   await Promise.all(
    espaces.map(async(espace)=>{
     const res = await espaceAPI.getSousZone(espace.idzonebenevole, festival.idfestival,creneau[0].Creneau.idcreneau);
     if (res.data.espaces.length>0) {
       temp[espace.nom]=res.data.espaces;
     } 
    })
   )
   setListeZoneBenevole(temp)
  }
 
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

const inscrireBenevole=(idcreneau,idposte)=>{
  if(idposte===1 && Object.keys(selectedZones).length===0){
    setSelectZoneAlert(true)
   return
  }
   const data={
     iduser:user.iduser, 
     idcreneau:idcreneau, 
     idposte:idposte,
     idfestival:festival.idfestival,
     idzonebenevole: idposte===1 ?selectedZones:null,
 }
   inscriptionAPI.createInscription(data).then((res)=>{
     if(res.data.created){
       console.log(res.data);
       fetchInscriptions();
       setInscriptionPopUp(null)
     }
   })
 }


const handleClickZone = (e) => {
  const selectedOption = e.target.options[e.target.selectedIndex];
  const idzone = selectedOption.value;
  const zonename = selectedOption.text;

  const temp={...selectedZones}
  if(temp[idzone]){
    delete temp[idzone]
  }else{
    temp[idzone]=zonename
  }
  setSelectedZones(temp)
  setSelectZoneAlert(false)
 }

 const deleteZone=(idzone)=>{ 
  const temp={...selectedZones}
  delete temp[idzone]
  setSelectedZones(temp)
 }

 return(
  <div style={popupStyle} onClick={(e) => e.stopPropagation()}>
  <div>Vous allez vous inscrire sur ce créneau</div>
  {listeZoneBenevole &&
   <div>
    {Object.entries(listeZoneBenevole).map(([cle, zone], index) => (
     <div key={index}>
      {cle} :
      <select id={cle} name={cle} onChange={(e) => handleClickZone(e)} >
        <option value="" disabled selected>Choisir une zone</option>
        {Object.entries(zone).map(([sousCle, souszone], index) => (
          zone.length <= 1 ? 
           
          <option 
            key={index} 
            value={souszone.idzonebenevole} 
            disabled={souszone.PosteCreneaus[0]?.capacite_restante <= 0} 
          >
            {souszone.nom} ({souszone.PosteCreneaus[0]?.capacite - souszone.PosteCreneaus[0]?.capacite_restante}/{souszone.PosteCreneaus[0]?.capacite})
          </option>
          : 
          cle !== souszone.nom && 
          <option 
            key={index} 
            value={souszone.idzonebenevole} 
            disabled={souszone.PosteCreneaus[0]?.capacite_restante <= 0} 
          >
            {souszone.nom} ({souszone.PosteCreneaus[0]?.capacite - souszone.PosteCreneaus[0]?.capacite_restante}/{souszone.PosteCreneaus[0]?.capacite})
          </option>
            
        ))}
      </select>
     </div>
   ))}
  </div>

 }
  {Object.keys(selectedZones).length>0 && 
   <div>
    <div>Zones selectionnées : </div>
      {Object.entries(selectedZones).map(([cle, zone], index) => (
        <div>
        <div key={index}>{zone}</div>
        <div onClick={()=>{deleteZone(cle)}}>delete</div>
        </div>
      ))}
  </div>
  }

  {selectZoneAlerte && <div>Vous devez choisir au moins une zone</div>}
  <div onClick={()=>{inscrireBenevole(creneau[0].Creneau.idcreneau, creneau[0].Poste.idposte)}}>Comfirmer</div>
  <div onClick={()=>{setInscriptionPopUp(null)}}>Annuler</div>
 </div>
 )

}
export default InscriptionPopUp;
