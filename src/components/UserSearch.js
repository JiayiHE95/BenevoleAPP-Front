import React from 'react';

const UserSearch = ({ searchQuery, handleSearchChange, users, selectedUserID, handleUserSelect }) => {
  return (
    <div>
      {/* Barre de recherche pour trouver un utilisateur */}
      <input type="text" value={searchQuery} placeholder="Rechercher un utilisateur" onChange={handleSearchChange} />
      
      {/* Div sélectionnable pour les utilisateurs trouvés */}
      <div className="selectable-user-list">
        {users.map((user) => (
          <div
            key={user.iduser}
            className={`selectable-user ${selectedUserID === user.iduser ? 'selected' : ''}`}
            onClick={() => handleUserSelect(user)}
          >
            {user.pseudo} 
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserSearch;
