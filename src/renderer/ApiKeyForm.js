import { useState } from 'react';
import PropTypes from "prop-types";
import { Urls } from "../commons/Urls";
import { Authorization } from "../controllers/Authorization";
import './apiKeyForm.css';

export const ApiKeyForm = ({ onAuthorizationChange }) => {
  const [game, setGame] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

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
    const authorization = new Authorization(game, apiKey, user);

    onAuthorizationChange(authorization);
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
          </div>
          <button type="submit" className="btn-submit">Enter</button>
        </form>
      </div>
    </div>
  );
};


ApiKeyForm.propTypes = {
  onAuthorizationChange: PropTypes.func.isRequired,
};
