import Sidebar from "./Sidebar"
import { useEffect, useState } from "react"
import posteCreneauAPI from "../api/posteCreneauAPI";
import flexibleAPI from "../api/flexibleAPI";
import inscriptionAPI from "../api/inscriptionAPI";
import PlanningColumnUser from "./PlanningColumnUser";
import PlanningColumnAdmin from "./PlanningColumnAdmin";
import ChangeHorairePopup from "./ChangeHorairePopup";

const PlanningTable = ({ festival, user }) => {

 const [posteCreneau, setPosteCreneau] = useState(null);
 const [changeHoraire, setChangeHoraire] = useState(false);
 const [clickedHoraire, setClickedHoraire] = useState(null);
  const [clickedDate, setClickedDate] = useState(null);
  const [listePoste, setListePoste] = useState(null);


 useEffect(() => {
  getPosteCreneau()
  posteCreneauAPI.getPosteByFestival(festival.idfestival).then((res) => {
      setListePoste(res.data.postes);
  })
 },[])

 const getPosteCreneau = () => {
  posteCreneauAPI.getPosteCreneauByFestival(festival.idfestival).then((res) => {
    if (res.data.find) {
      const posteCreneauTemp=res.data.posteCreneau
    
      const groupedPosteCreneaux = groupByDate(posteCreneauTemp);
      const  temp={}
      Object.values(groupedPosteCreneaux).forEach((subList) => {
        // Regrouper par idcreneau
        const groupedByIdCreneau = groupByIdCreneau(subList);
        const groupedByIdPoste = groupByIdPoste(groupedByIdCreneau);
        temp[subList[0].Creneau.jour]=groupedByIdPoste
        
       });
       console.log("planning",temp);
       setPosteCreneau(temp)
    }
   })
 }

 const groupByDate = (posteCreneauList) => {
  const groupedByDate = {};

  posteCreneauList.forEach((posteCreneau) => {
    const date = posteCreneau.Creneau.jour;
    if (!groupedByDate[date]) {
      groupedByDate[date] = [];
    }
    groupedByDate[date].push(posteCreneau);
  });

  return groupedByDate;
};

const groupByIdCreneau = (subList) => {
 const groupedByIdCreneau = {};
 subList.forEach((posteCreneau) => {
  
   const heureDebut = posteCreneau.Creneau.heure_debut.split(":").slice(0, 2).join(":");
   const heureFin = posteCreneau.Creneau.heure_fin.split(":").slice(0, 2).join(":");;

   const key = `${heureDebut}-${heureFin}`;

   if (!groupedByIdCreneau[key]) {
     groupedByIdCreneau[key] = [];
   }
   
   groupedByIdCreneau[key].push(posteCreneau);
   groupedByIdCreneau[key].sort((a, b) => a.idposte - b.idposte);
 });

 return groupedByIdCreneau;
};

const groupByIdPoste = (groupedByIdCreneau) => {
  const listeFinale = {};
 Object.entries(groupedByIdCreneau).forEach(([key, horaire]) => {
  let creneauxRegroupes = horaire.reduce((acc, creneau) => {
    let listeExistante = acc.find((groupe) => groupe[0].idposte === creneau.idposte);
    if (listeExistante) {
      listeExistante.push(creneau);
    } else {
      acc.push([creneau]);
    }
    return acc;
  }, []);

  if (!listeFinale[key]) {
    listeFinale[key] = [];
  }

  creneauxRegroupes.forEach((creneaux) => {
    listeFinale[key].push(creneaux);
  })
});

 return listeFinale
}

const handleClickHoraire=(date, horaire)=>{
  setClickedHoraire(horaire);
  setClickedDate(date);
  setChangeHoraire(true);
}


 return(
 <div className="planningTable"> 
  <h2>Plannning du festival {festival.annee} ({festival.date_debut} - {festival.date_fin})</h2>
  {posteCreneau &&
  Object.entries(posteCreneau).map(([date, horaires]) => (
    <div key={date} className="planningTable__date">
      <div className="date">{date}</div>
      <div className="planningTable__creneaux">
        <div className="planningTable__colonne">
          <div className="planningTable__creneauPoste"></div>
          {listePoste && listePoste.map((poste) => (
            <div key={poste.idposte} className="planningTable__creneauPoste">{poste.nom}</div>
          ))}
          <div className="planningTable__creneauPoste">Flexible</div>
        </div>
      {Object.entries(horaires).map( ([horaire, creneaux]) => (
        <div key={horaire} className="planningTable__colonne">
          
          <div 
            className="planningTable__creneauHoraire"
            onClick={()=>{user.role ==="ADMIN" && !festival.valide && handleClickHoraire(date, horaire)}}>
              {horaire}
          </div>

          {changeHoraire && clickedDate===date && clickedHoraire===horaire &&
             <ChangeHorairePopup 
              festival={festival} 
              horaire={horaire} 
              date={date} 
              setChangeHoraire={setChangeHoraire} 
              getPosteCreneau={getPosteCreneau}
             />}
           
            

           {user.role==="BENEVOLE" ?
           <PlanningColumnUser 
            festival={festival} 
            user={user} 
            creneaux={creneaux} 
            onColonneChange={getPosteCreneau} 
           />
           :
            <PlanningColumnAdmin festival={festival} user={user} creneaux={creneaux} getPosteCreneau={getPosteCreneau} />
           } 
        </div>
      ))}
      </div>
    </div>
  ))}

 
 </div>
 )


}
export default PlanningTable