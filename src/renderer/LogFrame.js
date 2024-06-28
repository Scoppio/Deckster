import PropTypes from "prop-types";
import style from "styled-components";

const HiddenText = style.div`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
`;

export const LogFrame = ({ gameState, height, playerRef }) => {
  return (
    <div
    style={{
      width: "100%",
      height: "100%",
      background: "#f0f0f0bb",
      overflowY: "auto",
      overflowX: "hidden",
      lineHeight: "20px",
      fontSize: "12px",
      margin: "1px"
    }}
    >
      {gameState.log.length > 0 && (
        <span aria-live="assertive" aria-atomic="true" ref={playerRef.log}>
          <p style={{ margin: "0", wordWrap: "break-word", overflowWrap: "break-word" }}>{gameState.log[0]}</p>
        </span>
      )}
      {gameState.log.slice(1).map((logEntry, idx) => (
        <p key={idx + 1} style={{ margin: "0", wordWrap: "break-word", overflowWrap: "break-word" }}>
          {logEntry}
        </p>
      ))}
    </div>
  );
};

LogFrame.propTypes = {
  gameState: PropTypes.object.isRequired,
  playerRef: PropTypes.object.isRequired,
};

export const AnnouncementFrame = ({ gameState }) => {
  return (
    <HiddenText aria-live="assertive" aria-atomic="true">
      <p>{gameState.announcement_message}</p>
    </HiddenText>
  );
};

AnnouncementFrame.propTypes = {
  gameState: PropTypes.object.isRequired,
};
