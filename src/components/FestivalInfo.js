// Card.js
import React from "react";
import { Link } from "react-router-dom";

const FestivalInfo = ({ festival }) => {

  return (
    <div className="card" key={festival.idfestival}>
      <Link to={`/festival/${festival.idfestival}`} className="custom-link">
        <div>{festival.nom}</div>
        <div>
          {festival.date_debut} - {festival.date_fin}
        </div>
      </Link>
    </div>
  );
};



export default FestivalInfo;

