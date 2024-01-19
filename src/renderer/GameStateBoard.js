import PropTypes from 'prop-types';
import Row from 'react-bootstrap/Row';
import { LogFrame } from './LogFrame';

export const GameStateBoard = ({gameState, playerRef }) => {

  return (
    <Row style={{width: "15vw", height: "100vh", background: "grey"}}>
      <h1>Game State Board</h1>
      <p>Here should go things like the card you are hovering the mouse over or selected cards (show the last selected)</p>
      {
        gameState.focus_card ? 
          <div>
            <h2>Focus Card</h2>
            <p>{gameState.focus_card.name}</p>
            <img src={gameState.focus_card.image_uris.normal} alt={gameState.focus_card.name} />
            <p>
              {gameState.focus_card.oracle_text}
            </p>
          </div>
        : null
      }
      <LogFrame gameState={gameState} height={50} playerRef={playerRef.log} />
    </Row>
  )
}

GameStateBoard.propTypes = {
  gameState: PropTypes.object.isRequired,
  playerRef: PropTypes.object.isRequired,
}