import React, { useState } from "react";

const CarteInscription = ({ inscription, onValider }) => {
  const [isValidationInProgress, setIsValidationInProgress] = useState(false);

  const handleValidation = async (valide) => {
    setIsValidationInProgress(true);
    
    // Appel à une fonction de validation avec l'ID de l'inscription et la valeur 'valide'
    await onValider(inscription.idinscription, valide);

  setIsValidationInProgress(false);
  };

  console.log("inscription",inscription)

  return (
    <div className='carte'> 
       {` ${inscription.Poste.nom}`}
      {inscription.idposte === 1 && `${inscription.Espace.nom}`}
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
    </div>
  );
};

export default CarteInscription;
