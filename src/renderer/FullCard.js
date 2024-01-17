import PropTypes from 'prop-types'
import style from 'styled-components'
import { Draggable } from 'react-beautiful-dnd';
import emptyCard from '../resources/cards/empty_card.png';
import { useState } from 'react';

const SlimContainer = style.div`
`

const Container = style.div`
  display: flex;
  flex-direction: row;
  border: 1px solid lightgrey;
  padding: 8px;
  border-radius: 4px;
  margin-left: 8px;
`

export const MiniCard = ({idx, card, tabIndex, scale}) => (
  <Draggable draggableId={card._uid} index={idx} key={card._uid}>
    {provided => (
      <Container 
        scale={scale} 
        tabIndex={tabIndex} 
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        ref={provided.innerRef}
        >
          <div 
            aria-label={card.name}
            aria-describedby={ "card::name::" + card.name + " card::type::" + card.name + " card::text::" + card.name }
            tabIndex={tabIndex}>
            <p id={"card::name::" + card.name}>{card.name} {card.mana_cost}</p>
            <p id={"card::type::" + card.name}>{card.type_line}</p>
            <p id={"card::text::" + card.name}>{card.oracle_text}</p>
          </div>

        </Container>
        )}
    </Draggable>
)

MiniCard.propTypes = {
  idx: PropTypes.number.isRequired,
  data: PropTypes.object.isRequired,
  scale: PropTypes.number.isRequired,
  tabIndex: PropTypes.number.isRequired,
}



const HiddenText = style.div`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
`

export const ImgCard = ({idx, card, size, tabIndex, cardHeight}) => {
  
  const [isTapped, setIsTapped] = useState(card.is_tapped);
  
  isTapped !== card.is_tapped && setIsTapped(card.is_tapped);

  const handleClick = () => {
    card.tapped = !card.is_tapped;
    setIsTapped(card.tapped);
  }

  return (
    <Draggable draggableId={card._uid} index={idx} key={card._uid}>
      {provided => (
        <SlimContainer 
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          tabIndex={tabIndex}
          onDoubleClick={handleClick}
          onKeyDown={(event) => {
            if (event.key === 't') {
              handleClick();
            }
          }}
          >
          <HiddenText>
            <div aria-live="assertive" aria-atomic="true">{card.aria_description} {isTapped ? ", tapped. " : ""}</div>
          </HiddenText>
          <HiddenText>
            <div aria-live="polite" aria-atomic="true">{card.type_line + ", "}</div>
            <div aria-live="polite" aria-atomic="true">{card.card_read_oracle_text}</div>
          </HiddenText>
          <img src={card.card_image_uris ? card.card_image_uris[size] : emptyCard} alt={card.name} style={{
              height: `${cardHeight}%`,
              borderRadius: '8px',
              transform: card.tapped ? 'rotate(90deg)' : 'none'
            }} />
        </SlimContainer>
      )}
    </Draggable>
  );
}

ImgCard.propTypes = {
  idx: PropTypes.number.isRequired,
  card : PropTypes.object.isRequired,
  size : PropTypes.string.isRequired,
  tabIndex: PropTypes.number.isRequired,
  cardHeight: PropTypes.number.isRequired,
}


export const ImgCardHand = ({idx, card, size, tabIndex, cardHeight}) => {
  return (
    <Draggable draggableId={card._uid} index={idx} key={card._uid}>
      {provided => (
        <SlimContainer 
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          tabIndex={tabIndex}
          >
          <HiddenText>
            <div aria-live="polite" aria-atomic="true">{card.aria_description}</div>
          </HiddenText>
          <HiddenText>
            <div aria-live="polite" aria-atomic="true">{card.type_line + ", "}</div>
            <div aria-live="polite" aria-atomic="true">{card.card_read_oracle_text}</div>
          </HiddenText>
          <img src={card.card_image_uris ? card.card_image_uris[size] : emptyCard} alt={card.name} style={{
              height: `${cardHeight}%`,
              borderRadius: '8px'
            }} />
        </SlimContainer>
      )}
    </Draggable>
  );
}

ImgCardHand.propTypes = {
  idx: PropTypes.number.isRequired,
  card : PropTypes.object.isRequired,
  size : PropTypes.string.isRequired,
  tabIndex: PropTypes.number.isRequired,
  cardHeight: PropTypes.number.isRequired,
}

export const StaticImgCard = ({card, size, tabIndex, cardHeight}) => {
  return (
    <SlimContainer 
      tabIndex={tabIndex}
      >
      <HiddenText>
        <div>{card.aria_description} {card.is_tapped ? ", tapped. " : ""}</div>
      </HiddenText>
      <HiddenText>
        <div>{card.card_type_line + ", "}</div>
        <div>{card.card_read_oracle_text}</div>
      </HiddenText>
      <img src={card.card_image_uris?.[size] ?? emptyCard} alt={card.card_name_with_mana_cost} style={{
    height: `${cardHeight}%`,
    borderRadius: '8px',
    transform: card.is_tapped ? 'rotate(90deg)' : 'none'
  }}/>
    </SlimContainer>
  )
}

StaticImgCard.propTypes = {
  card : PropTypes.object.isRequired,
  size : PropTypes.string.isRequired,
  tabIndex: PropTypes.number.isRequired,
  scale: PropTypes.number.isRequired,
}