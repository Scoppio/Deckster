import React, { useState } from "react";
import PropTypes from "prop-types";
import Dropdown from "react-bootstrap/Dropdown";
import Row from "react-bootstrap/Container";
import Col from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import DropdownMenuPortal from "../commons/DropdownMenuPortal";

const TheLibrary = ({ player, playerRef, playerNumber, gameState }) => {
  const handleDrawHand = () => {
    gameState.drawHand();
  };

  const handleDrawCardToHand = () => {
    gameState.drawCard();
  };

  const handleDrawMultipleCardsToHand = (number_of_cards) => {
    gameState.drawCard(number_of_cards);
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

  const handleDrawMultipleCardsToBattlefield = (number_of_cards) => {
    gameState.drawCard(number_of_cards, "library", "back_battlefield");
  };

  const handleDrawMultipleCardsToExile = (number_of_cards) => {
    gameState.drawCard(number_of_cards, "library", "exile");
  };

  const handleDrawMultipleCardsFaceDown = (number_of_cards) => {
    gameState.drawCard(number_of_cards, "library", "faceDown");
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
      style={{ display: 'flex', alignItems: 'center' }}
      >
      <Dropdown drop="up" style={{ maxHeight: "100px" }} autoClose="outside">
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
          <Dropdown.Item
            as={CustomItem}
            onConfirm={handleDrawMultipleCardsToHand}
            text={"Hand"}
            placeholder={"Hand, type the number of cards to draw to hand..."}
            aria-labelledby={
              "Hand, type the number of cards to draw to hand, hit enter to confirm"
            }
          />
          <Dropdown.Item
            as={CustomItem}
            onConfirm={handleDrawMultipleCardsToBattlefield}
            text={"Battlefield"}
            placeholder={
              "Battlefield, type the number of cards put in the battlefield..."
            }
            aria-labelledby={
              "Battlefield, type the number of cards put in the battlefield, hit enter to confirm"
            }
          />
          <Dropdown.Item
            as={CustomItem}
            onConfirm={handleDrawMultipleCardsToExile}
            text={"Exile"}
            placeholder={"Exile, type the number of cards to exile..."}
            aria-labelledby={
              "Exile, type the number of cards to exile, hit enter to confirm"
            }
          />
          <Dropdown.Item
            as={CustomItem}
            onConfirm={handleDrawMultipleCardsFaceDown}
            text={"Facedown"}
            placeholder={
              "Facedown, type the number of cards to set facedown..."
            }
            aria-labelledby={
              "Facedown, type the number of cards to set facedown, hit enter to confirm"
            }
          />
          <Dropdown.Item
            as={CustomItem}
            onConfirm={viewTopXCards}
            text={"View Top X"}
            placeholder={"View top X amount of cards..."}
            aria-labelledby={"View top X amount of cards, hit enter to confirm"}
          />
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
  );
};

export const Library = ({ player, playerRef, playerNumber, gameState }) => (
  <TheLibrary
    player={player}
    playerRef={playerRef}
    playerNumber={playerNumber}
    gameState={gameState}
  />
);

Library.propTypes = {
  player: PropTypes.object.isRequired,
  playerRef: PropTypes.object.isRequired,
  playerNumber: PropTypes.number.isRequired,
  gameState: PropTypes.object.isRequired,
};

const CustomItem = React.forwardRef(
  (
    {
      onConfirm,
      style,
      className,
      text,
      placeholder,
      "aria-labelledby": labelledBy,
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
        aria-labelledby={labelledBy}
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
              aria-labelledby={labelledBy}
            />
          </Col>
        </Row>
      </div>
    );
  }
);

CustomItem.displayName = "CustomItem";
