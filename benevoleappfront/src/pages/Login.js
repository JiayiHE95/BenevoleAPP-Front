import React, { useState } from 'react';
import axios from 'axios';
import apiConfig from '../api/apiConfig';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginStatus, setLoginStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${apiConfig.baseURL}/user/connexion`, {
        mail: email,
        mdp: password,
      });

      console.log('Réponse du serveur:', response.data);

      // Update login status and handle successful login
      setLoginStatus('success');

      // Store the token in local storage
      localStorage.setItem('accessToken', response.data.token);

      // Add logic for updating authenticated state and redirecting the user
      // For example, you might want to use React Router for redirection.

    } catch (error) {
      // Handle specific authentication errors for a better user experience
      if (error.response && error.response.status === 401) {
        setLoginStatus('error');
        setErrorMessage('Mauvaise combinaison utilisateur/mot de passe');
      } else {
        setLoginStatus('error');
        setErrorMessage('Erreur de connexion. Veuillez réessayer.');
        console.error('Erreur de connexion:', error.message);
      }
    }
  };

  return (
    <div>
      <h1>Connexion</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email :</label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={handleEmailChange}
          required
        />

        <label htmlFor="password">Mot de passe :</label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={handlePasswordChange}
          required
        />

        <button type="submit">Se connecter</button>
      </form>

      {loginStatus === 'error' && (
        <p style={{ color: 'red' }}>{errorMessage}</p>
      )}

      {loginStatus === 'success' && (
        <p style={{ color: 'green' }}>Connexion réussie ! Redirection en cours... (bientot implémenté lol)</p>
      )}
    </div>
  );
};

export default Login;
