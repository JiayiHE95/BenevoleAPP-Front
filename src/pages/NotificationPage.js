import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import { useParams } from 'react-router-dom';
import notificationAPI from '../api/notificationAPI';
import userAPI from '../api/userAPI';
import { useJwt } from 'react-jwt';
import CarteNotification from '../components/CarteNotification'

const NotificationPage = () => {
  const { festivalId } = useParams();
  const [notifications, setNotifications] = useState([]);
  const [user, setUser] = useState(null);

  const token = localStorage.getItem('accessToken');
  const { decodedToken, isExpired } = useJwt(token ? token : "");

  useEffect(() => {
    if (decodedToken && decodedToken.iduser) {
      userAPI.getUserById(decodedToken.iduser).then((res) => {
        setUser(res.data.user);
      });
    }
  }, [decodedToken]);

  useEffect(() => {
    // Fetch the list of inscriptions when the component mounts
    if (user) {
      recuperationNotifications();
    }
  }, [user]);

  const recuperationNotifications = async () => {
    
    try {
      const response = await notificationAPI.getNotificationByUser(user.iduser, festivalId);
      console.log("notifs ..........................", response.data.notifications);
      setNotifications(response.data.notifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  
  const handleDelete = async (idnotification) => {
    const data = {
        idnotification: idnotification
    };
  
    try {
      await notificationAPI.deleteNotification(data);
      recuperationNotifications();
    } catch (error) {
      
    }
  };
  

  return (
    <div className='bg'>
      <NavBar festivalId={festivalId} />
      <h1>Notifications</h1>

      {notifications.length > 0 ? (
        <div className='centrer'>
          {notifications.map((notification, index) => (
            <CarteNotification
              key={index}
              notification={notification}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className='centrer'>Aucune notification</div>
      )}
    </div>
  );
};

export default NotificationPage;
