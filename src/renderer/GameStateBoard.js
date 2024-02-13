import PropTypes from 'prop-types';
import Row from 'react-bootstrap/Row';
import { LogFrame } from './LogFrame';

export const GameStateBoard = ({gameState, playerRef }) => {

  return (
    <Row style={{width: "15vw", height: "100vh", background: "grey"}}>
      <CardEhxibilition gameState={gameState} height={"75%"} />
      <LogFrame gameState={gameState} height={25} playerRef={playerRef.log} />
    </Row>
  )
}

GameStateBoard.propTypes = {
  gameState: PropTypes.object.isRequired,
  playerRef: PropTypes.object.isRequired,
}

  export const CardEhxibilition = ({gameState, height}) => {
  return (
    <div style={({height})}>
    {
      gameState.focus_card ? 
        <>
          <Row>
            <h2 style={{ fontSize: '1vw', whiteSpace: 'nowrap', overflow: 'visible', textOverflow: 'ellipsis' }}>
              {gameState.focus_card.card_name}  {gameState.focus_card.card_mana_cost}
            </h2>
          </Row>
          <Row>
            <img src={gameState.focus_card.card_image_uris.normal} alt={gameState.focus_card.card_name} style={{width: "100%"}}/>
          </Row>
          <Row>
            <p>
              {gameState.focus_card.card_type_line}
            </p>
          </Row>
          <Row>
            <p>
              {gameState.focus_card.card_read_oracle_text}
            </p>
          </Row>
          <Row>
            <p>
              {gameState.focus_card.power_toughness}
            </p>
          </Row>
        </>
      : null
    }
  </div>
  )
}

CardEhxibilition.propTypes = {
  gameState: PropTypes.object.isRequired,
  height: PropTypes.string.isRequired,
}