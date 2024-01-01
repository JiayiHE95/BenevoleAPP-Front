import React from 'react';

const TableauJeux = ({ jeux, idEspace }) => {

  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Nom</th>
          <th>Reçu</th>
         {idEspace!==jeux[0].Espace.idzonebenevole&&<th>Zone</th>}
        </tr>
      </thead>
      <tbody>
        {jeux.map((jeu) => (
          <tr key={jeu.id}>
            <td>{jeu.idjeu}</td>
            <td>{jeu.Jeu.nom}</td>
            <td>{jeu.Jeu.recu===false?"Non":"Oui"}</td>
            {idEspace!==jeux[0].Espace.idzonebenevole&&<td>{jeu.Espace.nom}</td>}
          </tr>
        ))}
      </tbody>
      
      
    </table>
  );
};

export default TableauJeux;
