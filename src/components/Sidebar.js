import React, { useEffect, useState } from 'react';
import posteAPI from '../api/posteAPI';
import espaceAPI from '../api/espaceAPI';
import Bouton from './Bouton';
import '../scss/components/sidebar.css'

const Sidebar = ({ dataName }) => {
  const [liste, setListe] = useState([]);

  useEffect(() => {
    const getList = async () => {
      try {
        let response;

        // Choisissez la requête en fonction de dataName
        if (dataName === 'poste') {
          response = await posteAPI.getPostesListe();
          console.log('Réponse de l\'API :', response.data);
          setListe(response.data.postes); // Assurez-vous que la structure de réponse est correcte
        } else if (dataName === 'espace') {
          response = await espaceAPI.getEspacesListe();
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
      {liste.map((item) => (
        <Bouton
          key={dataName === 'poste' ? `Poste ${item.idposte}` : `Espace ${item.idzonebenevole}`}
          label={item.nom}
          onClick={() => console.log(`Bouton cliqué pour ${dataName} ${item.nom}`)}
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
