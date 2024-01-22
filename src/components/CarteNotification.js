import React, { useState } from "react";

const CarteNotification = ({ notification , onDelete }) => {

  const handleDelete = async () => {
    
    await onDelete(notification.idnotification);
  };

  return (
    <div className='carte'> 
      <div>Date : a ajouter </div>
      <div>label : {notification.label}</div>
        
      <button onClick={() => handleDelete()}> Supprimer </button>
      <div> _________________________________ </div>

    </div>
  );
};

export default CarteNotification;
