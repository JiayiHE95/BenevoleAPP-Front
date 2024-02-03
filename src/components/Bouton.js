// Bouton.js
import React from 'react'; // Assurez-vous d'importer votre fichier de style

const Bouton = ({ label, onClick, isActive }) => {
  return (
    <button className={`bouton ${isActive ? 'active' : ''}`} onClick={onClick}>
      {label}
    </button>
  );
};

export default Bouton;
