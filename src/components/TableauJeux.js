import React from 'react';

const TableauJeux = ({ jeux }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Nom</th>
          <th>Reçu</th>
        </tr>
      </thead>
      <tbody>
        {jeux.map((jeu) => (
          <tr key={jeu.id}>
            <td>{jeu.idjeu}</td>
            <td>{jeu.Jeu.nom}</td>
            <td>{jeu.Jeu.recu===false?"Non":"Oui"}</td>
          </tr>
        ))}
      </tbody>
      
      
    </table>
  );
};

export default TableauJeux;
