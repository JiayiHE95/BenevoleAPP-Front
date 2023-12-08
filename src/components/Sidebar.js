import React, { useEffect, useState } from 'react';
import sidebarAPI from '../api/sidebarAPI';
import Bouton from './Bouton';
import '../scss/components/sidebar.css'

const Sidebar = () => {
  const [liste, setListe] = useState([]);
  const [dataName, setDataName] = useState('poste');

  useEffect(() => {
    const getList = async () => {
      try {
        let response;

        // Choisissez la requête en fonction de dataName
        if (dataName === 'poste') {
          response = await sidebarAPI.getPostesListe();
          console.log('Réponse de l\'API :', response.data);
          setListe(response.data.postes); // Assurez-vous que la structure de réponse est correcte
        } else if (dataName === 'espace') {
          response = await sidebarAPI.getEspacesListe();
          console.log('Réponse de l\'API :', response.data);
          setListe(response.data.espaces); // Assurez-vous que la structure de réponse est correcte
        } // Ajoutez autant de conditions que nécessaire

        
      } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
      }
    };

    getList();
  }, [dataName]);

  return (
    <div className="sidebar">
      {liste && liste.map((item) => (
        <Bouton
          key={dataName === 'poste' ? `Poste ${item.idposte}` : `Espace ${item.idzonebenevole}`}
          label={item.nom}
          onClick={() => item.nom === 'Animation jeux' && setDataName('espace')}
          // Passez dataName et les propriétés spécifiques au composant Bouton
          dataName={dataName}
          itemId={item.id}
        />
      ))}
    </div>
  );
};

// Pour l'utilisé : <Sidebar dataName="espace" />
export default Sidebar;
