import React, { useState, useEffect } from 'react';
import NavBar from '../../components/NavBar';
import { useParams } from 'react-router-dom';
import { useJwt } from 'react-jwt';
import CarteReferent from '../../components/CarteReferent';
import posteCreneauAPI from '../../api/posteCreneauAPI';
import supervisionAPI from '../../api/supervisionAPI';
import userAPI from '../../api/userAPI';
import UserSearch from '../../components/UserSearch';

const Referent = () => {
  const { festivalId } = useParams();
  const [postes, setPostes] = useState([]);
  const [user, setUser] = useState(null);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [validation, setValisation] = useState(false);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPoste, setSelectedPoste] = useState(null);
  const [selectedUserID, setSelectedUserID] = useState(null);

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
    // Fetch the list of postes when the component mounts
    if (user) {
      recuperationPostes();
    }
  }, [user]);

  useEffect(() => {
    // Fetch users based on search query
    if (searchQuery.trim() !== '') {
      fetchUsers();
    }
  }, [searchQuery]);

  const fetchUsers = async () => {
    try {
      const data = {
        searchQuery: searchQuery
      }
      const response = await userAPI.searchUsers(data);
      setUsers(response.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const recuperationPostes = async () => {
    try {
      const reponse = await posteCreneauAPI.getPosteByFestival(festivalId);
      console.log("postes ..........................", reponse.data.postes);
      setPostes(reponse.data.postes);
    } catch (error) {
      console.error('Error fetching postes:', error);
    }
  };

  const handleAddReferent = () => {
    setShowSearchBar((prevShowComponent) => !prevShowComponent);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handlePosteChange = (e) => {
    const selectedPosteId = e.target.value;
    setSelectedPoste(selectedPosteId);
  };

  const handleUserSelect = (user) => {
    // Vérifier si l'utilisateur est trouvé avant de mettre à jour l'état
    if (user) {
      setSelectedUserID(user.iduser);
      // Mettre à jour la recherche avec le pseudo de l'utilisateur sélectionné
      setSearchQuery(user.pseudo);
    } else {
      console.error('Utilisateur non trouvé dans la liste des utilisateurs.');
    }
  };

  const addReferent = async () => {
    // Vérifier si le poste et l'utilisateur sont sélectionnés
    if (selectedPoste && selectedUserID) {
      const data = {
        idposte: selectedPoste,
        idfestival: festivalId,
        iduser: selectedUserID
      };
      try {
        await supervisionAPI.addReferent(data);
        // Mise à jour dynamique des postes
        recuperationPostes();
        setValisation(true);
        setPostes([]);
        recuperationPostes();
        setValisation(false);
        setShowSearchBar(false)
      } catch (error) {
        console.error('Erreur lors de l\'ajout du référent:', error);
      }
    } else {
      console.error('Veuillez sélectionner un poste et un utilisateur');
    }
  };

  return (
    <div>
      <NavBar festivalId={festivalId} />
      <h1>Référents</h1>

      {postes.length > 0 ? (
        <div>
          {postes.map((poste, index) => (
            <CarteReferent key={index} poste={poste} />
          ))}
        </div>
      ) : (
        <p>Aucun poste</p>
      )}

      <button onClick={handleAddReferent}> {showSearchBar ? ' - ' : ' + '} </button>

      {/* Affiche le composant supplémentaire lorsque showSearchBar est true */}
      {showSearchBar && (
        <div>
          <label>Sélectionnez un poste :</label>
          <select onChange={handlePosteChange}>
            {/* Ajouter l'option de sélection par défaut */}
            <option value="" disabled selected hidden>Sélectionnez un poste</option>
  
            {/* Mappez la liste des postes pour créer les options du sélecteur */}
            {postes.map((poste) => (
              <option key={poste.idposte} value={poste.idposte}>
                {poste.nom}
              </option>
            ))}
          </select>
          
          {/* Composant indépendant pour la recherche d'utilisateur */}
          <UserSearch
            searchQuery={searchQuery}
            handleSearchChange={handleSearchChange}
            users={users}
            selectedUserID={selectedUserID ? selectedUserID.iduser : null}
            handleUserSelect={handleUserSelect}
          />
          
          
          {/* Bouton d'ajout */}
          <button onClick={addReferent}>Ajouter</button>
          {validation && <p>Le référent a été ajouté avec succès.</p>}
        </div>
      )}
    </div>
  );
};

export default Referent;
