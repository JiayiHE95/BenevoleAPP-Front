import { useEffect, useState } from "react";
import '../scss/components/planning.css';
import inscriptionAPI from "../api/inscriptionAPI";
import flexibleAPI from "../api/flexibleAPI";

const PopUpAdminCreneau = ({ selectedCreneau, closePopup, registerPerson }) => {
  const [registeredPeople, setRegisteredPeople] = useState([]);
  const [flexiblePeople, setFlexiblePeople] = useState([])
  const [isMounted, setIsMounted] = useState(true);

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
    
  
  return (
    <div className="popup-container">
      <div className="popup-content">
      {selectedCreneau && (selectedCreneau.idposte === 1) && (
          <div>
            la merde
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
