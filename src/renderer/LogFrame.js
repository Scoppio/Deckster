import PropTypes from 'prop-types';
import { useEffect, useRef } from 'react';
import Row from 'react-bootstrap/Row';

export const LogFrame = ({gameState, height, playerRef }) => {
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [gameState.log]);

  return (
    <div style={{width: "100%", height: `${height}vh`, background: "green", overflowY: "auto", lineHeight: "20px"}} aria-live="assertive" aria-atomic="true" ref={playerRef.log}>
      {gameState.log.map((logEntry, idx) => <p key={idx} style={{margin: "0"}}>{JSON.stringify(logEntry)}</p>)}
      <div ref={endRef} />
    </div>
  )
}

LogFrame.propTypes = {
  gameState: PropTypes.object.isRequired,
  height: PropTypes.number.isRequired,
  playerRef: PropTypes.object.isRequired,
}