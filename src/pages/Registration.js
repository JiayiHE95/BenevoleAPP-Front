import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import { useParams } from 'react-router-dom';
import inscriptionAPI from '../api/inscriptionAPI';
import userAPI from '../api/userAPI';
import { useJwt } from 'react-jwt';
import CarteInscription from '../components/CarteInscription';
import {formatDate} from '../utils/dateUtils';

const Registration = () => {
  const { festivalId } = useParams();
  const [inscriptions, setInscriptions] = useState([]);
  const [user, setUser] = useState(null);

  const token = localStorage.getItem('accessToken');
  const { decodedToken, isExpired } = useJwt(token ? token : "");

  useEffect(() => {
    if (decodedToken && decodedToken.iduser) {
      userAPI.getUserById(decodedToken.iduser).then((res) => {
        setUser(res.data.user);
      });
    }
  }, [decodedToken]);

  useEffect(() => {
    // Fetch the list of inscriptions when the component mounts
    if (user) {
      recuperationInscriptions();
    }
  }, [user]);

  const recuperationInscriptions = async () => {
    try {
      const response = await inscriptionAPI.getInscriptionOfUser(user.iduser, festivalId);
      const temp = trierInscriptions(response.data.inscriptions);
      console.log("inscriptions triées ..........................", temp);
      setInscriptions(temp);
    } catch (error) {
      console.error('Error fetching inscriptions:', error);
    }
  };

  const trierInscriptions = (inscriptions) => {
    // Trier par jour (ordre croissant)
    const inscriptionsTrie = [...inscriptions].sort((a, b) => {
      return a.Creneau.jour.localeCompare(b.Creneau.jour);
    });
  
    // Créer un objet où chaque clé est un jour et la valeur est un tableau d'inscriptions pour ce jour
    const inscriptionsParJour = inscriptionsTrie.reduce((acc, inscription) => {
      const jour = inscription.Creneau.jour;
      if (!acc[jour]) {
        acc[jour] = [];
      }
      acc[jour].push(inscription);
      return acc;
    }, {});
  
    // Trier les inscriptions de chaque jour par heure_debut (ordre croissant)
    for (const jour in inscriptionsParJour) {
      inscriptionsParJour[jour].sort((a, b) => {
        return a.Creneau.heure_debut.localeCompare(b.Creneau.heure_debut);
      });
    }
  
    // Regrouper les inscriptions ayant le même Creneau.heure_debut
    const inscriptionsRegroupees = {};
    for (const jour in inscriptionsParJour) {
      inscriptionsRegroupees[jour] = inscriptionsParJour[jour].reduce((acc, inscription) => {
        const heureDebut = inscription.Creneau.heure_debut;
        if (!acc[heureDebut]) {
          acc[heureDebut] = [];
        }
        acc[heureDebut].push(inscription);
        return acc;
      }, {});
    }
  
    return inscriptionsRegroupees;
  };
  

  const handleValidation = async (idinscription, valide) => {
    const data = {
      idinscription: idinscription,
      valide: valide
    };
  
    try {
      await inscriptionAPI.inscriptionValisation(data);
      recuperationInscriptions();
    } catch (error) {
      console.error('Error handling validation:', error);
      // Consider providing user-friendly feedback or a global error handling solution
    }
  };
  

  return (
    <div>
      <NavBar festivalId={festivalId} />
      <h1>Mes inscriptions</h1>

      {Object.entries(inscriptions).length > 0 ? (
        <CarteInscription 
          inscriptions={inscriptions} 
          onValider={handleValidation} 
          user={user}/>
      ) : (
        
        <div className='center-texte'>Aucune inscription trouvée </div>
      )}
    </div>
  );
};

export default Registration;
