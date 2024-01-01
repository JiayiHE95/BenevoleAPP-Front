import React, { useState, useEffect } from 'react';
import {useNavigate} from 'react-router-dom'

import NavBar from '../components/NavBar';
import Sidebar from '../components/Sidebar';
import TableauJeux from '../components/TableauJeux';
import jeuEspaceAPI from '../api/jeuEspaceAPI';

const Espace = () => {
    const [selectedEspaceId, setSelectedEspaceId] = useState(null);
    const [jeux, setJeux] = useState(null);
    const navigate=useNavigate()

    console.log("hiiiiiiiiiiii",selectedEspaceId)
    useEffect( () => {
        if(selectedEspaceId!=null){
            try {
               jeuEspaceAPI.getJeuxListe(selectedEspaceId).then((response) => {
                   setJeux(response.data.jeux);
                   console.log(response.data)
               })
            } catch (error) {
                console.error('Erreur lors de la récupération des jeux :', error);
            }
    }
    }, [selectedEspaceId]); 

    const handleEspaceClick = (idzonebenevole) => {
        setSelectedEspaceId(idzonebenevole);
    };

    return (
        <div>
            <NavBar/>
            <h1>Espaces</h1>
            <Sidebar dataName="espace" onEspaceClick={handleEspaceClick} />
            {jeux&&<TableauJeux jeux={jeux} idEspace={selectedEspaceId}/>}
            <div className='clickable' onClick={()=>{navigate("/infos")}}>Retourner à la page Info</div>
        </div>
    )
}

export default Espace;
