import React, { useState } from 'react';
import NavBar from '../components/NavBar';
import Sidebar from '../components/Sidebar';
import PosteDetails from '../components/PosteDetails'


const Infos = () => {

    const [selectedPosteId, setSelectedPosteId] = useState(1);

    const handlePosteClick = (posteId) => {
        setSelectedPosteId(posteId);
    };


    return (
    <div>
        <NavBar/>
        <h1>Infos</h1>
        <Sidebar dataName="poste" onPosteClick={handlePosteClick} />
        <PosteDetails posteId={selectedPosteId} />
    </div>
    )

}
export default Infos