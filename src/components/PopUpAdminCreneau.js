import { useEffect, useState } from "react";
import '../scss/components/planning.css';
import inscriptionAPI from "../api/inscriptionAPI";
import flexibleAPI from "../api/flexibleAPI";
import espaceAPI from "../api/espaceAPI";
import { useParams } from "react-router-dom";



const PopUpAdminCreneau = ({ selectedCreneau, closePopup, registerPerson }) => {
  const [registeredPeople, setRegisteredPeople] = useState([]);
  const [flexiblePeople, setFlexiblePeople] = useState([])
  const [isMounted, setIsMounted] = useState(true);
  const {festivalId}  = useParams();
  const [selectedZone, setSelectedZone] = useState(null);

  const [selectedZones,setSelectedZones]=useState({}) 
  const [listeZoneBenevole, setListeZoneBenevole]=useState(null)
  const [selectZoneAlerte, setSelectZoneAlert]=useState(false)
 
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
      const res = await espaceAPI.getSousZone(espace.idzonebenevole, festivalId,selectedCreneau.idcreneau);
      if (res.data.espaces.length>0) {
        temp[espace.nom]=res.data.espaces;
      } 
     })
    )
    
    setListeZoneBenevole(temp)
   }
  
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
                idposte: selectedCreneau.idposte
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

useEffect(() => {
    if (isMounted) {
      getRegisteredPeople();
      getFlexiblePeople();
      setIsMounted(false);
    }
  }, [isMounted, selectedCreneau]);



    const showww = (index) => {
      console.log(index);
      setSelectedZone(index)
      console.log(Object.entries(listeZoneBenevole)[index][1])
      
      
    
    }
  
  return (
    <div className="popup-container">
      <div className="popup-content">
      {!selectedZone ? (
      <div>
        {selectedCreneau && selectedCreneau.idposte === 1 && (
          <div>
            {listeZoneBenevole && (
              <div>
                {Object.entries(listeZoneBenevole).map(([cle, zone], index) => (
                  <button key={index} onClick={() => showww(index)}>
                    {cle}
                    {/* Your existing commented-out <select> element goes here */}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    ) : (
      <div>
        <select id={Object.entries(listeZoneBenevole)[selectedZone][0]} name={Object.entries(listeZoneBenevole)[selectedZone][0]} onChange={(e) => handleClickZone(e)} >
          <option value="" disabled selected>Choisir une zone</option>
          {Object.entries(Object.entries(listeZoneBenevole)[selectedZone][1]).map(([sousCle, souszone], index) => (
            Object.entries(listeZoneBenevole)[selectedZone][1].length <= 1 ? 
            
            <option key={index} value={souszone.idzonebenevole} disabled={souszone.PosteCreneaus[0]?.capacite_restante <= 0} >{souszone.nom} ({souszone.PosteCreneaus[0]?.capacite_restante}/{souszone.PosteCreneaus[0]?.capacite})</option>
              : 
              Object.entries(listeZoneBenevole)[index][0] !== souszone.nom && 
              <option key={index} value={souszone.idzonebenevole} disabled={souszone.PosteCreneaus[0]?.capacite_restante <= 0} >{souszone.nom} ({souszone.PosteCreneaus[0]?.capacite_restante}/{souszone.PosteCreneaus[0]?.capacite})</option>
              
            
          ))}
          </select>
      </div>
    )}













        {selectedCreneau && (selectedCreneau.idposte !== 1) &&(
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
