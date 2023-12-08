import React from 'react';

const Bouton = ({ label, onClick }) => {
  return (
    <button className="bouton" onClick={onClick}>
      {label}
    </button>
  );
};

export default Bouton;
