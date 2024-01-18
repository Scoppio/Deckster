import PropTypes from 'prop-types';
import Row from 'react-bootstrap/Row';

export const LogFrame = ({gameState, height, playerRef }) => {
  return (
    <Row style={{width: "100%", height: `${height}vh`, background: "green", overflowY: "auto"}} aria-live="assertive" aria-atomic="true" ref={playerRef.log}>
      {gameState.log.map((logEntry, idx) => <p key={idx}>{JSON.stringify(logEntry)}</p>)}
    </Row>
  )
}

LogFrame.propTypes = {
  gameState: PropTypes.object.isRequired,
  height: PropTypes.number.isRequired,
  playerRef: PropTypes.object.isRequired,
}