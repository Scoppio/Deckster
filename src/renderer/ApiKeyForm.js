import React, { useState } from 'react';
import PropTypes from "prop-types";
import { Authorization } from "../controllers/Authorization";
import './apiKeyForm.css';

export const ApiKeyForm = ({ onAuthorizationChange }) => {
  const [game, setGame] = useState('');
  const [apiKey, setApiKey] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const authorization = new Authorization(game, apiKey);
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
              placeholder="Game"
              value={game}
              onChange={(e) => setGame(e.target.value)}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="User Token"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
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
  gameState: PropTypes.object.isRequired, 
};
