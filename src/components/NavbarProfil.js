import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import userAPI from '../api/userAPI';
import { useJwt } from "react-jwt";
import LogoFestivalPetit from '../images/LogoFestivalPetit.png'

const NavBarProfil = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('accessToken');
  const { decodedToken, isExpired } = useJwt(token ? token : "");

  useEffect(() => {
    if (decodedToken) {
      userAPI.getUserById(decodedToken.iduser).then((resp) => {
        if (resp.data) {
          setUser(resp.data.user);
        }
      });
    }
  }, [decodedToken]);

  const isMobileScreen = windowWidth <= 935;

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (!isMobileScreen) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isMobileScreen]);

  const handleToggleMobileMenu = () => {
    const not = !isMobileMenuOpen;
    setMobileMenuOpen(not);
  };

  return (
    <div>
    <div className='navbar-container'>
    <div className='logo-container cursor' onClick={() => navigate("/")}>
      <img className="logo" src={LogoFestivalPetit} alt="Festival du jeu" />
    </div>
      {user && (
        <div className={`navbar ${isMobileScreen ? 'mobile-menu-open' : ''}`}>
          <div className='cursor' onClick={() => navigate("/home/user")}>Home</div>
          {user.role === "ADMIN" && (
            <div className='cursor' onClick={() => navigate("/admin")}>Admin</div>
          )}
          <div className="material-icons cursor" onClick={() => { localStorage.removeItem('accessToken'); navigate(`/`); }}>logout</div>
        </div>
      )}
      {isMobileScreen && (
        <div className='mobile-menu-icon cursor' onClick={handleToggleMobileMenu}>
          <i className="material-icons">menu</i>
        </div>
      )}
      </div>
      {isMobileMenuOpen && isMobileScreen && (
        <div className={`mobile-menu-open`}>
          <div className='cursor' onClick={() => navigate("/home/user")}>Home</div>
          {user.role === "ADMIN" && (
            <div className='cursor' onClick={() => navigate("/admin")}>Admin</div>
          )}
          <div className="material-icons cursor" onClick={() => { localStorage.removeItem('accessToken'); navigate(`/`); }}>logout</div>
        </div>
      )}
    </div>
  );
}

export default NavBarProfil;
