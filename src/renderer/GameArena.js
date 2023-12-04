import { PlayerTable } from './PlayerTable'
import { useEffect, useRef, useMemo, useState } from 'react';

export const GameArena = ({gameState}) => {

  const player1TableRef = useRef(null);
  const player1StatsRef = useRef(null);
  const player1HandRef = useRef(null);
  const player1GraveyardRef = useRef(null);
  const player1ExileRef = useRef(null);
  const player1BattlefieldRef = useRef(null);
  const player1DeckRef = useRef(null);
  const player1FaceDownRef = useRef(null);
  const player1CommanderZoneRef = useRef(null);

  const player2TableRef = useRef(null);
  const player2StatsRef = useRef(null);
  const player2HandRef = useRef(null);
  const player2GraveyardRef = useRef(null);
  const player2ExileRef = useRef(null);
  const player2BattlefieldRef = useRef(null);
  const player2DeckRef = useRef(null);
  const player2FaceDownRef = useRef(null);
  const player2CommanderZoneRef = useRef(null);
  

  const player1References = useMemo(() => ({
    playerTable: player1TableRef,
    playerStats: player1StatsRef,
    hand: player1HandRef,
    graveyard: player1GraveyardRef,
    exile: player1ExileRef,
    battlefield: player1BattlefieldRef,
    deck: player1DeckRef,
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
    deck: player2DeckRef,
    faceDown: player2FaceDownRef,
    commanderZone: player2CommanderZoneRef,
  }), []);

  const [isCtrlPressed, setIsCtrlPressed] = useState(false);
  const [isAltPressed, setIsAltPressed] = useState(false);
  const [isShiftPressed, setIsShiftPressed] = useState(false);
  

  useEffect(() => {
    const handleKeyUp = (event) => {
      switch (event.key) {
        case "Meta":
        case 'Control':
          setIsCtrlPressed(false);
          break;
        case 'Alt':
        case 'Option':
          setIsAltPressed(false);
          break;
        case 'Shift':
          setIsShiftPressed(false);
          break;
        default:
          break;
      }
    };

    const handleKeyDown = (event) => {
      switch (event.key) {
        case "Meta":
        case 'Control':
          setIsCtrlPressed(true);
          break;
        case 'Alt':
        case 'Option':
          setIsAltPressed(true);
          break;
        case 'Shift':
          setIsShiftPressed(true);
          break;
        case 'h':
          if (isCtrlPressed && isShiftPressed) {
            const firstTabElement = player1References.hand.current.querySelector('[tabIndex]');
            if (firstTabElement) {
              firstTabElement.focus();
            }
          } else if (isCtrlPressed) {
            player1References.hand.current.focus();
          }
          break;
        case 'e':
          if (isCtrlPressed) {
            player1References.exile.current.focus();
          }
          break;
        case 'c':
          if (isCtrlPressed) {
            player1References.commanderZone.current.focus();
          }
          break;
        case 'l':
          if (isCtrlPressed) {
            player1References.deck.current.focus();
          }
          break;
        case 'f':
          if (isCtrlPressed) {
            player1References.faceDown.current.focus();
          }
          break;
        case 'b':
          if (isCtrlPressed) {
            player1References.battlefield.current.focus();
          }
          break;
        case 'g':
          if (isCtrlPressed) {
            player1References.graveyard.current.focus();
          }
          break;
        case '1':
          if (isCtrlPressed) {
            player1References.playerTable.current.focus();
          }
          break;
        case '2':
          if (isCtrlPressed) {
            player2References.playerTable.current.focus();
          }
          break;
        default:
          break;
      }
    }
 
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [player1References, player2References, isAltPressed, setIsAltPressed, isCtrlPressed, setIsCtrlPressed, isShiftPressed, setIsShiftPressed]);

  return (
    <div className="container mt-2" role="main" aria-label="Game Arena">
      <div className="row">
        <div className="col">
          <PlayerTable gameState={gameState} playerRef={player2References} playerNumber={1} player={gameState.players[1]} isActivePlayer={gameState.activePlayer === 1} tabindex={gameState.players[1].tabIndices.playerTable} />
        </div>
      </div>
      <div className="row">
        <div className="col">
          <PlayerTable gameState={gameState} playerRef={player1References} playerNumber={0} player={gameState.players[0]} isActivePlayer={gameState.activePlayer === 0} tabindex={gameState.players[0].tabIndices.playerTable} />
        </div>
      </div>
    </div>
  )
}