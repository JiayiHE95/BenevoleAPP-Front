// FestivalPage.js
import React from 'react';
import { useParams } from 'react-router-dom';
import NavBar from '../components/NavBar'

const FestivalPage = () => {
  const { festivalId } = useParams();

  return (
    <div>
      <NavBar festivalId = {festivalId}/>
      <h2> Accueil Festival </h2>
    </div>
  );
};

export default FestivalPage;
