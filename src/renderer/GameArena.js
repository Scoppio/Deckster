import { PlayerTable } from './PlayerTable'
import { useEffect, useRef } from 'react';

export const GameArena = ({gameState}) => {

  const playerTable1 = useRef(null);
  const playerTable2 = useRef(null);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === '2') {
        playerTable2.current.focus();
      }
      else if (event.ctrlKey && event.key === '1') {
        playerTable1.current.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="container mt-2" role="main" aria-label="Game Arena">
      <div className="row">
        <div className="col">
          <PlayerTable gameState={gameState} playerRef={playerTable2} playerNumber={1} player={gameState.players[1]} isActivePlayer={gameState.activePlayer === 1} tabindex={gameState.players[1].tabIndices.playerTable} />
        </div>
      </div>
      <div className="row">
        <div className="col">
          <PlayerTable gameState={gameState} playerRef={playerTable1} playerNumber={0} player={gameState.players[0]} isActivePlayer={gameState.activePlayer === 0} tabindex={gameState.players[0].tabIndices.playerTable} />
        </div>
      </div>
    </div>
  )
}