// Sidebar.js
import React, { useEffect, useState } from 'react';
import posteCreneauAPI from '../api/posteCreneauAPI';
import posteAPI from '../api/posteAPI';
import espaceAPI from '../api/espaceAPI';
import Bouton from './Bouton';
import '../scss/components/sidebar.css';  // Assurez-vous d'importer votre fichier de style

import { useParams, Navigate } from 'react-router-dom';

const Sidebar = ({ dataName, onPosteClick, onEspaceClick }) => {
  const [liste, setListe] = useState([]);
  const { festivalId } = useParams();
  const [activeItem, setActiveItem] = useState(null);

  useEffect(() => {
    const getList = async () => {
      try {
        let response;
        console.log(festivalId);
        if (dataName === 'poste') {
          response = await posteCreneauAPI.getPosteByFestival(festivalId);
          console.log('Réponse de l\'API post :', response.data);
          setListe(response.data.postes);
          setActiveItem(response.data.postes[0].idposte);

        } else if (dataName === 'espace') {
          response = await espaceAPI.getEspacesListe(festivalId);
          console.log('Réponse de l\'API :', response.data);
          setListe(response.data.espaces);
          if (response.data.espaces.length > 0) {
            setActiveItem(response.data.espaces[0].idzonebenevole);
          }
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
      }
    };

    getList();
    
  }, [dataName, festivalId]);

  const handleItemClick = (itemId) => {
    setActiveItem(itemId);
    if (dataName === 'poste') {
      onPosteClick(itemId);
    } else if (dataName === 'espace') {
      onEspaceClick(itemId);
    }
  };

  return (
    <div className="sidebar cursor">
      {liste && liste.map((item) => (
        <Bouton
          key={dataName === 'poste' ? `Poste ${item.idposte}` : `Espace ${item.idzonebenevole}`}
          label={item.nom}
          onClick={() => handleItemClick(dataName === 'poste' ? item.idposte : item.idzonebenevole)}
          isActive={activeItem === (dataName === 'poste' ? item.idposte : item.idzonebenevole)}
        />
      ))}
    </div>
  );
};

export default Sidebar;
