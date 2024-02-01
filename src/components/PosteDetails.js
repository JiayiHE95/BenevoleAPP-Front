import React, { useEffect, useState } from 'react';
import posteAPI from '../api/posteAPI';
import { useNavigate } from 'react-router-dom';
import supervisionAPI from '../api/supervisionAPI';

const PosteDetails = ({ posteId, idfestival, user }) => {
  const [posteDetails, setPosteDetails] = useState(null);
  const [descriptions, setDescriptions] = useState(null); 
  const [modeEdition, setModeEdition] = useState(false);
  const [newDescription, setNewDescription] = useState(null);

  const navigate = useNavigate();
  const [referents, setReferents] = useState(null);

  useEffect(() => {
  const fetchPosteDetails = async () => {
      try {
        const response = await posteAPI.getPosteDetails(posteId)
        console.log('Détails du poste :', response.data.poste);
        setPosteDetails(response.data.poste);
        setDescriptions(
          response.data.poste.description.split("\n").map((phrase) => phrase.replace(/\s*$/g, ''))
        )
        setNewDescription(response.data.poste.description);
      } catch (error) {
        console.error('Erreur lors de la récupération des détails du poste :', error);
      }
    };

   fetchPosteDetails();


   const recuperationReferents = async () => {
    try {
      const data = {
        idposte: posteId,
        idfestival: idfestival // Fix the variable name here
      }
      const response = await supervisionAPI.getReferentByPoste(data);
      console.log("referents: "+ response.data.referents)
      setReferents(response.data.referents);
    } catch (error) {
      console.log(error);
    }
  }
  recuperationReferents();

  }, [posteId]);


  const handleButtonClick = () => {
    navigate(`/jeux-espaces/${idfestival}`);
  };

  const updateDescriptions = async () => {
    try {
      const data = {
        idposte: posteId,
        description: newDescription
      }
      const response = await posteAPI.updatePoste(data);
      console.log(response.data.poste);
      setPosteDetails(response.data.poste);
      setDescriptions(
        response.data.poste.description.split("\n").map((phrase) => phrase.replace(/\s*$/g, ''))
      )
      setModeEdition(false);
    } catch (error) {
      console.log(error);
    }
  }

    return (
        <div>
            {posteDetails &&referents&& (
              <div>
                <div>Présentation du poste :</div>
                {!modeEdition && user.role==="ADMIN" && (
                  <button onClick={()=>{setModeEdition(true)}}>Modifier les descriptions</button>
                )}
                {(modeEdition && user.role==="ADMIN") ? (
                  // Mode édition : permet la modification des descriptions
                  <textarea
                  value={newDescription}
                  onChange={(e) => {
                    setNewDescription(e.target.value);
                  }}
                />
                ) : (
                  // Mode non édition : affiche les descriptions
                  descriptions.map((description, index) => (
                    <div key={index}>{description}</div>
                  ))
                )}
                {(modeEdition && user.role==="ADMIN") && 
                <>
                <button onClick={()=>{updateDescriptions()}}>Enregistrer</button>
                <button onClick={()=>{setModeEdition(false)}}>Annuler</button>
                </>
                  // Bouton pour sauvegarder les modifications
                }
                <div>Référent :</div>
                {user.role==="ADMIN" && 
                  <button onClick={()=>{navigate(`/referents/${idfestival}`)}}>Ajouter un référent</button>}
                {referents.length > 0 ? (
                  referents.map((referent, index) => (
                    <div key={index}>
                      pseudo : {referent.User.pseudo} | tel : {referent.User.tel}
                    </div>
                  ))
                ) : (
                  <div>Aucun référent</div>
                )}

             </div>
            )}

            {posteDetails && posteId === 1 && (
                <button onClick={handleButtonClick}> Voir les espaces de jeu</button>
            )}
        </div>
  );
  
};

export default PosteDetails;
