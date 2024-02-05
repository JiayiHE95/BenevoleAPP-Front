import React, { useState, useEffect } from 'react';
import {useNavigate, useParams} from 'react-router-dom'

import NavBar from '../components/NavBar';
import Sidebar from '../components/Sidebar';
import TableauJeux from '../components/TableauJeux';
import jeuEspaceAPI from '../api/jeuEspaceAPI';
import espaceAPI from '../api/espaceAPI';

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
        const getList = async () => {
            const response = await espaceAPI.getEspacesListe(festivalId);
            console.log('tesssssssssssst :', response.data);
            setSelectedEspaceId(response.data.espaces[0].idzonebenevole);
        }
        if(selectedEspaceId!=null){
            try {
               jeuEspaceAPI.getJeuxListe(selectedEspaceId).then((response) => {
                   setJeux(response.data.jeux);
                   console.log(response.data)
               })
            } catch (error) {
                console.error('Erreur lors de la récupération des jeux :', error);
            }
        }else{
            getList()
        }
       
    }, [selectedEspaceId]); 

    const handleEspaceClick = (idzonebenevole) => {
        setSelectedEspaceId(idzonebenevole);
    };

    return (
        <div className='height'>
            <NavBar festivalId = {festivalId}/>

            <div className='groupement'>
                <div className='groupement cursor' onClick={()=>{navigate(`/infos/${festivalId}`)}}><span class="material-symbols-outlined">arrow_back</span></div>
                <h1 className='h1'>Informations sur les espaces</h1>                
            </div>
            

            {!csvImported ?
            <div className='manqueCsv'>
                <div className='centrer'>
                    Veuillez importer le fichier csv contenant les informations des jeux et des espaces
                </div>
                <div className='bouton2 cursor centrer' onClick={()=>{navigate(`/festival/${festivalId}`)}}>Importer le fichier</div>
            </div>
            :
            <div className='contenant'>
                <Sidebar dataName="espace" onEspaceClick={handleEspaceClick} />
                <div className='lot'> 
                    {selectedEspaceId!=null&&
                        <TableauJeux jeux={jeux} idEspace={selectedEspaceId}/>
                    }
                </div>
            </div>
            }
            
        </div>
    )
}

export default Espace;
