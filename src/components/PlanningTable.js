import Sidebar from "./Sidebar"
import { useEffect, useState } from "react"
import posteCreneauAPI from "../api/posteCreneauAPI";
import flexibleAPI from "../api/flexibleAPI";
import inscriptionAPI from "../api/inscriptionAPI";
import PlanningColumnUser from "./PlanningColumnUser";
import PlanningColumnAdmin from "./PlanningColumnAdmin";

const PlanningTable = ({ festival, user }) => {

 const [posteCreneau, setPosteCreneau] = useState(null);


 useEffect(() => {
  getPosteCreneau()
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

const inscrireBenevole=(idcreneau,idposte)=>{
  console.log("fonction callback à supprimer si pas besoin");
}

 return(
 <div className="planningTable"> 
  <h2>plannning du festival {festival.annee}</h2>
  <Sidebar dataName={"poste"} onPosteClick={()=>{}} />
  {posteCreneau &&
  Object.entries(posteCreneau).map(([date, horaires]) => (
    <div key={date} className="planningTable__date">
      <div>{date}</div>
      <div className="planningTable__date__creneau">
      {Object.entries(horaires).map( ([horaire, creneaux]) => (
        <div key={horaire} >
          <div>{horaire}</div>
           {/* NEW*/}
           {user.role==="BENEVOLE" ?
           <PlanningColumnUser festival={festival} user={user} creneaux={creneaux} onColonneChange={getPosteCreneau} />
           :
            <PlanningColumnAdmin festival={festival} user={user} creneaux={creneaux} />
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