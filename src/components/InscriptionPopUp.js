import { useEffect, useState } from "react"
import inscriptionAPI from "../api/inscriptionAPI";
import espaceAPI from "../api/espaceAPI";

const InscriptionPopUp=({user,creneau,festival,fetchInscriptions, setInscriptionPopUp})=>{

 const [selectedZones,setSelectedZones]=useState({}) 
 const [listeZoneBenevole, setListeZoneBenevole]=useState(null)
 const [selectZoneAlerte, setSelectZoneAlert]=useState(false)
 const [comfirmerZone, setComfirmerZone]=useState(false)

 console.log("c dans inscription popop",creneau)

 useEffect(() => {
    fetchListeZoneBenevole();
 },[]);

 useEffect(() => {
  if(Object.keys(selectedZones).length===0){
    setComfirmerZone(false)
  }
 }, [selectedZones]);

 
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

   const sortedKeys = Object.keys(temp).sort();
   const sortedTemp = {};
   sortedKeys.forEach((key) => {
     sortedTemp[key] = temp[key];
   });

   setListeZoneBenevole(sortedTemp)
  }
}


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
       setComfirmerZone(false)
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
  <div className={`popup ${ comfirmerZone ? "popup__middle": "popup__big"}`} onClick={(e) => e.stopPropagation()}>
    <h3>Inscription</h3>
  {listeZoneBenevole && !comfirmerZone &&
   <div>
    {Object.entries(listeZoneBenevole).map(([cle, zone], index) => (
     <div key={index} className="zones">
      <div className="zonename">{cle} : </div>
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
  {Object.keys(selectedZones).length>0 && comfirmerZone &&
   <div>
    <div className="bold">Zones selectionnées : </div>
      {Object.entries(selectedZones).map(([cle, zone], index) => (
        <div className="zones">
        <div className="zonename" key={index}>{zone.split("(")[0]}</div>
        <div className="cursor" onClick={()=>{deleteZone(cle)}}>Delete</div>
        </div>
      ))}
      {selectZoneAlerte && <div>Vous devez choisir au moins une zone</div>}
  </div>
  }

  <div className="boutons">
    {comfirmerZone ?
    <>
    {<div className="bouton1 cursor" onClick={()=>{inscrireBenevole(creneau[0].Creneau.idcreneau, creneau[0].Poste.idposte)}}>Comfirmer</div>}
    <div className="bouton1 cursor" onClick={()=>{setComfirmerZone(false)}}>Liste des zones</div>
    </>
    :
    Object.keys(selectedZones).length>0 && 
      <div className="bouton1 cursor" onClick={()=>{setComfirmerZone(true)}}>Comfirmer Zones</div>}
    <div className="bouton1 cursor" onClick={()=>{setInscriptionPopUp(null) ; setComfirmerZone(false)}}>Annuler</div>
  </div>
 </div>
 )

}
export default InscriptionPopUp;
