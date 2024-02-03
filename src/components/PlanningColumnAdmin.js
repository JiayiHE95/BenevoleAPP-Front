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
    <>

      {creneaux.map((c, index) => (
        c.length > 1 ? (
          <div key={index} onClick={() => handleCreneauClick(c[0])}>
            <div 
              className={`planningTable__creneau cursor 
              ${Object.values(c).reduce((somme, posteCreneau) => somme + posteCreneau.capacite, 0) === listeInscription?.length ? 
                "estComplet" 
                : 
                listeInscription?.length> 0 && "estInscrit"}`
              }
            >
              {listeInscription ? `${listeInscription.length}/` : '0/'}
              {Object.values(c).reduce((somme, posteCreneau) => somme + posteCreneau.capacite, 0)}
            </div>
          </div>
        ) : (
          c.map((creneau, index) => (
            <div key={index} onClick={() => handleCreneauClick(creneau)}>
              <div 
                className={`planningTable__creneau cursor 
                ${ creneau.capacite_restante===0 ? "estComplet" : creneau.capacite - creneau.capacite_restante > 0 && "estInscrit"}`}
              >
                {creneau.capacite - creneau.capacite_restante}/{creneau.capacite}
              </div>
            </div>
          ))
        )
      ))}
    
      {popupVisible &&(
        <PopUpAdminCreneau creneau={selectedCreneau} closePopup={closePopup} user={user}/>
      )}



    </>
  );
};

export default PlanningColumnAdmin;

