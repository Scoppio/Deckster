import { ImgCardHand } from "./FullCard";
import { Droppable } from "react-beautiful-dnd";
import FuckedCardBack from "../resources/cards/mtgcardback.png";
import style from "styled-components";
import PropTypes from "prop-types";
import Row from "react-bootstrap/Row";

const CardHolder = style.div`
  padding: 8px;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  width: 75vw;
`;

const CardBackImg = ({ scale }) => {
  return (
    <img src={FuckedCardBack} alt="card back" style={{ height: `${scale}%` }} />
  );
};

export const HiddenHand = ({ player, playerNumber, handVh }) => {
  console.log(handVh);
  return (
    <div
      className="hand col"
      role="region"
      tabIndex={player.tabIndices.hand}
      aria-labelledby={playerNumber + "-player-hand-label"}
      aria-describedby={playerNumber + "-hand-desc"}
    >
      <div className="col" style={{ height: `${handVh}vh` }}>
        {player.hand.map((card, idx) => (
          <CardBackImg key={card._uid} scale={100} />
        ))}
      </div>
    </div>
  );
};

HiddenHand.propTypes = {
  player: PropTypes.object.isRequired,
  playerNumber: PropTypes.number.isRequired,
  handVh: PropTypes.number.isRequired,
};

export const Hand = ({ gameState, player, handVh }) => {
  return (
    <div>
      <Row>
        <ShownHand
          gameState={gameState}
          cards={player.hand}
          tabIndex={player.tabIndices.hand}
          handVh={handVh}
        />
      </Row>
    </div>
  );
};

Hand.propTypes = {
  gameState: PropTypes.object.isRequired,
  player: PropTypes.object.isRequired,
  playerRef: PropTypes.object.isRequired,
  handVh: PropTypes.number.isRequired,
};

export const ShownHand = ({ cards, gameState, tabIndex, handVh }) => {
  return (
    <div style={{ background: "grey", padding: "0px" }}>
      <Droppable
        droppableId="hand"
        direction="horizontal"
        style={{ padding: "0px" }}
      >
        {(provided) => (
          <CardHolder
            {...provided.droppableProps}
            ref={provided.innerRef}
            style={{ height: `${handVh}vh`, padding: "0px" }}
          >
            {cards.map((card, idx) => (
              <ImgCardHand
                key={card._uid}
                gameState={gameState}
                idx={idx}
                size="small"
                card={card}
                tabIndex={idx + tabIndex + 1}
                cardHeight={100}
              />
            ))}
            {provided.placeholder}
          </CardHolder>
        )}
      </Droppable>
    </div>
  );
};

ShownHand.propTypes = {
  cards: PropTypes.array.isRequired,
  tabIndex: PropTypes.number.isRequired,
  handVh: PropTypes.number.isRequired,
  gameState: PropTypes.object.isRequired,
};
