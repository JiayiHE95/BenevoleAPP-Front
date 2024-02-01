import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import CarteInscription from '../components/CarteInscription';
import UserSearch from '../components/UserSearch';// Importez le composant UserSearch
import userAPI from '../api/userAPI'; // Importez l'API des utilisateurs (si nécessaire)
import inscriptionAPI from '../api/inscriptionAPI';
import {useParams} from "react-router-dom"

const Inscriptions = () => {
  const [inscriptions, setInscriptions] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUserID, setSelectedUserID] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const {festivalId} = useParams();
  useEffect(() => {
    // Fetch users based on search query
    if (searchQuery.trim() !== '') {
      fetchUsers();
    }
  }, [searchQuery]);

  useEffect(() => {
    // Fetch inscriptions when selectedUserID changes
    if (selectedUserID) {
      recuperationInscriptions();
    }
  }, [selectedUserID]);
  
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
      const response = await inscriptionAPI.getInscriptionOfUser(selectedUser.iduser, festivalId);
      console.log("inscriptions ..........................", response.data.inscriptions);
      setInscriptions(response.data.inscriptions);
    } catch (error) {
      console.error('Error fetching inscriptions:', error);
    }
  };

  const handleUserSearchChange = (e) => {
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
      <h1>Mes Inscriptions</h1>

      {/* Utilisez le composant UserSearch réutilisé */}
      <UserSearch
        searchQuery={searchQuery}
        handleSearchChange={handleUserSearchChange}
        users={users}
        selectedUserID={selectedUserID}
        handleUserSelect={handleUserSelect}
      />

      {selectedUser && (
        <div>
          <p>Les inscriptions de l'utilisateur {selectedUser.pseudo} :</p>

          {inscriptions.length > 0 ? (
            <div>
              {inscriptions.map((inscription, index) => (
                <CarteInscription key={index} inscription={inscription} />
              ))}
            </div>
          ) : (
            <p>Aucune inscription trouvée pour cet utilisateur.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Inscriptions;
