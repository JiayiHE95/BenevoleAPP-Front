import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import { useParams } from 'react-router-dom';
import inscriptionAPI from '../api/inscriptionAPI';
import userAPI from '../api/userAPI';
import { useJwt } from 'react-jwt';
import CarteInscription from '../components/CarteInscription';

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
      console.log("inscriptions ..........................", response.data.inscriptions);
      setInscriptions(response.data.inscriptions);
    } catch (error) {
      console.error('Error fetching inscriptions:', error);
    }
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
      <h1>Registration</h1>
      <h2>Postes où je suis inscrit</h2>

      {inscriptions.length > 0 ? (
        <div>
          {inscriptions.map((inscription, index) => (
            <CarteInscription
              key={index}
              inscription={inscription}
              onValider={handleValidation}
            />
          ))}
        </div>
      ) : (
        <p>Aucune inscription</p>
      )}
    </div>
  );
};

export default Registration;
