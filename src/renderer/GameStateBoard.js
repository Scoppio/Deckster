import PropTypes from 'prop-types';
import Row from 'react-bootstrap/Row';
import { LogFrame } from './LogFrame';

export const GameStateBoard = ({gameState, playerRef }) => {

  return (
    <Row style={{width: "15vw", height: "100vh", background: "grey"}}>
      <h1>Game State Board</h1>
      <p>Here should go things like the card you are hovering the mouse over or selected cards (show the last selected)</p>
      <LogFrame gameState={gameState} height={50} playerRef={playerRef.log} />
    </Row>
  )
}

GameStateBoard.propTypes = {
  gameState: PropTypes.object.isRequired,
  playerRef: PropTypes.object.isRequired,
}