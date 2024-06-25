import { useEffect } from 'react';
import PropTypes from "prop-types";
import './apiKeyForm.css';

export const SettingsScreen = ({ gameState, handleChangeGameState }) => {
  
  const handleExit = async (e) => {
    e.preventDefault();
    gameState.exitGame();
      
    setTimeout(() => {
      window.close();
    }, 300); // 500ms delay before closing the window

  };

  useEffect(() => {
    const handleKeyDown = (event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          handleChangeGameState("game");
        }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleChangeGameState]);
  
  return (
    <div className="form-container">
      <div className="form-box">
        <h2>Settings</h2>
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
