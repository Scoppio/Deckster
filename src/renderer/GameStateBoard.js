import PropTypes from 'prop-types';
import Row from 'react-bootstrap/Row';
import { LogFrame } from './LogFrame';

export const GameStateBoard = ({gameState, playerRef }) => {

  return (
    <Row style={{width: "15vw", height: "100vh", background: "grey"}}>
      <div style={ {height: "75%"}}>
        {
          gameState.focus_card ? 
            <div>
              <h2>{gameState.focus_card.card_name}  {gameState.focus_card.card_mana_cost}</h2>
              <img src={gameState.focus_card.card_image_uris.normal} alt={gameState.focus_card.card_name} style={{width: "100%"}}/>
              <p>
                {gameState.focus_card.card_type_line}
              </p>
              <p>
                {gameState.focus_card.card_read_oracle_text}
              </p>
              <p>
              {gameState.focus_card.power_toughness}
              </p>
            </div>
          : null
        }
      </div>
      <LogFrame gameState={gameState} height={25} playerRef={playerRef.log} />
    </Row>
  )
}

GameStateBoard.propTypes = {
  gameState: PropTypes.object.isRequired,
  playerRef: PropTypes.object.isRequired,
}