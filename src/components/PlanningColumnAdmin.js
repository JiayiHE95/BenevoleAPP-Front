import React, { useEffect, useState } from "react";
import '../scss/components/planning.css'
import PopUpAdminCreneau from "./PopUpAdminCreneau";

const PlanningColumnAdmin = ({ creneaux }) => {
  const [listeInscription, setListeInscription] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [selectedCreneau, setSelectedCreneau] = useState(null);
  

  

  const isCapacityFilled = (creneau) => {
    return creneau.capacite - creneau.capacite_restante === 0;
  };

  const handleCreneauClick = (creneau) => {
    setSelectedCreneau(creneau);
    setPopupVisible(true);
  };

  const closePopup = () => {
    setSelectedCreneau(null);
    setPopupVisible(false);
  };

  return (
    <div>
      <div>
        {creneaux.map((c, index) => (
          c.length > 1 ? (
            <div key={index} onClick={() => handleCreneauClick(c[0])}>
              <div style={{ color: isCapacityFilled(c[0]) ? "red" : "green" }}>
                {listeInscription ? `${listeInscription.length}/` : '0/'}
                {Object.values(c).reduce((somme, posteCreneau) => somme + posteCreneau.capacite, 0)}
              </div>
            </div>
          ) : (
            c.map((creneau, index) => (
              <div key={index} onClick={() => handleCreneauClick(creneau)}>
                <div style={{ color: isCapacityFilled(creneau) ? "red" : "green" }}>
                  {creneau.capacite - creneau.capacite_restante}/{creneau.capacite}
                </div>
              </div>
            ))
          )
        ))}
      </div>

      {popupVisible && (selectedCreneau.idposte !== 1)&&(
        <PopUpAdminCreneau selectedCreneau={selectedCreneau} closePopup={closePopup} />
      )}

      {popupVisible && (selectedCreneau.idposte === 1)&&(
        <PopUpAdminCreneau selectedCreneau={selectedCreneau} closePopup={closePopup} />
      )}

    </div>
  );
};

export default PlanningColumnAdmin;

