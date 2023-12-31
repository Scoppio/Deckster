import { SouthTable, NorthTable } from './PlayerTable'
import { GameStateBoard } from './GameStateBoard'
import { useEffect, useRef, useMemo } from 'react';
import { HotKeys } from '../commons/Hotkeys';
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
  const player1CommanderZoneRef = useRef(null)
  const player1SideboardRef = useRef(null)

  const player1References = useMemo(() => ({
    playerStats: player1StatsRef,
    hand: player1HandRef,
    graveyard: player1GraveyardRef,
    exile: player1ExileRef,
    battlefield: player1BattlefieldRef,
    library: player1LibraryRef,
    faceDown: player1FaceDownRef,
    commanderZone: player1CommanderZoneRef,
    sideboard: player1SideboardRef,
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

  const hotkeys = useMemo(() => (new HotKeys(gameState, player1References, player2References, player3References, player4References, player5References, player6References)), 
    [gameState, player1References, player2References, player3References, player4References, player5References, player6References]);

  hotkeys.registerCtrlKeyCommand('1', () => {player1References.playerStats.current.focus()})
  hotkeys.registerCtrlKeyCommand('2', () => {player2References.playerStats.current.focus()})
  hotkeys.registerCtrlKeyCommand('3', () => {player3References.playerStats.current.focus()})
  hotkeys.registerCtrlKeyCommand('4', () => {player4References.playerStats.current.focus()})
  hotkeys.registerCtrlKeyCommand('5', () => {player5References.playerStats.current.focus()})
  hotkeys.registerCtrlKeyCommand('6', () => {player6References.playerStats.current.focus()})

  hotkeys.registerCtrlKeyCommand('e', () => {player1References.hand.current.focus()})
  hotkeys.registerCtrlKeyCommand('s', () => {player1References.battlefield.current.focus()})
  hotkeys.registerCtrlKeyCommand('d', () => {player1References.library.current.focus()})
  hotkeys.registerCtrlKeyCommand('f', () => {player1References.graveyard.current.focus()})
  hotkeys.registerCtrlKeyCommand('q', () => {player1References.exile.current.focus()})
  hotkeys.registerCtrlKeyCommand('w', () => {player1References.faceDown.current.focus()})
  hotkeys.registerCtrlKeyCommand('b', () => {player1References.commanderZone.current.focus()})
  // hotkeys.registerCtrlKeyCommand('r', () => {player1References.sideboard.current.focus()})
  // shift+A: mão
// shift+S: field
// shift+D: library
// shift+F: command
// shift+Q: Grave
// shift+W: exile
// shift+E: facedown
// shift+1-6: Avatar dos jogadores logo antes de seus fields.
  hotkeys.registerCtrlShiftKeyCommand('z', () => {gameState.moveSelectedToHand()})
  hotkeys.registerCtrlShiftKeyCommand('x', () => {gameState.moveSelectedToGraveyard()})
  hotkeys.registerCtrlShiftKeyCommand('c', () => {gameState.moveSelectedToExile()})
  hotkeys.registerCtrlShiftKeyCommand('v', () => {gameState.moveSelectedToLibrary()})
  hotkeys.registerCtrlShiftKeyCommand('b', () => {gameState.moveSelectedToCommandZone()})
  hotkeys.registerCtrlShiftKeyCommand('j', () => {gameState.tapUntapSelected()})
  hotkeys.registerCtrlShiftKeyCommand('l', () => {gameState.declareAttacking()})
  hotkeys.registerCtrlShiftKeyCommand('u', () => {gameState.declareBlocking()})
  hotkeys.registerCtrlShiftKeyCommand('i', () => {gameState.scry()})
  hotkeys.registerCtrlShiftKeyCommand('p', () => {gameState.addCounterOnSelected()})
  hotkeys.registerCtrlShiftKeyCommand('m', () => {gameState.removeCounterOnSelected()})
  hotkeys.registerCtrlShiftKeyCommand('comma', () => {gameState.untapAll()})
  hotkeys.registerCtrlShiftKeyCommand('period', () => {gameState.drawCard()})
  hotkeys.registerCtrlShiftKeyCommand('slash', () => {gameState.passTurn()})
  hotkeys.registerCtrlShiftKeyCommand('numpadadd', () => {gameState.addLife()})
  hotkeys.registerCtrlShiftKeyCommand('numpadsubtract', () => {gameState.removeLife()})
  hotkeys.registerCtrlShiftKeyCommand('numpadmultiply', () => {gameState.setLife()})
  // hotkeys.registerAltKeyCommand('j', () => {gameState.untapAll()})
  // hotkeys.registerAltKeyCommand('k', () => {gameState.drawCard()})
  // hotkeys.registerAltKeyCommand('l', () => {gameState.responseAlert()})
  // hotkeys.registerAltKeyCommand('i', () => {gameState.responseOk()})
  // hotkeys.registerAltKeyCommand('p', () => {gameState.passTurn()})
  // hotkeys.registerAltKeyCommand('add', () => {gameState.addLife()})
  // hotkeys.registerAltKeyCommand('subtract', () => {gameState.removeLife()})
  // alt+U, +I, +O: Whatever we deem necessary

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