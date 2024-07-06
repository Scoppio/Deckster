import { useEffect } from 'react';
import PropTypes from "prop-types";
import './settingsScreen.css';

export const SettingsScreen = ({ gameState, handleChangeGameState }) => {
  
  const handleExit = async (e) => {
    e.preventDefault();
    const userConfirmed = window.confirm("Are you sure you want to quit the game?");
    
    if (userConfirmed) {
      gameState.exitGame();
      
      setTimeout(() => {
        window.close();
      }, 300); // 300ms delay before closing the window
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
        if (event.key === "p") {
          event.preventDefault();
          handleChangeGameState("game");
        }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleChangeGameState]);
  
  const handleKickPlayer = (player) => {
    const userConfirmed = window.confirm(`Are you sure you want to kick ${player.name}?`); 
    if (userConfirmed) {
      gameState.kickPlayer(player);
    }
  };

  const handleChangePlayerInitiative = (player, direction) => {
    gameState.changePlayerInitiative(player, direction);
  };

  return (
    <div className="form-container">
      <div className="form-box">
        <h2>Settings</h2>
        <h3>Game: {gameState.game_name}</h3>
        <div className="form-group">
          {gameState.players_sequence.map((player, index) => ({
            player,
            index,
            render: () => (
              <div key={player.id} className="form-player-box">
                <button onClick={() => handleChangePlayerInitiative(player, 1)} 
                  className="btn-player" 
                  aria-label={"push down player " + player.name + " in turn sequence"}>\/</button>
                <button onClick={() => handleChangePlayerInitiative(player, -1)} 
                  className="btn-player" 
                  aria-label={"pull up player " + player.name + " in turn sequence"}>/\</button>
                {`${index + 1} - ${player.name} ${gameState.active_player_id === player.id ? "(active)" : ""}`} 
                <button onClick={() => handleKickPlayer(player)} 
                  className="btn-player" 
                  aria-label={"Kick player " + player.name}>Kick</button>
              </div>
            ),
          })).map(({ render }) => render())}
        </div>
        <div className="form-group">
          <button onClick={() => handleChangeGameState("game")} className="btn-submit" aria-label="Back to game">Back To Game</button>
        </div>
        <div className="form-group">
          <button onClick={handleExit} className="btn-submit" aria-label="Quit to desktop">Quit to Desktop</button>
        </div>
      </div>
    </div>
  );
};


SettingsScreen.propTypes = {
  gameState: PropTypes.object.isRequired,
  handleChangeGameState: PropTypes.func.isRequired,
};
