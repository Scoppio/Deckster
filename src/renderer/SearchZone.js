import { useEffect, useState } from 'react';
import { Droppable, DragDropContext } from "react-beautiful-dnd";
import {  ImgCardSearch } from "./FullCard";
import { CardPiles } from "../commons/CardPiles";
import style from "styled-components";
import PropTypes from "prop-types";

import './searchZone.css';

const CsCardHolder = style.div`
  padding: 8px;
  flex-direction: column;
  flex-grow: 1;
`;


export const SearchZone = ({ 
  gameState, 
  handleCloseCardOpenZone,
}) => {
  const usingCloseAndShuffle = gameState.searchZoneConfig.usingCloseAndShuffle; 
  const sourceZone = gameState.searchZoneConfig.sourceZone;
  const targetZones= gameState.searchZoneConfig.targetZones;

  const [searchString, setSearchString] = useState("");
  const [cardPiles, setCardPiles] = useState(new CardPiles().setSourceZone(sourceZone, gameState.open_zone.cards));
  // order the cards by name
  const [filteredCardList, setFilteredCardList] = useState([...gameState.open_zone.cards].sort((a, b) => a.name.localeCompare(b.name)));
  const [cardBeingDragged, setCardBeingDragged] = useState(null);

  useEffect(() => {
    let filteredCards;
    if (!searchString.trim()) {
      filteredCards = [...cardPiles[sourceZone]];
    } else {
      filteredCards = {
        ...cardPiles[sourceZone],
        cards: cardPiles[sourceZone].filter((card) =>
          card.name.toLowerCase().includes(searchString.toLowerCase())
        ),
      };
      filteredCards = filteredCards.cards;
      console.log(filteredCards); 
    }
    setFilteredCardList([...filteredCards].sort((a, b) => a.name.localeCompare(b.name)));
  }, [searchString, cardPiles, sourceZone]);

  const closeSearchZone = () => {
    gameState.cardsFromZone(cardPiles, usingCloseAndShuffle);
    handleCloseCardOpenZone();
  };
  
  const justCloseSearchZone = () => {
    handleCloseCardOpenZone();
  };

  const onDragEnd = (result, provided) => {
    const { source, destination } = result;
    const sourceOrigin = source.droppableId;
    
    if (result.reason === "CANCEL") {
      provided.announce(
        `Cancelling card movement, returning card to ${sourceOrigin}`
      );
      setCardBeingDragged(null);
      return;
    }
    if (result.reason === "DROP") {
      if (destination === null) {
        provided.announce(
          `Dropped in an invalid location, returning card to ${sourceOrigin}`
        );
        setCardBeingDragged(null);
        return;
      }
      

      const idx = cardPiles[sourceOrigin].findIndex((c) => c._uid === cardBeingDragged._uid);
      
      if (idx === -1) {
        return;
      }

      cardPiles[sourceOrigin].splice(idx, 1);

      const destinationZone = destination.droppableId;
      const destinationIndex = destination.index;

      if (cardPiles[destinationZone] === undefined) {
        cardPiles[destinationZone] = [];
      }

      cardPiles[destinationZone].splice(destinationIndex, 0, cardBeingDragged);

      provided.announce(
        "Moved " +
        cardBeingDragged.name +
          " from " +
          sourceOrigin +
          " to " +
          destinationZone +
          " at position " +
          destination.index
      );
      setCardBeingDragged(null);
      setCardPiles(new CardPiles(cardPiles));
    }
  };

  const onDragUpdate = (update, provided) => {
    console.log(update);
    const { destination } = update;
    if (destination !== null) {
      const destinationZone = destination.droppableId;
      provided.announce(destinationZone + " at position " + destination.index);
    }
  };

  const onDragStart = (start, provided) => {
    const { source } = start;
    const sourceOrigin = source.droppableId;
    const sourceIndex = source.index;
    let card = null;
    if (sourceOrigin === sourceZone) {
      card = filteredCardList[sourceIndex];
    } else {
      card = cardPiles[sourceOrigin][sourceIndex];
    }
    if (card === null) {
      return;
    }

    card &&
      provided.announce(
        "You lifted " +
          card.name +
          " in " +
          sourceOrigin +
          "at position " +
          source.index
      );
    setCardBeingDragged(card);
  };

  return (
    <div className="sc-form-container">
      <div className="sc-form-box">
        <div className="titleHideBtn">
          <button onClick={justCloseSearchZone} aria-label={"Close"}>
            Close
          </button>
          <label><center>Search</center></label>
          <input type="text" value={searchString} onChange={ (e) => setSearchString(e.target.value) } />
          { !!targetZones &&
          <button onClick={closeSearchZone} aria-label={"Finalize"}>
            Accept
          </button>
          }
        </div>
        <div className="body">
          <DragDropContext
            onDragEnd={onDragEnd}
            onDragUpdate={onDragUpdate}
            onDragStart={onDragStart}
          >
           
            {targetZones.map((zone, idx) => (
              <CardDroppable cardPiles={{ [zone]: cardPiles[zone]}} sourceZone={zone} key={idx} />
            ))}
            
            <CardDroppable cardPiles={{ [sourceZone]: filteredCardList }} sourceZone={sourceZone} />
          </DragDropContext>
        </div>
      </div>
    </div>
  );
};

SearchZone.propTypes = {
  gameState: PropTypes.object.isRequired,
  handleCloseCardOpenZone: PropTypes.func.isRequired,
};


const CardDroppable = ({ cardPiles, sourceZone }) => {
  const cards = cardPiles[sourceZone] || [];
  if (cards === undefined) {
    console.log("No cards in zone", sourceZone);
  }
  console.log(sourceZone, cards.length);

  return (
    <>
     <hr />
      <h4>{sourceZone}</h4>
        <Droppable
          droppableId={sourceZone}
          direction="horizontal"
          aria-label={sourceZone}
          role="region"
          style={{
            height: "auto",
            padding: "2px",
            backgroundColor: "red",
            overflowX: "auto"
          }}
        >
        {(provided) => (
          <CsCardHolder
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="Droppable"
          >
            {cards.map((card, idx) => (
              <ImgCardSearch
                idx={idx}
                gameState={null}
                size="normal"
                card={card}
                tabIndex={1000}
                cardHeight={"200px"}
                key={card._uid}
              />
            ))}
            {provided.placeholder}
          </CsCardHolder>
        )}
      </Droppable>
    </>
  );
};

CardDroppable.propTypes = {
  cardPiles: PropTypes.object.isRequired,
  sourceZone: PropTypes.string.isRequired,
};