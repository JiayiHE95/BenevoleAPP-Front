import React, { useEffect, useState } from "react";
import '../scss/components/planning.css';
import inscriptionAPI from "../api/inscriptionAPI";

const PopUpAdminCreneau = ({ selectedCreneau, closePopup, registerPerson }) => {
  const [registeredPeople, setRegisteredPeople] = useState([]);
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

useEffect(() => {
    if (isMounted) {
      getRegisteredPeople();
      setIsMounted(false);
    }
  }, [isMounted, selectedCreneau]);
    
  
  return (
    <div className="popup-container">
      <div className="popup-content">
        {selectedCreneau && (
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
          </div>
        )}
        <button onClick={closePopup}>Close Popup</button>
      </div>
    </div>
  );
};

export default PopUpAdminCreneau;
