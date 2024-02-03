import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import CarteInscription from '../components/CarteInscription';
import UserSearch from '../components/UserSearch';// Importez le composant UserSearch
import userAPI from '../api/userAPI'; // Importez l'API des utilisateurs (si nécessaire)
import inscriptionAPI from '../api/inscriptionAPI';
import {useParams} from "react-router-dom"
import { useJwt } from 'react-jwt';
import {trierInscriptions} from '../utils/inscriptionUtils';

const Inscriptions = () => {
  const [inscriptions, setInscriptions] = useState();
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUserID, setSelectedUserID] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const {festivalId} = useParams();

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
    // Fetch users based on search query
    if (searchQuery.trim() !== '') {
      fetchUsers();
    }else{
      allInscriptions();
    }
  }, [searchQuery]);

  useEffect(() => {
    // Fetch inscriptions when selectedUserID changes
    if (selectedUserID) {
      recuperationInscriptions();
    }
  }, [selectedUserID]);

  const allInscriptions = async () => {
    inscriptionAPI.getByFestival(festivalId).then((res)=>{
      console.log(res.data.inscriptions)
      console.log("get all",res.data.inscriptions)
      const temp = trierInscriptions(res.data.inscriptions);
      setInscriptions(temp);
    })
  }

  useEffect(() => {
    allInscriptions();
  }
  , [])
  
  const fetchUsers = async () => {
    try {
      const data = {
        searchQuery: searchQuery
      };
      const response = await userAPI.searchUsers(data); // Assurez-vous d'avoir l'API des utilisateurs importée
      setUsers(response.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const recuperationInscriptions = async () => {
    try {
      console.log("selectedUser",selectedUser)
      const response = await inscriptionAPI.getInscriptionOfUser(selectedUser.iduser, festivalId);
      const temp = trierInscriptions(response.data.inscriptions);
      setInscriptions(temp);
    } catch (error) {
      console.error('Error fetching inscriptions:', error);
    }
  };

  const handleUserSearchChange = (e) => {
    console.log("teeeeeeeeest",e.target.value);
    setSearchQuery(e.target.value);
  };

  const handleUserSelect = (user) => {
    setSelectedUserID(user.iduser);
    setSelectedUser(user);
    setInscriptions([]); // Réinitialisez les inscriptions lorsqu'un nouvel utilisateur est sélectionné
  };

  return (
    <div>
      <NavBar festivalId={festivalId}/>
      <h1>Gestion Inscription test</h1>

      {/* Utilisez le composant UserSearch réutilisé */}
      <UserSearch
        searchQuery={searchQuery}
        handleSearchChange={handleUserSearchChange}
        users={users}
        selectedUserID={selectedUserID}
        handleUserSelect={handleUserSelect}
      />

      {inscriptions && user && <div>
        {selectedUser && <p>Les inscriptions de l'utilisateur {selectedUser.pseudo} :</p>}

         {Object.entries(inscriptions).length > 0 ? (
          <CarteInscription inscriptions={inscriptions} user={user} />
        ) : (
          <p>Aucune inscription trouvée pour cet utilisateur.</p>
        )}
      </div>
      }
      
    </div>
  );
};

export default Inscriptions;
