import React, { useEffect, useState } from 'react';
import posteAPI from '../api/posteAPI';
import { useNavigate } from 'react-router-dom';

const PosteDetails = ({ posteId, idfestival }) => {
  const [posteDetails, setPosteDetails] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
  const fetchPosteDetails = async () => {
      try {
        const response = await posteAPI.getPosteDetails(posteId)
        console.log('Détails du poste :', response.data.poste);
        setPosteDetails(response.data.poste);
      } catch (error) {
        console.error('Erreur lors de la récupération des détails du poste :', error);
      }
    };

   fetchPosteDetails();
  }, []);

  const handleButtonClick = () => {
    navigate(`/jeux-espaces/${idfestival}`);
  };
  


    return (
        <div>
            {posteDetails && (
                <p>poste details : id : {posteDetails.idposte}</p>
            )}

            {posteDetails && posteId === 1 && (
                <button onClick={handleButtonClick}> Voir les espaces de jeu</button>
            )}
        </div>
  );
  
};

export default PosteDetails;
