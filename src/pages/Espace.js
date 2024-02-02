import React, { useState, useEffect } from 'react';
import {useNavigate, useParams} from 'react-router-dom'

import NavBar from '../components/NavBar';
import Sidebar from '../components/Sidebar';
import TableauJeux from '../components/TableauJeux';
import jeuEspaceAPI from '../api/jeuEspaceAPI';

const Espace = () => {
    const [selectedEspaceId, setSelectedEspaceId] = useState(null);
    const [jeux, setJeux] = useState(null);
    const navigate=useNavigate()
    const { festivalId } = useParams();
    const [csvImported, setCsvImported] = useState(false);

    useEffect(() => {
        jeuEspaceAPI.getOneByFestival(festivalId).then((res) => {
            if(res.data.find){
                setCsvImported(true)
            }
        })
    }, []);

    
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
            <NavBar festivalId = {festivalId}/>
            <h1>Informations sur les espaces</h1>
            {!csvImported ?
            <div>
                   <div>
                Veuillez importer le fichier csv contenant les informations des jeux et des espaces
                </div>
                <div className='clickable' onClick={()=>{navigate(`/festival/${festivalId}`)}}>Importer le fichier</div>
                </div>
            :
            <div>
                <Sidebar dataName="espace" onEspaceClick={handleEspaceClick} />
                {selectedEspaceId!=null&&
                    <TableauJeux jeux={jeux} idEspace={selectedEspaceId}/>
                }
            </div>
            }
            <div className='clickable' onClick={()=>{navigate(`/infos/${festivalId}`)}}>Retourner à la page Info</div>
        </div>
    )
}

export default Espace;
