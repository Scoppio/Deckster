import { useEffect, useState } from 'react';
import PropTypes from "prop-types";
import { Urls } from "../commons/Urls";
import { Authorization } from "../controllers/Authorization";
import { useQuery } from '@tanstack/react-query';
import './apiKeyForm.css';
import Dropdown from "react-bootstrap/Dropdown";
import DropdownMenuPortal from "../commons/DropdownMenuPortal";


export const ApiKeyForm = ({ onAuthorizationChange }) => {
  const [game, setGame] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [authorization, setAuthorization] = useState(null);
  const [enableEnter, setEnableEnter] = useState(false);
  const [serverIsUp, setServerIsUp] = useState(false);
  const version = process.env.REACT_APP_VERSION;

  const fetchGames = async () => {
    const response = await fetch(`${Urls.api_url}/games/`, {
      headers: {
        'Content-Type': 'application/json'
      },
    });
    const data = await response.json();
    return data.games_available;
  };

  const { data, isLoading, isError } = useQuery({ queryKey: ['games'], queryFn: fetchGames });

  useEffect(() => {
    setServerIsUp(checkServer());
  }, []);

  useEffect(() => {
    const previousRememberMe = window.localStorage.getItem("rememberMe");
    let gameName = '';
    setRememberMe(previousRememberMe === "true");

    if (previousRememberMe === false) {
      window.localStorage.removeItem("gameName");
      window.localStorage.removeItem("token");
      window.localStorage.removeItem("user");
    } else {  
      gameName = window.localStorage.getItem("gameName");
      const token = window.localStorage.getItem("token");
      const userString = window.localStorage.getItem("user");
      setGame(gameName || '');

      if (gameName && token && userString) {
        const user = JSON.parse(userString);
        setAuthorization(new Authorization(gameName, token, user));
        setEnableEnter(true);
      }
    }
  }, [onAuthorizationChange]);

  useEffect(() => {
    if (Boolean(game) && Boolean(password) && Boolean(username)) {
      setEnableEnter(true);
    }
    else if (Boolean(game) && Boolean(authorization)) {
      setEnableEnter(true);
    } else if (Boolean(game) === false) {
      setEnableEnter(false);
    }
  }, [game, password, username, authorization]);

  const checkServer = async () => {
    const response = await fetch(`${Urls.api_url}/up/`);
    if (!response.ok) {
      console.error("Error:", response);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    window.localStorage.setItem("rememberMe", rememberMe);

    window.localStorage.removeItem("gameName");
    window.localStorage.setItem("gameName", game);

    if (authorization && password === "" && username === "") {
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

    if (rememberMe) {
      window.localStorage.setItem("token", apiKey);
      window.localStorage.setItem("user", JSON.stringify(user));
    } else {
      window.localStorage.removeItem("token");
      window.localStorage.removeItem("user");
    }

    onAuthorizationChange(auth);
  };
  
  if (isLoading) {
    return (
      <div className="form-container">
        <div className="form-box">
          <h2>Loading games...</h2>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="form-container">
        <div className="form-box">
          <h2>Error loading games...</h2>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="form-container">
        <div className="form-box">
          <h2>Mesão da Massa</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <Dropdown drop="up" style={{ maxHeight: "100px", fontSize: "12px" }} autoClose="outside">
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                  {game}
                </Dropdown.Toggle>
                <DropdownMenuPortal>
                  {data.map((gameItem) => (
                    <Dropdown.Item 
                      key={gameItem.name} 
                      onClick={() => setGame(gameItem.name)}>
                      {gameItem.name}
                    </Dropdown.Item>
                  ))}
                </DropdownMenuPortal>
              </Dropdown>
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
          {serverIsUp && <p tabIndex={0}>Server is UP!</p> }
        </div>
        <br/>
        <br/>
        <p tabIndex={0}>Made with ❤️ by Scoppio - Deckster VTT version { version }</p>
      </div>
    </div>
  );
};


ApiKeyForm.propTypes = {
  onAuthorizationChange: PropTypes.func.isRequired,
};
