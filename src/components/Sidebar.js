import React, { useEffect, useState } from 'react';
import posteAPI from '../api/posteAPI';
import espaceAPI from '../api/espaceAPI';
import Bouton from './Bouton';
import '../scss/components/sidebar.css'


const Sidebar = ({ dataName, onPosteClick, onEspaceClick }) => {
  const [liste, setListe] = useState([]);

  useEffect(() => {
    const getList = async () => {
      try {
        let response;

        if (dataName === 'poste') {
          response = await posteAPI.getPostesListe();
          console.log('Réponse de l\'API post :', response.data);
          setListe(response.data.postes); 
        } else if (dataName === 'espace') {
          response = await espaceAPI.getEspacesListe();
          console.log('Réponse de l\'API :', response.data);
          setListe(response.data.espaces);
        } 

        
      } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
      }
    };

    getList();
  }, [dataName]);

  const handleItemClick = (itemId) => {
    if (dataName === 'poste'){
      onPosteClick(itemId);
    }
    else if (dataName === 'espace'){
      onEspaceClick(itemId);
    }
  };
  

  return (
    <div className="sidebar">
      {liste && liste.map((item) => (
        <Bouton
          key={dataName === 'poste' ? `Poste ${item.idposte}` : `Espace ${item.idzonebenevole}`}
          label={item.nom}
          onClick={() => handleItemClick(dataName === 'poste' ? item.idposte : item.idzonebenevole)}
        />
      ))}
    </div>
  );
};

// Pour l'utilisé : <Sidebar dataName="espace" />
export default Sidebar;
