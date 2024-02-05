import React, { useEffect, useState } from 'react';
import userAPI from '../api/userAPI';
import { TbAlertCircle } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [mail, setMail] = useState('');
  const [mdp, setMdp] = useState('');
  const [notif, setNotif] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    setNotif('');
  }, [mdp, mail]);

  const validateForm = () => {
    if (!mail || !mdp) {
      setNotif('Veuillez remplir tous les champs.');
      return false;
    }
    return true;
  };

  const connexion = () => {
    if (validateForm()) {
      const data = {
        mail: mail,
        mdp: mdp,
      };
      userAPI
        .connexion(data)
        .then((resp) => {
          console.log(resp.data.user);
          if (resp.data.auth) {
            localStorage.setItem('accessToken', resp.data.token);
            navigate(`/home/user`);
          } else {
            setNotif(resp.data.message);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  return (
    <div className="login-container">
      <label htmlFor="email" className="label">
        Email :
      </label>
      <input
        type="email"
        id="email"
        name="email"
        className="input-field"
        onChange={(e) => {
          setMail(e.target.value);
        }}
        required
      />

      <label htmlFor="password" className="label">
        Mot de passe :
      </label>
      <input
        type="password"
        id="password"
        name="password"
        className="input-field"
        onChange={(e) => {
          setMdp(e.target.value);
        }}
        required
      />

      {notif && (
        <div className="signup-notif-errors">
          <TbAlertCircle className="error-icon" />
          <div>{notif}</div>
        </div>
      )}
      <div
        className="clickable"
        onClick={() => {
          navigate('/password-forgot');
        }}
      >
        Mot de passe oublié
      </div>
      <div
        className="create-account"
        onClick={() => {
          navigate('/signup');
        }}
      >
        Je n'ai pas de compte
      </div>
      <button
        type="button"
        className="submit-button"
        onClick={() => connexion()}
      >
        Se connecter
      </button>
    </div>
  );
};

export default Login;
