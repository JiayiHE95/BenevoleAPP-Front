import React, { useEffect, useState } from "react";
import '../scss/components/planning.css'
import PopUpAdminCreneau from "./PopUpAdminCreneau";
import inscriptionAPI from "../api/inscriptionAPI";

const PlanningColumnAdmin = ({ creneaux, user, getPosteCreneau }) => {
  const [listeInscription, setListeInscription] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [selectedCreneau, setSelectedCreneau] = useState(null);

  
  useEffect(() => {
    fetchInscriptions(); 
  }, []);
  
  const fetchInscriptions = async () => {
    const data = { idposte: 1, idcreneau: creneaux[0][0].idcreneau };
    
    const res = await inscriptionAPI.getInscriptionByPosteCreneau(data);
    if (res.data.find) {
      setListeInscription(res.data.inscriptions)

    } 
  
   }

  const isCapacityFilled = (creneau) => {
    return creneau.capacite - creneau.capacite_restante === 0;
  };

  const handleCreneauClick = (creneau) => {
    setSelectedCreneau(creneau);
    setPopupVisible(true);
  };

  const closePopup = async() => {
    setSelectedCreneau(null);
    setPopupVisible(false);
    fetchInscriptions();
    getPosteCreneau();
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

      {popupVisible &&(
        <PopUpAdminCreneau creneau={selectedCreneau} closePopup={closePopup} user={user}/>
      )}



    </div>
  );
};

export default PlanningColumnAdmin;

