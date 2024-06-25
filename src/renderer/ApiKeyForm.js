import { useEffect, useState } from 'react';
import PropTypes from "prop-types";
import { Urls } from "../commons/Urls";
import { Authorization } from "../controllers/Authorization";
import './apiKeyForm.css';

export const ApiKeyForm = ({ onAuthorizationChange }) => {
  const [game, setGame] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [authorization, setAuthorization] = useState(null);
  const [enableEnter, setEnableEnter] = useState(false);


  useEffect(() => {
    const rememberMe = window.localStorage.getItem("rememberMe");
    setRememberMe(rememberMe === "true");
    
    const gameName = window.localStorage.getItem("gameName");
    const token = window.localStorage.getItem("token");
    const userString = window.localStorage.getItem("user");

    if (gameName && token && userString) {
      const user = JSON.parse(userString);
      setAuthorization(new Authorization(gameName, token, user));
      setEnableEnter(true);
    }
  }, [onAuthorizationChange]);

  useEffect(() => {
    if (game && password && username) {
      setEnableEnter(true);
    }
  }, [game, password, username]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (authorization) {
      onAuthorizationChange(authorization);
      return;
    }

    const response = await fetch(`${Urls.api_url}/api/token/`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
     });
    if (!response.ok) {
      console.error("Error:", response);
      return;
    }
    const data = await response.json();
    const apiKey = data.token;
    const user = {id: data.id, username: data.username, avatar: data.avatar};
    const auth = new Authorization(game, apiKey, user);

    window.localStorage.setItem("rememberMe", rememberMe);
    window.localStorage.setItem("gameName", game);

    if (rememberMe) {
      window.localStorage.setItem("token", apiKey);
      window.localStorage.setItem("user", JSON.stringify(user));
    } else {
      window.localStorage.removeItem("token");
      window.localStorage.removeItem("user");
    }

    onAuthorizationChange(auth);
  };
  
  return (
    <div className="form-container">
      <div className="form-box">
        <h2>Mesão da Massa</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Game Name"
              aria-label="Game Name"
              value={game}
              onChange={(e) => setGame(e.target.value)}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder="Username"
              aria-label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-control"
            />
          </div><div className="form-group">
            <input
              type="password"
              placeholder="Password"
              aria-label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
            />
          </div><div className="form-group">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label htmlFor="rememberMe">Remember Me</label>
          </div>
          <button type="submit" className="btn-submit" disabled={!enableEnter}>Enter</button>
        </form>
      </div>
    </div>
  );
};


ApiKeyForm.propTypes = {
  onAuthorizationChange: PropTypes.func.isRequired,
};
