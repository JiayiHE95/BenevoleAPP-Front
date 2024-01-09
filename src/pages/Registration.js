import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import { useParams } from 'react-router-dom';
import inscriptionAPI from '../api/inscriptionAPI';
import userAPI from '../api/userAPI';
import { useJwt } from 'react-jwt';

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

  return (
    <div>
      <NavBar festivalId={festivalId} />
      <h1>Registration</h1>
      <h2>Postes où je suis inscrit</h2>

      {inscriptions.length > 0 ? (
        <div>
          {inscriptions.map((inscription, index) => (
           <div className='carte'> 
                <div>Poste : {inscription.idposte}  </div>
                <div>Creneau : {inscription.idcreneau} </div>
                <div> _________________________________ </div>
           </div>
          ))}

        </div>

      ) : (
        <p>Aucune inscription</p>
      )}
    </div>
  );
};

export default Registration;
