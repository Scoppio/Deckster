import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Dropdown from 'react-bootstrap/Dropdown';
import Row from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import FuckedCardBack from '../resources/cards/mtgcardback.png'


const TheLibrary = ({ player, playerRef, playerNumber, gameState }) => {
  
  const handleDrawHand = () => {
    gameState.drawHand();
  }

  const handleDrawCardToHand = () => {
    gameState.drawCard();
  }

  const handleDrawMultipleCardsToHand = (number_of_cards) => {
    gameState.drawCard(number_of_cards);
  }

  const handleDrawCardToBattlefield = () => {
    gameState.drawCardToBattlefield();
  }

  const handleDrawCardToGraveyard = () => {
    gameState.drawCardToGraveyard();
  }

  const handleDrawCardToExile = () => {
    gameState.drawCardToExile();
  }

  const handleDrawCardToFaceDown = () => {
    gameState.drawCardToFaceDown();
  }

  const handleShuffleDeck = () => {
    gameState.shuffleDeck();
  }

  return (
    <div className={"library row-flex"} 
      role="region"
      aria-describedby={playerNumber + "-library-desc"}>
      <Dropdown autoClose="outside" 
        tabIndex={player.tabIndices.library} >
          <Dropdown.Toggle 
          variant="secondary" 
          id="dropdown-autoclose-outside"
          ref={playerRef.library} 
          tabIndex={player.tabIndices.library} size="sm"
          onDoubleClick={handleDrawCardToHand}>
          <span id={playerNumber + "-library-label"}>Library</span>
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item as={CustomItem} onClick={handleDrawMultipleCardsToHand} text={"Draw x Cards"} eventKey="1" />
          <Dropdown.Divider />
          <Dropdown.Item onClick={handleDrawHand}>Draw Hand of 7 cards</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item onClick={handleShuffleDeck}>Shuffle Deck</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item onClick={handleDrawCardToHand}>Draw card to Hand</Dropdown.Item>
          <Dropdown.Item onClick={handleDrawCardToBattlefield}>Draw card to Battlefield</Dropdown.Item>
          <Dropdown.Item onClick={handleDrawCardToGraveyard}>Draw card to Graveyard</Dropdown.Item>
          <Dropdown.Item onClick={handleDrawCardToExile}>Draw card to Exile</Dropdown.Item>
          <Dropdown.Item onClick={handleDrawCardToFaceDown}>Draw card Face-Down</Dropdown.Item>
        </Dropdown.Menu>
{/* 
        <Dropdown.Toggle 
          variant="secondary" 
          id="dropdown-autoclose-outside"
          ref={playerRef.library} 
          tabIndex={player.tabIndices.library} size="sm"
          onDoubleClick={handleDrawCardToHand}>
          <span id={playerNumber + "-library-label"}>Library</span>
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item onClick={() => console.log("implement action")} >Draw x card
          </Dropdown.Item>
          <Dropdown.Item onClick={() => console.log("implement action")} >Mill x card</Dropdown.Item>
          <Dropdown.Item onClick={() => console.log("implement action")} >Exile x card</Dropdown.Item>
          <Dropdown.Item onClick={() => console.log("implement action")} >See the top X cards</Dropdown.Item>
          <Dropdown.Item onClick={() => console.log("implement action")} >Reveal X top cards</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item onClick={() => console.log("implement action")} >View all cards</Dropdown.Item> 
          <Dropdown.Item onClick={() => console.log("implement action")} >Play with top card revealed</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item onClick={handleDrawHand}>Draw Hand of 7 cards</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item onClick={handleShuffleDeck}>Shuffle Deck</Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item onClick={handleDrawCardToHand}>Draw card to Hand</Dropdown.Item>
          <Dropdown.Item onClick={handleDrawCardToBattlefield}>Draw card to Battlefield</Dropdown.Item>
          <Dropdown.Item onClick={handleDrawCardToGraveyard}>Draw card to Graveyard</Dropdown.Item>
          <Dropdown.Item onClick={handleDrawCardToExile}>Draw card to Exile</Dropdown.Item>
          <Dropdown.Item onClick={handleDrawCardToFaceDown}>Draw card Face-Down</Dropdown.Item>
        </Dropdown.Menu> */}
      </Dropdown>
      <p id={playerNumber + "-library-desc"}>{player.library_size} cards</p>
    </div>
  )
}

export const Library = ({ player, playerRef, playerNumber, gameState }) => (
  <TheLibrary player={player} playerRef={playerRef} playerNumber={playerNumber} gameState={gameState} />
)

Library.propTypes = {
  player: PropTypes.object.isRequired,
  playerRef: PropTypes.object.isRequired,
  playerNumber: PropTypes.number.isRequired,
  gameState: PropTypes.object.isRequired,
}


const CustomToggle = React.forwardRef(({ children, onClick, onDoubleClick }, ref) => (
  <div>
    <img
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
      onDoubleClick={(e) => {
        e.preventDefault();
        onDoubleClick(e);
      }}
      src={FuckedCardBack}
      alt="library"
      style={{transform: "rotate(90deg)", height: "40px"}}
    />
    {children}
    &#x25bc;
  </div>
));
CustomToggle.displayName = 'CustomToggle';

const CustomMenu = React.forwardRef(
  ({ children, style, className, text, 'aria-labelledby': labeledBy }, ref) => {
    const [value, setValue] = useState('');

    return (
      <div
        ref={ref}
        style={style}
        className={className}
        aria-labelledby={labeledBy}
      >
        <p>
        <span>{text}</span>
        <Form.Control
          autoFocus
          className="mx-3 my-2 w-auto"
          placeholder="Type to filter..."
          onChange={(e) => setValue(e.target.value)}
          value={value}
          aria-labelledby='Enter number of cards'
        />
        </p>
        <ul className="list-unstyled">
          {React.Children.toArray(children).filter(
            (child) =>
              !value || child.props.children.toLowerCase().startsWith(value),
          )}
        </ul>
      </div>
    );
  },
);

CustomMenu.displayName = 'CustomMenu';


const CustomItem = React.forwardRef(
  ({ onClick, style, className, text, 'aria-labelledby': labeledBy,  }, ref) => {
    const [value, setValue] = useState('');

    return (
      <div
        ref={ref}
        style={style}
        className={className}
        aria-labelledby={labeledBy}
      >
        <Row>
        <span>{text}</span>
        <Form.Control
          autoFocus
          className="mx-3 my-2 w-auto"
          placeholder="Type the number of cards to draw..."
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.stopPropagation()
              onClick(parseInt(value, 10))
            }
          }}
          value={value}
          aria-labelledby='Enter number of cards'
        />
        </Row>
      </div>
    );
  },
);

CustomItem.displayName = 'CustomItem';