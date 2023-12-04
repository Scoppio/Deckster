import { PlayerTable, OpponentTable } from './PlayerTable'
import { useEffect, useRef, useMemo } from 'react';

export const GameArena = ({gameState}) => {

  const player1TableRef = useRef(null);
  const player1StatsRef = useRef(null);
  const player1HandRef = useRef(null);
  const player1GraveyardRef = useRef(null);
  const player1ExileRef = useRef(null);
  const player1BattlefieldRef = useRef(null);
  const player1LibraryRef = useRef(null);
  const player1FaceDownRef = useRef(null);
  const player1CommanderZoneRef = useRef(null);

  const player2TableRef = useRef(null);
  const player2StatsRef = useRef(null);
  const player2HandRef = useRef(null);
  const player2GraveyardRef = useRef(null);
  const player2ExileRef = useRef(null);
  const player2BattlefieldRef = useRef(null);
  const player2LibraryRef = useRef(null);
  const player2FaceDownRef = useRef(null);
  const player2CommanderZoneRef = useRef(null);
  

  const player1References = useMemo(() => ({
    playerTable: player1TableRef,
    playerStats: player1StatsRef,
    hand: player1HandRef,
    graveyard: player1GraveyardRef,
    exile: player1ExileRef,
    battlefield: player1BattlefieldRef,
    library: player1LibraryRef,
    faceDown: player1FaceDownRef,
    commanderZone: player1CommanderZoneRef,
  }), []);

  const player2References = useMemo(() => ({
    playerTable: player2TableRef,
    playerStats: player2StatsRef,
    hand: player2HandRef,
    graveyard: player2GraveyardRef,
    exile: player2ExileRef,
    battlefield: player2BattlefieldRef,
    library: player2LibraryRef,
    faceDown: player2FaceDownRef,
    commanderZone: player2CommanderZoneRef,
  }), []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      const isMac = window.navigator.userAgent.includes('Macintosh');
      const isCommandKey = (isMac ? event.metaKey : event.ctrlKey) && event.shiftKey
      const isCtrlKey = (isMac ? event.metaKey : event.ctrlKey) && !event.shiftKey

      switch (event.key) {
        case 'a':
          if (isCommandKey) {
            player1References.playerStats.current.focus();
          }
          break;
        case 'h':
          if (isCommandKey)  {
            player1References.hand.current.focus();
          }
          break;
        case 'j':
          if (isCommandKey) {
            const firstTabElement = player1References.hand.current.querySelector('[tabIndex]');
            if (firstTabElement) {
              firstTabElement.focus();
            }
          }
          break;
        case 'e':
          if (isCommandKey) {
            player1References.exile.current.focus();
          }
          break;
        case 'c':
          if (isCommandKey) {
            player1References.commanderZone.current.focus();
          }
          break;
        case 'i':
          if (isCommandKey) {
            player1References.library.current.focus();
          }
          break;
        case 'f':
          if (isCommandKey) {
            player1References.faceDown.current.focus();
          }
          break;
        case 'b':
          if (isCommandKey) {
            player1References.battlefield.current.focus();
          }
          break;
        case 'g':
          if (isCommandKey) {
            player1References.graveyard.current.focus();
          }
          break;
        case '1':
          if (isCommandKey) {
            const firstTabElement = player1References.battlefield.current.querySelector('[tabIndex]');
            if (firstTabElement) {
              firstTabElement.focus();
            }
          } else if (isCtrlKey) {
            player1References.playerTable.current.focus();
          }
          break;
        case '2':
          if (isCommandKey) {
            const firstTabElement = player2References.battlefield.current.querySelector('[tabIndex]');
            if (firstTabElement) {
              firstTabElement.focus();
            }
          } else if (isCtrlKey) {
            player2References.playerTable.current.focus();
          }
          break;
        default:
          break;
      }
    }
 
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [player1References, player2References]);

  return (
    <div id="game-arena" className="container min-vh-100" role="main" aria-label="Game Arena">
      <OpponentTable gameState={gameState} playerRef={player2References} playerNumber={1} player={gameState.players[1]} isActivePlayer={gameState.activePlayer === 1} tabindex={gameState.players[1].tabIndices.playerTable} />
      <PlayerTable gameState={gameState} playerRef={player1References} playerNumber={0} player={gameState.players[0]} isActivePlayer={gameState.activePlayer === 0} tabindex={gameState.players[0].tabIndices.playerTable} />
    </div>
  )
}