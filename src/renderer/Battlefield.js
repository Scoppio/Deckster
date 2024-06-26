import { Droppable } from "react-beautiful-dnd";
import { StaticImgCard, ImgCard } from "./FullCard";
import PropTypes from "prop-types";

import style from "styled-components";

const CardHolder = style.div`
  padding: 8px;
  display: flex;
`;

const BattlefieldDiv = style.div`
  flex-direction: column;
  width: 100%;
  display: flex;
`;

const StaticBattlefieldDiv = style.div`
  flex-direction: column;
  width: 100%;
  display: flex;
  background-color: #EEEB;
`;

export const StaticBattlefield = ({
  gameState,
  playerRef,
  playerNumber,
  player,
}) => {
  return (
    <StaticBattlefieldDiv
      ref={playerRef.battlefield}
      tabIndex={player.tabIndices.battlefield}
      role="region"
      aria-label={player.name + " Battlefield"}
      aria-describedby={gameState.ariaHelper.cardsOnTheTable(player.id)}
    >
      <CardHolder style={{ height: "33.33%", padding: "2px" }}>
        {player["land_zone_battlefield"].map((card, index) => (
          <StaticImgCard
            gameState={gameState}
            card={card}
            key={index}
            size={"small"}
            tabIndex={index + player.tabIndices.front_battlefield}
            cardHeight={100}
          />
        ))}
      </CardHolder>
      <CardHolder style={{ height: "33.33%", padding: "2px" }}>
        {player.back_battlefield.map((card, index) => (
          <StaticImgCard
            card={card}
            key={index}
            size={"small"}
            tabIndex={index + player.tabIndices.back_battlefield}
            cardHeight={100}
          />
        ))}
      </CardHolder>
      <CardHolder style={{ height: "33.33%", padding: "2px" }}>
        {player["front_battlefield"].map((card, index) => (
          <StaticImgCard
            gameState={gameState}
            card={card}
            key={index}
            size={"small"}
            tabIndex={index + player.tabIndices.land_zone_battlefield}
            cardHeight={100}
          />
        ))}
      </CardHolder>
    </StaticBattlefieldDiv>
  );
};

StaticBattlefield.propTypes = {
  gameState: PropTypes.object.isRequired,
  playerRef: PropTypes.object.isRequired,
  playerNumber: PropTypes.number.isRequired,
  player: PropTypes.object.isRequired,
};

export const Battlefield = ({ gameState, playerRef, player }) => {
  return (
    <BattlefieldDiv
      role="region"
      aria-label={player.name + " Battlefield"}
      ref={playerRef.battlefield}
      tabIndex={player.tabIndices.front_battlefield}
    >
      <Droppable
        droppableId="front_battlefield"
        direction="horizontal"
        aria-label="front lane"
        role="region"
      >
        {(provided) => (
          <CardHolder
            {...provided.droppableProps}
            ref={provided.innerRef}
            style={{ height: "33.33%", padding: "2px", backgroundColor: "#BBBBBBAA" }}
            className="Droppable"
            aria-label="front lane"
          >
            {player.front_battlefield.map((card, idx) => (
              <ImgCard
                region="front_battlefield"
                key={card._uid}
                gameState={gameState}
                size={"small"}
                idx={idx}
                card={card}
                tabIndex={idx + player.tabIndices.front_battlefield}
                cardHeight={100}
              />
            ))}
            {provided.placeholder}
          </CardHolder>
        )}
      </Droppable>
      <Droppable
        droppableId="back_battlefield"
        direction="horizontal"
        aria-label="back lane"
        role="region"
      >
        {(provided) => (
          <CardHolder
            {...provided.droppableProps}
            ref={provided.innerRef}
            style={{ height: "33.33%", padding: "2px", backgroundColor: "#EEEEEEAA" }}
            className="Droppable"
            aria-label="back lane"
          >
            {player.back_battlefield.map((card, idx) => (
              <ImgCard
                region="back_battlefield"
                key={card._uid}
                gameState={gameState}
                size={"small"}
                idx={idx}
                card={card}
                tabIndex={idx + player.tabIndices.back_battlefield}
                cardHeight={100}
              />
            ))}
            {provided.placeholder}
          </CardHolder>
        )}
      </Droppable>
      <Droppable
        droppableId="land_zone_battlefield"
        direction="horizontal"
        aria-label="land lane"
        role="region"
      >
        {(provided) => (
          <CardHolder
            {...provided.droppableProps}
            ref={provided.innerRef}
            style={{ height: "33.33%", padding: "2px", backgroundColor: "#BBBBBBAA" }}
            className="Droppable"
            aria-label="land lane"
          >
            {player.land_zone_battlefield.map((card, idx) => (
              <ImgCard
                region="land_zone_battlefield"
                key={card._uid}
                gameState={gameState}
                size={"small"}
                idx={idx}
                card={card}
                tabIndex={idx + player.tabIndices.land_zone_battlefield}
                cardHeight={100}
              />
            ))}
            {provided.placeholder}
          </CardHolder>
        )}
      </Droppable>
    </BattlefieldDiv>
  );
};

Battlefield.propTypes = {
  gameState: PropTypes.object.isRequired,
  playerRef: PropTypes.object.isRequired,
  playerNumber: PropTypes.number.isRequired,
  player: PropTypes.object.isRequired,
};
