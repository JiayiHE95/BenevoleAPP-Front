// import { useJwt } from "react-jwt";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

import { useJwt } from "react-jwt";
import NavBarProfil from "../components/NavbarProfil";
import FestivalInfo from "../components/FestivalInfo"
import Profil from "../components/Profil";
import userAPI from "../api/userAPI";
import festivalAPI from '../api/festivalAPI';
import FileUploader from "../components/FileUploader";
import "../scss/pages/UserHome.css";

const UserHome = () => {

  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [festivals, setFestivals] = useState(null);
  const [currentfestivals, setCurrentFestivals] = useState(null);

  const token = localStorage.getItem('accessToken');
  const { decodedToken, isExpired } = useJwt(token ? token : "");
  isExpired && localStorage.removeItem('accessToken');

  useEffect(() => {
    if (decodedToken) {
      userAPI.getUserById(decodedToken.iduser).then((res) => {
        setUser(res.data.user);
      });
    }
  }, [decodedToken]);

  useEffect(() => {
    console.log()
    festivalAPI.getAllFestival().then((res) => {
      if(res.data.find){
       setFestivals(res.data.festivals)
    }
  })},[])

  
  useEffect(() => {
    if (festivals && user) {
      const currentDate = new Date();
        let currentFestivals = festivals
          .filter((festival) => new Date(festival.date_fin) >= currentDate)
        setCurrentFestivals(currentFestivals);
    }

  },[festivals, user])

  const handleUpdateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  return (
    isExpired ?
      <Navigate to={'/'} /> :
      
      <div >

        <NavBarProfil/>
        <div className="userHome">
          <div className="left-block">
            {/* bloc à gauche */}
            <h1>User Home Page</h1>
            {user && <Profil user={user} onUpdateUser={handleUpdateUser} />}
          </div>
          
          <div className="right-block">
            {/* Ajout de la présentation des différents festivals en cours : */}
            <h2>Festival en cours</h2>
            <div>
            {currentfestivals && Array.isArray(currentfestivals) ? (
              currentfestivals.map((festival) => (
                <FestivalInfo key={festival.idfestival} festival={festival} />

              ))
            ) : (
              <div>Il n'y a pas de festival en cours</div>
            )}
            </div>
          </div>

        </div>
      </div>
  );
};

export default UserHome;
