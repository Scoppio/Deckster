import { useEffect, useState } from 'react';
import { Droppable } from "react-beautiful-dnd";
import { ImgCardHand } from "./FullCard";
import style from "styled-components";
import PropTypes from "prop-types";

import './apiKeyForm.css';

const CardHolder = style.div`
  padding: 8px;
  display: flex;
`;

export class CardOpenZoneConfig {
  constructor(
    toHand=false,
    toBattlefield=false,
    toGraveyard=false,
    toExile=false,
    toCommand=false,
    toFacedown=false,
    toLibraryBottom=false,
    toLibraryBottomRandom=false,
    toLibraryTop=false
  ) {
    this.toHand = toHand;
    this.toBattlefield = toBattlefield;
    this.toGraveyard = toGraveyard;
    this.toExile = toExile;
    this.toCommand = toCommand;
    this.toFacedown = toFacedown;
    this.toLibraryTop = toLibraryTop;
    this.toLibraryBottom = toLibraryBottom;
    this.toLibraryBottomRandom = toLibraryBottomRandom;
  }
}

const EmtpyCardOpenZoneConfig = new CardOpenZoneConfig();

class CardPiles {
  constructor(cardPiles) {
    this.hand = cardPiles.hand || [];
    this.exile = cardPiles.exile || [];
    this.command = cardPiles.command || [];
    this.facedown = cardPiles.facedown || [];
    this.graveyard = cardPiles.graveyard || [];
    this.libraryTop = cardPiles.libraryTop || [];
    this.battlefield = cardPiles.battlefield || [];
    this.libraryBottom = cardPiles.libraryBottom || [];
    this.libraryBottomRandom = cardPiles.libraryBottomRandom || [];
  }
}

export const CardOpenZone = ({ 
  gameState, 
  handleCloseCardOpenZone, 
  usingCloseAndShuffle, 
  sourceZone, 
  cardOpenZoneConfig=EmtpyCardOpenZoneConfig,
}) => {

  const cardPiles = new CardPiles();
  
  const [config, setConfig] = useState(cardOpenZoneConfig);
  const [cardList, setCardList] = useState([...gameState.open_zone]);
  const [filteredCardList, setFilteredCardList] = useState(cardList);
  const [searchString, setSearchString] = useState("");

  useEffect(() => {
    let filteredCards;
    if (!searchString.trim()) {
      // searchString is empty, blank, or null
      filteredCards = cardList;
    } else {
      // Filter cardList based on searchString
      filteredCards = {
        ...cardList,
        cards: cardList.cards.filter((card) =>
          card.name.toLowerCase().includes(searchString.toLowerCase())
        ),
      };
    }
  
    setFilteredCardList(filteredCards);
  }, [searchString, cardList]);

  useEffect(() => {
    setCardList(gameState.open_zone);
  }, [gameState.open_zone]);

  const closeAndShuffle = () => {
    gameState.shuffleLibrary();
    handleCloseCardOpenZone();
  };

  const closeModal = () => {
    handleCloseCardOpenZone();
  };

  return (
    <div className="form-container">
      <div className="form-box">
        <div className="modalBackground">
          <div className="modalContainer">
            <div className="titleHideBtn">
              { 
                usingCloseAndShuffle ?
                  <button onClick={closeAndShuffle}>Close & Shuffle</button> :
                  <button onClick={closeModal}>Close</button>
              }
              <label>Search</label>
              <input type="text" value={searchString} onChange={ (e) => setSearchString(e.target.value) } />
            </div>
            <div className="body">
              <div className="form-group">
                <Droppable
                  droppableId={sourceZone}
                  direction="horizontal"
                  aria-label={sourceZone}
                  role="region"
                >
                  {(provided) => (
                    <CardHolder
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      style={{ height: "75px", padding: "2px", "background-color": "red" }}
                      className="Droppable"
                      aria-label={sourceZone}
                    >
                      {filteredCardList.cards.map((card, idx) => (
                        <ImgCardHand
                          idx={idx}
                          gameState={gameState}
                          size="small"
                          card={card}
                          tabIndex={idx + 1}
                          cardHeight={100}
                          key={card._uid}
                        />
                      ))}
                      {provided.placeholder}
                    </CardHolder>
                  )}
                </Droppable>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


CardOpenZone.propTypes = {
  gameState: PropTypes.object.isRequired,
  handleCloseCardOpenZone: PropTypes.func.isRequired,
  usingCloseAndShuffle: PropTypes.bool.isRequired,
  sourceZone: PropTypes.string.isRequired,
  cardOpenZoneConfig: PropTypes.object.isRequired,
};
