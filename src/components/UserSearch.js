import React, { useEffect } from 'react';
import { useState } from 'react';

const UserSearch = ({ searchQuery, handleSearchChange, users, selectedUserID, handleUserSelect, showliste }) => {

  return (
    <div>
      {/* Barre de recherche pour trouver un utilisateur */}
      <input className='SearchBar' type="text" value={searchQuery} placeholder="Rechercher un utilisateur" onChange={handleSearchChange} />
      
      {/* Div sélectionnable pour les utilisateurs trouvés */}
      {(showliste===true||showliste===undefined) && <div className="selectable-user-list">
        {users.map((user) => (
          <div
            key={user.iduser}
            className="searchResult"
            onClick={() => {handleUserSelect(user)}}
          >
            {user.pseudo} 
          </div>
        ))}
      </div>}
    </div>
  );
};

export default UserSearch;
