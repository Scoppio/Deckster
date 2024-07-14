import { useEffect, useRef } from "react";
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

export const LogFrame = ({ gameState, playerRef }) => {
  const inputRef = useRef(null);
  
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === ";") {
        if (event.target.tagName !== 'INPUT' && event.target.tagName !== 'TEXTAREA') {
          inputRef.current.focus();
          event.preventDefault();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleKeyDown = (event) => {
    event.stopPropagation();
    if (event.key === "Enter") {
      if (onEnterPress) {
        onEnterPress(event.target.value);
      }
      event.target.value = "";
    }
  };

  const onEnterPress = (value) => {
    if (value) {
      gameState.sendChatMessage(value);
    }
  };

  return (
    <>
    <input
        type="text"
        ref={inputRef}
        onKeyDown={handleKeyDown}
        style={{ width: "100%", marginBottom: "10px" }}
      />
    <div
    className="chatbox"
    aria-label="Chatbox"
    role="region"
    style={{
      width: "100%",
      height: "80%",
      background: "#f0f0f0bb",
      overflowY: "auto",
      overflowX: "hidden",
      lineHeight: "20px",
      fontSize: "12px",
      margin: "1px"
    }}
    ref={playerRef.log}
    tabIndex={0}>
      
      {gameState.log.length > 0 && (
        <span aria-live="assertive" aria-atomic="true">
          <p style={{ margin: "0", wordWrap: "break-word", overflowWrap: "break-word" }}>{gameState.log[0]}</p>
        </span>
      )}
      {gameState.log.slice(1).map((logEntry, idx) => (
        <p key={idx + 1} style={{ margin: "0", wordWrap: "break-word", overflowWrap: "break-word" }}>
          {logEntry}
        </p>
      ))}
    </div>
    </>
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
