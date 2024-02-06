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

  const [user, setUser] = useState(null)
  const [showliste, setShowListe] = useState(false)

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
    if (searchQuery.trim() !== '') {
      fetchUsers();
    }else{
      allInscriptions();
      setSelectedUser(null);
      setShowListe(false)
    }
  }, [searchQuery]);

  useEffect(() => {
    if (selectedUserID) {
      recuperationInscriptions();
    }
  }, [selectedUserID]);

  const allInscriptions = async () => {
    inscriptionAPI.getByFestival(festivalId).then((res)=>{
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
      const response = await userAPI.searchUsers(data);
      if(response.data.users.length>0){
        setShowListe(true)
      }
      setUsers(response.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const recuperationInscriptions = async () => {
    try {
      const response = await inscriptionAPI.getInscriptionOfUser(selectedUser.iduser, festivalId);
      const temp = trierInscriptions(response.data.inscriptions);
      setInscriptions(temp);
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
    setInscriptions([]); 
    setShowListe(false)
  };

  return (
    <div>
      <NavBar festivalId={festivalId}/>
      <h1>Gestion Inscription</h1>

      <div className='search'>

        <UserSearch
          searchQuery={searchQuery}
          handleSearchChange={handleUserSearchChange}
          users={users}
          selectedUserID={selectedUserID}
          handleUserSelect={handleUserSelect}
          showliste={showliste}
          />
      </div>

      {inscriptions && user && <div>
        {selectedUser && <h3 className='selectedUser'>Les inscriptions de {selectedUser.prenom} {selectedUser.nom} ({selectedUser.pseudo})</h3>}

         {Object.entries(inscriptions).length > 0 ? (
          <CarteInscription inscriptions={inscriptions} user={user} />
        ) : (
          <p className='selectedUser'>Aucune inscription trouvée.</p>
        )}
      </div>
      }
      
    </div>
  );
};

export default Inscriptions;
