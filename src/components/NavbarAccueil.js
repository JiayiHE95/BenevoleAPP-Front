import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import userAPI from '../api/userAPI';
import { useJwt } from "react-jwt";
import LogoFestivalPetit from '../images/LogoFestivalPetit.png'

const NavbarAccueil = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();


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

  const redirectToExternalSite = () => {
   window.open("https://www.festivaldujeu-montpellier.org/", "_blank");
 };

  return (
    <div>
    <div className='navbar-container'>
    <div className='logo-container cursor' onClick={() => navigate("/")}>
      <img className="logo" src={LogoFestivalPetit} alt="Festival du jeu" />
    </div>
     
      <div className={`navbar ${isMobileScreen ? 'mobile-menu-open' : ''}`}>
      <div className='cursor' onClick={() => redirectToExternalSite()}>Qui sommes-nous ?</div>
        <div className='cursor' onClick={() => navigate("/login")}>Connexion</div>
        <div className='cursor' onClick={() => navigate("/signup")}>Inscription</div>

      </div>
   
      {isMobileScreen && (
        <div className='mobile-menu-icon cursor' onClick={handleToggleMobileMenu}>
          <i className="material-icons">menu</i>
        </div>
      )}
      </div>
      {isMobileMenuOpen && isMobileScreen && (
        <div className={`mobile-menu-open`}>
          <div className='cursor' onClick={() => redirectToExternalSite()}>Qui sommes-nous ?</div>
          <div className='cursor' onClick={() => navigate("/login")}>Connexion</div>
          <div className='cursor' onClick={() => navigate("/signup")}>Inscription</div>

        </div>
      )}
    </div>
  );
}

export default NavbarAccueil
