import React, { useState, useEffect } from 'react';

import NavBar from '../components/NavBar';
import Sidebar from '../components/Sidebar';
import TableauJeux from '../components/TableauJeux';
import jeuEspaceAPI from '../api/jeuEspaceAPI';

const Espace = () => {
    const [selectedEspaceId, setSelectedEspaceId] = useState(1);
    const [jeux, setJeux] = useState([]);

    useEffect(() => {
        const fetchJeux = async () => {
            try {
                const response = await jeuEspaceAPI.getJeuxListe(selectedEspaceId)
                setJeux(response.data.jeux);
                console.log(response.data.jeux)
            } catch (error) {
                console.error('Erreur lors de la récupération des jeux :', error);
            }
        };

        fetchJeux();
    }, [selectedEspaceId]); 

    const handleEspaceClick = (idzonebenevole) => {
        setSelectedEspaceId(idzonebenevole);
    };

    return (
        <div>
            <NavBar/>
            <h1>Espaces</h1>
            <Sidebar dataName="espace" onEspaceClick={handleEspaceClick} />
            <TableauJeux jeux={jeux}/>
        </div>
    )
}

export default Espace;
