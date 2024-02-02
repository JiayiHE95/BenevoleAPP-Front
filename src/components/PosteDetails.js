import React, { useEffect, useState } from 'react';
import posteAPI from '../api/posteAPI';
import { useNavigate } from 'react-router-dom';
import supervisionAPI from '../api/supervisionAPI';
import UserSearch from './UserSearch';
import userAPI from '../api/userAPI';


const PosteDetails = ({ posteId, idfestival, user }) => {

  const [posteDetails, setPosteDetails] = useState(null);
  const [descriptions, setDescriptions] = useState(null);
  const [modeEdition, setModeEdition] = useState(false);
  const [newDescription, setNewDescription] = useState(null);

  const [showSearchBar, setShowSearchBar] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [referents, setReferents] = useState(null);
  const [selectedUserID, setSelectedUserID] = useState(null);
  const [validation, setValidation] = useState(false);

  const navigate = useNavigate();


  const fetchPosteDetails = async () => {
        try {
          const response = await posteAPI.getPosteDetails(posteId);
          console.log('Détails du poste :', response.data.poste);
          setPosteDetails(response.data.poste);
          setDescriptions(
            response.data.poste.description.split("\n").map((phrase) => phrase.replace(/\s*$/g, ''))
          );
          setNewDescription(response.data.poste.description);
        } catch (error) {
          console.error('Erreur lors de la récupération des détails du poste :', error);
        }
      };

    const recuperationReferents = async () => {
          try {
            const data = {
              idposte: posteId,
              idfestival: idfestival,
            };
            const response = await supervisionAPI.getReferentByPoste(data);
            console.log("referents: " + response.data.referents);
            setReferents(response.data.referents);
          } catch (error) {
            console.log(error);
          }
        };

  useEffect(() => {
    fetchPosteDetails();
    recuperationReferents();
  }, [posteId, idfestival]);

  const handleButtonClick = () => {
    navigate(`/jeux-espaces/${idfestival}`);
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

  const fetchUsers = async () => {
    try {
      const data = {
        searchQuery: searchQuery,
      };
      const response = await userAPI.searchUsers(data);
      setUsers(response.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };
  useEffect(() => {
    // Fetch users based on search query
    if (searchQuery.trim() !== '') {
      fetchUsers();
    }
  }, [searchQuery]);


  const handleAddReferent = () => {
    setShowSearchBar((prevShowComponent) => !prevShowComponent);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const addReferent = async () => {
    // Vérifier si le poste et l'utilisateur sont sélectionnés
    if (posteId && selectedUserID) {
      const data = {
        idposte: posteId,
        idfestival: idfestival,
        iduser: selectedUserID,
      };
      try {
        await supervisionAPI.addReferent(data);
        setShowSearchBar(false);
        recuperationReferents();
      } catch (error) {
        console.error('Erreur lors de l\'ajout du référent:', error);
      }
    } else {
      console.error('Veuillez sélectionner un poste et un utilisateur');
    }
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
    <div className='contenantt'>
      {posteDetails && referents && (
        <div>
          <div className='group'>
            <div className='presentationPoste'>Présentation du poste :</div>

            {!modeEdition && user.role === "ADMIN" && (
              <button className="editButton" onClick={() => { setModeEdition(true) }}>
                <span className="material-symbols-outlined">
                  edit
                </span>
              </button>
            )}
          </div>
          {(modeEdition && user.role === "ADMIN") ? (
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
              <div className='description' key={index}>{description}</div>
            ))
          )}
          {(modeEdition && user.role === "ADMIN") &&
            <div className='entoure'>
              <button className="bouton1" onClick={() => { updateDescriptions() }}>Enregistrer</button>
              <button className="bouton1" onClick={() => { setModeEdition(false) }}>Annuler</button>
            </div>
            // Bouton pour sauvegarder les modifications
          }
          <div className="group">
            <div className='presentationPoste'>Référent :</div>
            {user.role === "ADMIN" &&
              <button className="editButton" onClick={handleAddReferent}>
                <span className="material-symbols-outlined">
                  add
                </span>
              </button>}

          </div>

          {showSearchBar && (
            <div className='group'>
              <UserSearch
                searchQuery={searchQuery}
                handleSearchChange={handleSearchChange}
                users={users}
                selectedUserID={selectedUserID ? selectedUserID.iduser : null}
                handleUserSelect={handleUserSelect}
              />

              <button className='addReferentBouton' onClick={addReferent}>Ajouter</button>
            </div>
          )}

          {referents.length > 0 ? (
            referents.map((referent, index) => (
              <div className="ref" key={index}>
                pseudo : {referent.User.pseudo} | tel : {referent.User.tel}
              </div>
            ))
          ) : (
            <div className="ref">Aucun référent</div>
          )}

        </div>
      )}

      <div className="ref">
        {posteDetails && posteId === 1 && (
          <button className="showEspaceButton" onClick={handleButtonClick}> Voir les espaces de jeu</button>
        )}
      </div>
    </div>
  );
};

export default PosteDetails;