import React from 'react';

const TableauJeux = ({ jeux, idEspace }) => {

  return (
    (jeux && jeux.length > 0) ?
      <div className='contenant2'>
        <h3 className='bold'>Liste des jeux</h3>
        <table className='jeux-table'>
          <thead>
            <tr>
              <th>Nom</th>
              <th className='recu'>Reçu</th>
              <th>Notice</th>
            </tr>
          </thead>
          <tbody>
            {jeux.map((jeu) => (
              <tr key={jeu.id}>

                <td style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{jeu.Jeu.nom}</td>
                <td className='recu'>{jeu.Jeu.recu === false ? "Non" : "Oui"}</td>
                <td style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}><a href={jeu.Jeu.notice} target="_blank" rel="noopener noreferrer"> {jeu.Jeu.notice} </a></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      :
      <div className='contenant2'>Aucun jeu inscrit dans cet espace</div>
  );
};

export default TableauJeux;
