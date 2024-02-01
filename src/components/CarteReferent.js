import React, { useState, useEffect } from "react";
import { useParams} from 'react-router-dom'
import supervisionAPI from "../api/supervisionAPI";
import userAPI from '../api/userAPI';
import { useJwt } from 'react-jwt';

const CarteReferent = ({ poste }) => {
  const [referents, setReferents] = useState([]);
  const [user, setUser] = useState(null);
  const { festivalId } = useParams();

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
      recuperationReferents();
    }
  }, [user]);




  const recuperationReferents = async () => {
    try {
      const data = {
        idposte: poste.idposte,
        idfestival: festivalId // Fix the variable name here
      }
      const response = await supervisionAPI.getReferentByPoste(data);
      console.log("referents: "+ response.data.referents)
      setReferents(response.data.referents);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className='carte'>
      <div>Poste: {poste.nom} </div>
      {referents.length > 0 ? (
        <div>
          <div>Référents:</div>
          <ul>
            {referents.map((referent, index) => (
              <li key={index}>{referent.User.pseudo}</li>
            ))}
          </ul>
        </div>
      ) : (
        <div>Aucun référent</div>
      )}
      

      <div> _________________________________ </div>
    </div>
  );
};

export default CarteReferent;
