import React, { useState } from "react";
import {formatDate} from '../utils/dateUtils';
import {TbAlertCircle} from 'react-icons/tb'

const CarteInscription = ({ inscriptions, onValider, user }) => {
  const [isValidationInProgress, setIsValidationInProgress] = useState(false);

  const handleValidation = async (inscription, valide) => {
    setIsValidationInProgress(true);
    
    // Appel à une fonction de validation avec l'ID de l'inscription et la valeur 'valide'
    await onValider(inscription.idinscription, valide);

  setIsValidationInProgress(false);
  };

  const formatHeure = (heure) => {
    return heure.split(":").slice(0, 2).join(":");
  }

  console.log("inscriptions",inscriptions)

  return (

    inscriptions && <div className='inscriptions'>
          {Object.entries(inscriptions).map(([jour, heures]) => (
          <div key={jour} className='inscriptions-jour'>
          <h3>{formatDate(jour)}</h3>
          {Object.entries(heures).map(([heureDebut, inscriptions]) => (
            <div key={heureDebut} className="inscription-creneau">
              <div className="bold">{`${formatHeure(inscriptions[0].Creneau.heure_debut)} - ${formatHeure(inscriptions[0].Creneau.heure_fin)}`}</div>
            
                {inscriptions.map((inscription) => (
                  <div className={`inscription-single ${inscription.valide === false ? "attente":"valide"}`}>
                    {inscription.valide === false && <div className='notif-error'><TbAlertCircle className='error-icon' />Inscription en attente de validation</div>}
                 
                      <div className="inscription-info"><span className="bold">{inscription.Poste.nom}</span>{inscription.idposte === 1 && ` (${inscription.Espace.nom})`}{user.role === "ADMIN" && `, occupé par : ${inscription.User.pseudo}`}</div>
                    

                      {inscription.valide === false && user.role !== "ADMIN" && (
                        <div className="boutons">
                          <button 
                            className="bouton1 cursor" 
                            onClick={() => handleValidation(inscription,true)} disabled={isValidationInProgress}
                          >
                            Comfirmer
                          </button>
                          <button 
                            className="bouton1 cursor" 
                            onClick={() => handleValidation(inscription,false)} disabled={isValidationInProgress}
                          >
                            Refuser
                          </button>
                        </div>
                      )}
                  </div>
                ))}
             
        
            </div>
          ))}
        </div>
      ))}
        </div>

   
  );
};

export default CarteInscription;
