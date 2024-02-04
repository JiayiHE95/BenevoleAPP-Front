// Card.js
import React from "react";
import { Link } from "react-router-dom";
import { formatDate } from "../utils/dateUtils";
import { useNavigate } from 'react-router-dom';

const FestivalInfo = ({ festival }) => {
  const navigate = useNavigate();
  

  return (
    <div className="card" key={festival.idfestival}>
      <div onClick={() => navigate(`/festival/${festival.idfestival}`)} className="custom-link">
        <div className="bold">{festival.nom}</div>
        <div>
          {formatDate(festival.date_debut)} - {formatDate(festival.date_fin)}
        </div>
      </div>
    </div>
  );
};



export default FestivalInfo;

