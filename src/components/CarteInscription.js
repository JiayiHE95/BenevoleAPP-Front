import React, { useState } from "react";

const CarteInscription = ({ inscription, onValider }) => {
  const [isValidationInProgress, setIsValidationInProgress] = useState(false);

  const handleValidation = async (valide) => {
    setIsValidationInProgress(true);
    
    // Appel à une fonction de validation avec l'ID de l'inscription et la valeur 'valide'
    await onValider(inscription.idinscription, valide);

  setIsValidationInProgress(false);
  };

  return (
    <div className='carte'> 
      <div>Poste : {inscription.idposte}</div>
      <div>Creneau : {inscription.idcreneau}</div>
      <div>Valide : {inscription.valide ? 'Oui' : 'Non'}</div>
      {inscription.valide === false && (
        <div>
          <button onClick={() => handleValidation(true)} disabled={isValidationInProgress}>
            Valider
          </button>
          <button onClick={() => handleValidation(false)} disabled={isValidationInProgress}>
            Refuser
          </button>
        </div>
      )}
      <div> _________________________________ </div>
    </div>
  );
};

export default CarteInscription;
