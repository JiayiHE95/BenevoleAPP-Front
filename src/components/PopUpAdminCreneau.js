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
  const response = await inscriptionAPI.createInscription2(data);
  await flexibleAPI.deleteFlexibleUser(data2);
  getRegisteredPeople();
  getFlexiblePeople();
}

  
  return (
    <div className={`popup 
      ${ (listeZoneBenevole && selectedCreneau.idposte === 1 ) && selectedZones===null ? "popup__big" : "popup__middle"}`}
    >
      <h3>Gestion Inscription</h3>

      {(listeZoneBenevole && selectedCreneau.idposte === 1 ) && selectedZones===null ?
      
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
          <div>Zone selectionnée : </div>
          {Object.entries(selectedZones).map(([cle, zone], index) => (
            <div key={index}>{zone}</div>))}
        </div>
        
      }


      {selectedCreneau && (selectedCreneau.idposte!==1 || selectedZones) &&(
        <div>
          <div>Capacité: {selectedCreneau.capacite}</div>
          <div>Capacité Restante: {selectedCreneau.capacite_restante}</div>
          {/* Add more details as needed */}

          <h3> Bénévoles inscrits : </h3>
          <ul>
            {registeredPeople.map((person, index) => (
              <li key={index}>{person.iduser}</li>
              // Assuming each person has an 'iduser' property, adjust accordingly
            ))}
          </ul>

          <h3> Bénévoles flexibles : </h3>
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

      <div className="boutons">
        {selectedZones && <button onClick={()=>{setSelectedZones(null)}} className="bouton1 cursor"> Changer de zone</button>}
        <button className="bouton1 cursor" onClick={closePopup}>Fermer</button>
      </div>
   
    </div>
  );
};

export default PopUpAdminCreneau;
