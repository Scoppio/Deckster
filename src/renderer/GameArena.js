import { SouthTable, NorthTable } from './PlayerTable'
import { GameStateBoard } from './GameStateBoard'
import { useEffect, useRef, useMemo } from 'react';
import { HotKeys } from '../controllers/Hotkeys';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import PropTypes from 'prop-types';

export const GameArena = ({gameState}) => {

  const player1StatsRef = useRef(null)
  const player1HandRef = useRef(null)
  const player1GraveyardRef = useRef(null)
  const player1ExileRef = useRef(null)
  const player1BattlefieldRef = useRef(null)
  const player1LibraryRef = useRef(null)
  const player1FaceDownRef = useRef(null)
  const player1commanderZoneRef = useRef(null)
  const player1SideboardRef = useRef(null)
  const player1LogRef = useRef(null)

  const player1References = useMemo(() => ({
    playerStats: player1StatsRef,
    hand: player1HandRef,
    graveyard: player1GraveyardRef,
    exile: player1ExileRef,
    battlefield: player1BattlefieldRef,
    library: player1LibraryRef,
    faceDown: player1FaceDownRef,
    commander_zone: player1commanderZoneRef,
    sideboard: player1SideboardRef,
    log: player1LogRef,
  }), [])

  const player2StatsRef = useRef(null)
  const player2References = useMemo(() => ({playerStats: player2StatsRef}), [])

  const player3StatsRef = useRef(null)
  const player3References = useMemo(() => ({playerStats: player3StatsRef}), [])

  const player4StatsRef = useRef(null)
  const player4References = useMemo(() => ({playerStats: player4StatsRef}), [])

  const player5StatsRef = useRef(null)
  const player5References = useMemo(() => ({playerStats: player5StatsRef}), [])

  const player6StatsRef = useRef(null)
  const player6References = useMemo(() => ({playerStats: player6StatsRef}), [])

  const hotkeys = useMemo(() => (new HotKeys(gameState, [player1References, player2References, player3References, player4References, player5References, player6References])), 
    [gameState, player1References, player2References, player3References, player4References, player5References, player6References]);

  hotkeys.registerKeyCommand('F1', () => {gameState.listCommands(hotkeys)}, "List all commands.")
  hotkeys.registerCtrlKeyCommand('1', () => {hotkeys.playerRefs[1].playerStats.current.focus()}, "Player 1 (You) stats.")
  hotkeys.registerCtrlKeyCommand('2', () => {hotkeys.playerRefs[2].playerStats.current.focus()}, "Player 2 stats.")
  hotkeys.registerCtrlKeyCommand('3', () => {hotkeys.playerRefs[3].playerStats.current.focus()}, "Player 3 stats.")
  hotkeys.registerCtrlKeyCommand('4', () => {hotkeys.playerRefs[4].playerStats.current.focus()}, "Player 4 stats.")
  hotkeys.registerCtrlKeyCommand('5', () => {hotkeys.playerRefs[5].playerStats.current.focus()}, "Player 5 stats.")
  hotkeys.registerCtrlKeyCommand('6', () => {hotkeys.playerRefs[6].playerStats.current.focus()}, "Player 6 stats.")

  hotkeys.registerCtrlKeyCommand('e', () => {hotkeys.playerRefs[1].hand.current.focus()}, "Your hand.")
  hotkeys.registerCtrlKeyCommand('s', () => {hotkeys.playerRefs[1].battlefield.current.focus()}, "Your battlefield.")
  hotkeys.registerCtrlKeyCommand('d', () => {hotkeys.playerRefs[1].library.current.focus()}, "Your library.")
  hotkeys.registerCtrlKeyCommand('f', () => {hotkeys.playerRefs[1].graveyard.current.focus()}, "Your graveyard.")
  hotkeys.registerCtrlKeyCommand('q', () => {hotkeys.playerRefs[1].exile.current.focus()}, "Your exile.")
  hotkeys.registerCtrlKeyCommand('h', () => {hotkeys.playerRefs[1].faceDown.current.focus()}, "Your face down cards.")
  hotkeys.registerCtrlKeyCommand('b', () => {hotkeys.playerRefs[1].commander_zone.current.focus()}, "Your commander zone.")
  hotkeys.registerCtrlKeyCommand('z', () => {hotkeys.playerRefs[1].sideboard.current.focus()}, "Your sideboard.")
  
  hotkeys.registerCtrlShiftKeyCommand('Z', () => {gameState.moveSelectedToHand()}, "Move selected cards to your hand.") 
  hotkeys.registerCtrlShiftKeyCommand('X', () => {gameState.moveSelectedToGraveyard()}, "Move selected cards to your graveyard.")
  hotkeys.registerCtrlShiftKeyCommand('C', () => {gameState.moveSelectedToExile()}, "Move selected cards to your exile zone.")
  hotkeys.registerCtrlShiftKeyCommand('V', () => {gameState.moveSelectedToLibrary()}, "Move selected cards to your library.")
  hotkeys.registerCtrlShiftKeyCommand('B', () => {gameState.moveSelectedToCommandZone()}, "Move selected cards to your command zone.")
  hotkeys.registerCtrlShiftKeyCommand('J', () => {gameState.tapUntapSelected()}, "Tap/Untap selected cards.")
  hotkeys.registerCtrlShiftKeyCommand('L', () => {gameState.declareAttacking()}, "Declare attacking with selected cards.")
  hotkeys.registerCtrlShiftKeyCommand('U', () => {gameState.declareBlocking()}, "Declare blocking with selected cards.")
  hotkeys.registerCtrlShiftKeyCommand('I', () => {gameState.scry()}, "Scry the top card of your library.")
  hotkeys.registerCtrlShiftKeyCommand('P', () => {gameState.addCounterOnSelected()}, "Add a counter on selected cards.")
  hotkeys.registerCtrlShiftKeyCommand('M', () => {gameState.removeCounterOnSelected()}, "Remove a counter on selected cards.")

  hotkeys.registerKeyCommand('x', () => {gameState.untapAll()}, "Untap all your permanents.")
  hotkeys.registerKeyCommand('+', () => {gameState.drawCard()}, "Draw a card.")
  hotkeys.registerKeyCommand('<', () => {gameState.untapAll()}, "Untap all your permanents.")
  hotkeys.registerKeyCommand('>', () => {gameState.drawCard()}, "Draw a card.")
  hotkeys.registerKeyCommand('c', () => {gameState.drawCard()}, "Draw a card.")
  hotkeys.registerKeyCommand('-', () => {gameState.decreaseLife()}, "Decrease your life total.")
  hotkeys.registerKeyCommand('=', () => {gameState.increaseLife()}, "Increase your life total.")
  hotkeys.registerKeyCommand('*', () => {gameState.increaseLife()}, "Increase your life total.")
  
  useEffect(() => {
    const handleKeyDown = (event) => {
      hotkeys.handleKeyDown(event);
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    }
  }, [hotkeys]);

  return (
    <Row>
      <Col>
        {gameState.players.length === 1 || gameState.players.length === 2 ? (
          <>
          <Row>
            <NorthTable barSide="left" gameState={gameState} playerRef={player2References} heightVh={100/2}
            playerNumber={1} player={gameState.players[1]} isActivePlayer={gameState.activePlayer === 1} landsOnNorth={true} />
          </Row>
          <Row>
            <SouthTable gameState={gameState} playerRef={player1References} playerNumber={0} heightVh={100/2}
            player={gameState.players[0]} isActivePlayer={gameState.activePlayer === 0} />
          </Row>
          
          </>
         ) : gameState.players.length === 3 || gameState.players.length === 4 ? (
          <>
          <Row>
            <NorthTable barSide="left" gameState={gameState} playerRef={player2References} heightVh={100/2}
            playerNumber={1} player={gameState.players[1]} isActivePlayer={gameState.activePlayer === 1} landsOnNorth={true} />
          </Row>
          <Row>
            <SouthTable gameState={gameState} playerRef={player1References} playerNumber={0} heightVh={100/2}
            player={gameState.players[0]} isActivePlayer={gameState.activePlayer === 0} />
          </Row>
          </>
         ) : (
          <>
          <Row>
            <NorthTable barSide="left" gameState={gameState} playerRef={player2References} heightVh={100/3}
            playerNumber={1} player={gameState.players[1]} isActivePlayer={gameState.activePlayer === 1} landsOnNorth={true} />
          </Row>
          <Row>
            <NorthTable barSide="left" gameState={gameState} playerRef={player2References} heightVh={100/3}
            playerNumber={1} player={gameState.players[1]} isActivePlayer={gameState.activePlayer === 1} landsOnNorth={true} />
          </Row>
          <Row>
            <SouthTable gameState={gameState} playerRef={player1References} playerNumber={0} heightVh={100/3}
            player={gameState.players[0]} isActivePlayer={gameState.activePlayer === 0} />
          </Row>
          </>
         )
        }
      </Col>
      {
      gameState.players.length === 3 || gameState.players.length === 4 ? (
        <Col>
          <Row>
            <NorthTable barSide="right" gameState={gameState} playerRef={player2References} heightVh={100/2}
            playerNumber={1} player={gameState.players[1]} isActivePlayer={gameState.activePlayer === 1} landsOnNorth={true} />
          </Row>
          <Row>
            <NorthTable barSide="right" gameState={gameState} playerRef={player2References} heightVh={100/2}
            playerNumber={1} player={gameState.players[1]} isActivePlayer={gameState.activePlayer === 1} landsOnNorth={false} />
          </Row>
        </Col>
        ): gameState.players.length === 5 || gameState.players.length === 6 ? (
          <Col>
          <Row>
            <NorthTable barSide="right" gameState={gameState} playerRef={player2References} heightVh={100/3}
            playerNumber={1} player={gameState.players[1]} isActivePlayer={gameState.activePlayer === 1} landsOnNorth={true} />
          </Row>
          <Row>
            <NorthTable barSide="right" gameState={gameState} playerRef={player2References} heightVh={100/3}
            playerNumber={1} player={gameState.players[1]} isActivePlayer={gameState.activePlayer === 1} landsOnNorth={true} />
          </Row>
          <Row>
            <NorthTable barSide="right" gameState={gameState} playerRef={player2References} heightVh={100/3}
            playerNumber={1} player={gameState.players[1]} isActivePlayer={gameState.activePlayer === 1} landsOnNorth={false} />
          </Row>
        </Col>
      ): null
      }
      <Col md="auto" style={({backgroundColor: "green"})}>
        <GameStateBoard gameState={gameState} playerRef={player1References} />
      </Col>
    </Row>
  )
}

GameArena.propTypes = {
  gameState: PropTypes.object.isRequired,
}