import { useEffect, useState } from "react";
import '../scss/components/planning.css';
import inscriptionAPI from "../api/inscriptionAPI";
import flexibleAPI from "../api/flexibleAPI";
import espaceAPI from "../api/espaceAPI";
import { useParams } from "react-router-dom";
import posteCreneauAPI from "../api/posteCreneauAPI";



const PopUpAdminCreneau = ({ creneau, closePopup, user }) => {
  const [registeredPeople, setRegisteredPeople] = useState([]);
  const [flexiblePeople, setFlexiblePeople] = useState([])

  const {festivalId}  = useParams();
  const [selectedZone, setSelectedZone] = useState(null);

  const [selectedZones,setSelectedZones]=useState(null) 
  const [listeZoneBenevole, setListeZoneBenevole]=useState(null)

  const [selectedCreneau, setSelectedCreaneau]=useState(creneau)
 
  useEffect(() => {
     fetchListeZoneBenevole();
  },[]);

  useEffect(() => {
    if(selectedZones){
      const data={
        idcreneau: selectedCreneau.idcreneau,
        idzonebenevole: Object.keys(selectedZones)[0],
        idfestival: selectedCreneau.idfestival
      }
      posteCreneauAPI.getByZoneFestival(data).then((res)=>{
        console.log("res testttttttttttttttt",res.data)
        setSelectedCreaneau(res.data.posteCreneau)
        getRegisteredPeople();
      })
    }
  }, [selectedZones]);

  useEffect(() => {

      getRegisteredPeople();
      getFlexiblePeople();

    }
  , [selectedCreneau]);
 
  
  const fetchListeZoneBenevole = async () => {
   const res = await espaceAPI.getEspacesListe()
   if (res.data) {
    const espaces=res.data.espaces;
    const temp={}
    await Promise.all(
     espaces.map(async(espace)=>{
      const res = await espaceAPI.getSousZone(espace.idzonebenevole, festivalId,selectedCreneau.idcreneau);
      if (res.data.espaces.length>0) {
        temp[espace.nom]=res.data.espaces;
      } 
     })
    )
    
   const sortedKeys = Object.keys(temp).sort()
   const sortedTemp = {};
   sortedKeys.forEach((key) => {
     sortedTemp[key] = temp[key];
   });

   setListeZoneBenevole(sortedTemp)
   }
  
   }
   const handleClickZone = (e) => {
    const selectedOption = e.target.options[e.target.selectedIndex];
    const idzone = selectedOption.value;
    const zonename = selectedOption.text;
  
    let temp={}
    temp[idzone]=zonename
  
    setSelectedZones(temp)
   }



  const getRegisteredPeople = async () => {
    try {
        if (!selectedCreneau) {
            console.error("Selected Creneau is undefined or null");
            return;
        }
        const requestData = {
            creneau: {
                idfestival: selectedCreneau.idfestival,
                idcreneau: selectedCreneau.idcreneau,
                idposte: selectedCreneau.idposte,
                idzonebenevole: selectedCreneau.idzonebenevole
            },
            // Other data if needed
        };
        const response = await inscriptionAPI.getRegisteredPeopleByCreneau(requestData);
        setRegisteredPeople(response.data.inscriptions); // Mise à jour de l'état avec les données de la réponse
    } catch (error) {
        console.error("Error fetching registered people:", error);
    }
};

const getFlexiblePeople = async () => {
  try {
      if (!selectedCreneau) {
          console.error("Selected Creneau is undefined or null");
          return;
      }
    
      const response = await flexibleAPI.getFlexibleUserByCreneau(selectedCreneau.idcreneau);
      setFlexiblePeople(response.data.flexibleUserCreneau); // Mise à jour de l'état avec les données de la réponse
  } catch (error) {
      console.error("Error fetching registered people:", error);
  }
};

const handleAddPerson= async (iduser) =>{
  const data = {
    iduser: iduser,
    idcreneau: selectedCreneau.idcreneau,
    idposte: selectedCreneau.idposte,
    idfestival: selectedCreneau.idfestival,
    idzonebenevole: selectedCreneau.idzonebenevole
  }
  const data2 = {
    idfestival: selectedCreneau.idfestival,
    iduser: iduser,
    idcreneau: selectedCreneau.idcreneau,
  }
  console.log("before");
  const response = await inscriptionAPI.createInscription2(data);
  await flexibleAPI.deleteFlexibleUser(data2);
  getRegisteredPeople();
  getFlexiblePeople();
}





    const showww = (index) => {
      console.log(index);
      setSelectedZone(index)
      console.log(Object.entries(listeZoneBenevole)[index][1])  
    }

  
  return (
    <div className="popup-container">
      <div className="popup-content">
       {/*commmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmment */} 


    {/*commmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmment */} 




  {(listeZoneBenevole && selectedCreneau.idposte === 1 ) && selectedZones===null ?
  

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
           
          >
            {souszone.nom} ({souszone.PosteCreneaus[0]?.capacite - souszone.PosteCreneaus[0]?.capacite_restante}/{souszone.PosteCreneaus[0]?.capacite})
          </option>
          : 
          cle !== souszone.nom && 
          <option 
            key={index} 
            value={souszone.idzonebenevole} 
      
          >
            {souszone.nom} ({souszone.PosteCreneaus[0]?.capacite - souszone.PosteCreneaus[0]?.capacite_restante}/{souszone.PosteCreneaus[0]?.capacite})
          </option>
            
        ))}
      </select>
     </div>
   ))}
  </div>

  :

  selectedZones && 
    <div>
    <div>Zones selectionnées : </div>
    {Object.entries(selectedZones).map(([cle, zone], index) => (
      <div key={index}>{zone}</div>
      ))}
      <div onClick={()=>{setSelectedZones(null)}}>Retournez à la liste des zones</div>
      </div>
    
    
  }


        {selectedCreneau && (selectedCreneau.idposte!==1 || selectedZones) &&(
          <div>
            <h3>Details for Creneau {selectedCreneau.id}</h3>
            <p>Capacité: {selectedCreneau.capacite}</p>
            <p>Capacité Restante: {selectedCreneau.capacite_restante}</p>
            {/* Add more details as needed */}

            <h3> People registered </h3>
            <ul>
              {registeredPeople.map((person, index) => (
                <li key={index}>{person.iduser}</li>
                // Assuming each person has an 'iduser' property, adjust accordingly
              ))}
            </ul>

            <h3> People available for this slot</h3>
            <ul>
              {flexiblePeople.map((person, index) => (
                <li key={index}>
                {person.iduser}
                <button onClick={() => handleAddPerson(person.iduser)}>Ajouter</button>
              </li>
                // Assuming each person has an 'iduser' property, adjust accordingly
              ))}
            </ul>
          </div>
        )}
        <button onClick={closePopup}>Close Popup</button>
      </div>
    </div>
  );
};

export default PopUpAdminCreneau;
