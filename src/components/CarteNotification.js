import React, { useState } from "react";

const CarteNotification = ({ notification , onDelete }) => {

  const handleDelete = async () => {
    
    await onDelete(notification.idnotification);
  };

  return (
    <div className='carte'> 
      <div className="couleur"> </div>
      <div className="contourLabel">
        <div className="label"> {notification.label}</div>
      </div>
      <button className="del" onClick={() => handleDelete()}><span class="material-symbols-outlined cursor del">
close
</span></button>  
      
    </div>
  );
};

export default CarteNotification;
