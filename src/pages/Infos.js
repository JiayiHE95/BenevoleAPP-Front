import React, { useState } from 'react';
import NavBar from '../components/NavBar';
import Sidebar from '../components/Sidebar';
import PosteDetails from '../components/PosteDetails'
import { useParams, Navigate } from 'react-router-dom';


const Infos = () => {
    const { festivalId } = useParams();

    const [selectedPosteId, setSelectedPosteId] = useState(1);

    const handlePosteClick = (posteId) => {
        setSelectedPosteId(posteId);
    };


    return (
    <div>
        <NavBar festivalId = {festivalId}/>
        <h1>Infos</h1>
        <Sidebar dataName="poste" onPosteClick={handlePosteClick} />
        <PosteDetails posteId={selectedPosteId} idfestival={festivalId} />
    </div>
    )

}
export default Infos