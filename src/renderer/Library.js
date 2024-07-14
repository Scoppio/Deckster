import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Dropdown from "react-bootstrap/Dropdown";
import Row from "react-bootstrap/Container";
import Col from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import DropdownMenuPortal from "../commons/DropdownMenuPortal";

const TheLibrary = ({ player, playerRef, playerNumber, gameState }) => {

  const [revealTopOfLibrary, setRevealTopOfLibrary] = useState(player.reveal_top_of_library);

  useEffect(() => { 
    setRevealTopOfLibrary(!!player.reveal_top_of_library);
  }, [player]);

  const handleDrawHand = () => {
    gameState.drawHand();
  };

  const handleDrawCardToHand = () => {
    gameState.drawCard();
  };

  const handleDrawCardToBattlefield = () => {
    gameState.drawCardToBattlefield();
  };

  const handleDrawCardToGraveyard = () => {
    gameState.drawCardToGraveyard();
  };

  const handleDrawCardToExile = () => {
    gameState.drawCardToExile();
  };

  const handleDrawCardToFaceDown = () => {
    gameState.drawCardToFaceDown();
  };

  const handleShuffleDeck = () => {
    gameState.shuffleDeck();
  };

  const openLibrary = () => {
    gameState.viewLibrary();
  };

  const viewTopXCards = (number_of_cards) => {
    gameState.viewTopXCards(number_of_cards);
  };

  return (
    <div
      className={"library"}
      role="region"
      aria-describedby={playerNumber + "-library-desc"}
      >
        
        <div style={{ display: 'flex', flexDirection: 'row' }}>
      <Dropdown drop="up" style={{ maxHeight: "100px", fontSize: "12px" }} autoClose="outside">
        <Dropdown.Toggle
          variant="secondary"
          id="dropdown-autoclose-outside"
          ref={playerRef.library}
          tabIndex={player.tabIndices.library}
          size="sm"
          onDoubleClick={handleDrawCardToHand}
        >
          <span id={playerNumber + "-library-label"}>Library</span>
        </Dropdown.Toggle>
        <DropdownMenuPortal>
          <Dropdown.Item onClick={() => viewTopXCards(1)}>
            View top 1 card
          </Dropdown.Item>
          <Dropdown.Item onClick={() => viewTopXCards(2)}>
            View top 2 cards
          </Dropdown.Item>
          <Dropdown.Item onClick={() => viewTopXCards(3)}>
            View top 3 cards
          </Dropdown.Item>
          <Dropdown.Item onClick={() => viewTopXCards(4)}>
            View top 4 cards
          </Dropdown.Item>
          <Dropdown.Item onClick={() => viewTopXCards(5)}>
            View top 5 cards
          </Dropdown.Item>
          <Dropdown.Item onClick={() => viewTopXCards(6)}>
            View top 6 cards
          </Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item>
            Library size: {player.library_size}
          </Dropdown.Item>
          <Dropdown.Item onClick={handleDrawHand}>
            Draw Hand of 7 cards
          </Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item onClick={openLibrary}>View cards</Dropdown.Item>
          <Dropdown.Item onClick={handleShuffleDeck}>
            Shuffle Deck
          </Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item onClick={handleDrawCardToHand}>
            Draw card to Hand
          </Dropdown.Item>
          <Dropdown.Item onClick={handleDrawCardToBattlefield}>
            Draw card to Battlefield
          </Dropdown.Item>
          <Dropdown.Item onClick={handleDrawCardToGraveyard}>
            Draw card to Graveyard
          </Dropdown.Item>
          <Dropdown.Item onClick={handleDrawCardToExile}>
            Draw card to Exile
          </Dropdown.Item>
          <Dropdown.Item onClick={handleDrawCardToFaceDown}>
            Draw card Face-Down
          </Dropdown.Item>
        </DropdownMenuPortal>
      </Dropdown>
      <span>({player.library_size})</span>
      </div>
      {revealTopOfLibrary && (
         <p style={{ fontSize: '10px' ,overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis'}}>{player.library_size > 0 && player.library[0].name}</p>)}
    </div>
  );
};

export const Library = ({ player, playerRef, playerNumber, gameState, handleChangeGameState }) => (
  <TheLibrary
    player={player}
    playerRef={playerRef}
    playerNumber={playerNumber}
    gameState={gameState}
    handleChangeGameState={handleChangeGameState}
  />
);

Library.propTypes = {
  player: PropTypes.object.isRequired,
  playerRef: PropTypes.object.isRequired,
  playerNumber: PropTypes.number.isRequired,
  gameState: PropTypes.object.isRequired,
  handleChangeGameState: PropTypes.func.isRequired,
};

const CustomItem = React.forwardRef(
  (
    {
      onConfirm,
      style,
      className,
      text,
      placeholder,
      ariaLabel: label,
    },
    ref
  ) => {
    const [value, setValue] = useState("");
    const handleConfirmation = () => onConfirm(parseInt(value, 10));

    return (
      <div
        ref={ref}
        style={style}
        className={className}
        aria-label={label}
      >
        <Row
          className="justify-content-md-center"
          style={{ display: "flex", alignItems: "center" }}
        >
          <Col>
            <span>{text}</span>
          </Col>
          <Col md="auto">
            <Form.Control
              autoFocus
              className="mx-3 my-2 w-auto"
              placeholder={placeholder}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && value !== "") {
                  e.stopPropagation();
                  handleConfirmation();
                  setValue("");
                }
              }}
              value={value}
              aria-label={label}
            />
          </Col>
        </Row>
      </div>
    );
  }
);

CustomItem.displayName = "CustomItem";
