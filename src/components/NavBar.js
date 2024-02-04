import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import userAPI from '../api/userAPI';
import { useJwt } from "react-jwt";
import notificationAPI from '../api/notificationAPI';
import LogoFestivalPetit from '../images/LogoFestivalPetit.png';

const NavBar = ({ festivalId }) => {
  // State variables
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false); // State variable to track mobile menu open/close
  const [notifications, setNotifications] = useState([]);
  const [compteur, setCompteur] = useState([]);
  const [user, setUser] = useState(null);

  // Hooks from react-router-dom
  const navigate = useNavigate();

  // Get token and decodedToken from local storage using react-jwt
  const token = localStorage.getItem('accessToken');
  const { decodedToken, isExpired } = useJwt(token ? token : "");

  // Effect to fetch user data when decodedToken changes
  useEffect(() => {
    if (decodedToken) {
      userAPI.getUserById(decodedToken.iduser).then((resp) => {
        if (resp.data) {
          setUser(resp.data.user);
        }
      });
    }
  }, [decodedToken]);

  // Effect to update notification counter when notifications change
  useEffect(() => {
    setCompteur(notifications.length);
  }, [notifications]);

  // Effect to fetch notifications when user changes
  useEffect(() => {
    if (user) {
      recuperationNotifications();
      setCompteur(notifications.length);
    }
  }, [user]);
  // Check if the screen is mobile based on the window width
  const isMobileScreen = windowWidth <= 935;
  // Effect to update window width when the window is resized
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (!isMobileScreen) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Function to fetch notifications
  const recuperationNotifications = async () => {
    try {
      const response = await notificationAPI.getNotificationByUser(user.iduser, festivalId);
      console.log("notifs ..........................", response.data.notifications);
      setNotifications(response.data.notifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };



  // Function to handle toggling mobile menu
  const handleToggleMobileMenu = () => {
    const not = !isMobileMenuOpen;
    setMobileMenuOpen(not);
    console.log("Toggle: " + not);
  };

  // JSX for the Navbar component
  // JSX for the Navbar component
return (
  <div>
  <div className='navbar-container'>
    <div className='logo-container cursor' onClick={() => navigate("/")}>
      <img className="logo" src={LogoFestivalPetit} alt="Festival du jeu" />
    </div>

    {!isMobileMenuOpen && (
      <div className={`navbar`}>
        <div className='cursor' onClick={() => navigate("/home/user")}>Home</div>
        <div className='cursor' onClick={() => navigate(`/festival/${festivalId}`)}>Accueil</div>
        <div className='cursor' onClick={() => navigate(`/notification/${festivalId}`)}>Notifications <span className='bulle'>{compteur}</span></div>
        <div className='cursor' onClick={() => navigate(`/infos/${festivalId}`)}>Infos</div>
        <div className='cursor' onClick={() => navigate(`/planning/${festivalId}`)}>Planning</div>
        {user && user.role === "BENEVOLE" ? 
          <div className='cursor' onClick={() => navigate(`/registration/${festivalId}`)}>Inscriptions</div>
          :
          <div className='cursor' onClick={() => navigate(`/inscriptions/${festivalId}`)}>Inscriptions</div>
        }
        <div className="material-icons cursor" onClick={() => { localStorage.removeItem('accessToken'); navigate(`/`); }}>logout</div>
      </div>
    )}

    {isMobileScreen && (
      <div className='mobile-menu-icon cursor' onClick={handleToggleMobileMenu}>
        <i className="material-icons">menu</i>
      </div>
    )}
  
  </div>
    <div>
      {isMobileMenuOpen && isMobileScreen && (
        <div className={'mobile-menu-open'}>
          <div className='cursor' onClick={() => navigate("/home/user")}>Home</div>
          <div className='cursor' onClick={() => navigate(`/festival/${festivalId}`)}>Accueil</div>
          <div className='cursor' onClick={() => navigate(`/notification/${festivalId}`)}>Notifications <span className='bulle'>{compteur}</span></div>
          <div className='cursor' onClick={() => navigate(`/infos/${festivalId}`)}>Infos</div>
          <div className='cursor' onClick={() => navigate(`/planning/${festivalId}`)}>Planning</div>
          {user && user.role === "BENEVOLE" ? 
          <div className='cursor' onClick={() => navigate(`/registration/${festivalId}`)}>Inscriptions</div>
          :
          <div className='cursor' onClick={() => navigate(`/inscriptions/${festivalId}`)}>Inscriptions</div>
        }
          <div className="material-icons cursor" onClick={() => { localStorage.removeItem('accessToken'); navigate(`/`); }}>logout</div>
        </div>
      )}
    </div>
    </div>
  );

}

export default NavBar;
