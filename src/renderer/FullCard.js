import PropTypes from 'prop-types'
import style from 'styled-components'
import holofoilTexture from '../resources/frames/holofoil-texture.webp';
import { Draggable } from 'react-beautiful-dnd';
import emptyCard from '../resources/cards/empty_card.png';


const CardContainer = style.div`
  border: 1px solid black;
  width: ${props => 500 * props.scale}px;
  height: ${props => 700 * props.scale}px;
  margin: 0 auto;
  border-radius: 25px;
  box-sizing: border-box;
  box-shadow: -8px 9px 16px -3px gray;
  background: #171314;
`

const SlimContainer = style.div`
`

const CardBackground = style.div`
  height: 100%;
  margin: 20px 20px 0 20px;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
  border-bottom-left-radius: 8%;
  border-bottom-right-radius: 8%;
  background-color: #bbb;
  z-index: 0;
  background: ${props => props.color};
  background-repeat: no-repeat;
  background-size: cover;
`

const CardFrame = style.div`
  z-index: 1;
  position: relative;
  height: 108%;
  max-width: 97%;
  left: 1%;
  top: 0.5%;
  left: 1.2%;
  display: flex;
  flex-direction: column;
`

const commonBorderStyle = `
  border-bottom: 4px solid #a9a9a9;
  border-left: 2px solid #a9a9a9;
  border-top: 1px solid #fff;
  border-right: 1px solid #fff;
`

const commonFrameStyle = `
  box-shadow: 
  0 0 0 2px #171314,
  0 0 0 5px #26714A,
  -3px 3px 2px 5px #171314;

  margin-bottom: 7px;
`

const commonFrameStyleOverflow = `
  overflow: hidden;
`

const commonBackgroundFrameStyle = `
  background: 
    linear-gradient( 0deg, rgba(201, 216, 201, .3), rgba(201, 216, 209, .3) ),
    url(https://image.ibb.co/jKByZn/tile_bg_1.jpg); 
  display: flex;
  margin-top: 10px;
  margin-left: 5px;
  margin-right: 5px;
  padding: 8px 0;
  display: flex;
  justify-content: space-between;
  border-radius: 18px/40px;
`

const FrameHeader = style.div`
  ${commonBorderStyle}
  ${commonFrameStyle}
  ${commonFrameStyleOverflow}
  ${commonBackgroundFrameStyle}
`

const FrameTypeLine = style.div`
  ${commonBorderStyle}
  ${commonFrameStyle}
  ${commonFrameStyleOverflow}
  ${commonBackgroundFrameStyle}
  margin-top: 0;
`

const FrameArt = style.img`
  ${commonFrameStyle}
  height: 50%; /* make it fit in the card */
  margin: 0 10px; /* align it vertically */
`

const FrameTextBox = style.div`
  box-shadow: 
    0 0 0 5px #26714A,
    -3px 3px 2px 5px #171314;
  ${commonFrameStyleOverflow}
  margin: 0 10px;
  background: #d3ded6;
  background-image: url(https://image.ibb.co/dFcNx7/tile_bg_2.jpg);
  display: flex;
  flex-direction: column;
  justify-content: space-around; 
  padding: 50px 6px;
  box-sizing: border-box;
  font-size: 1.2em;
`

const commonNameAndType = `
  font-size: 1.3em;
  margin-left: 10px;
  align-self: baseline;
  font-weight: 600;
`

const Name = style.h1`
  ${commonNameAndType}
`

const Type = style.h1`
  ${commonNameAndType}
`

const ManaIcon = style.div`
  font-size: 1.4em;
  background: #ADD3AC;
  border-radius: 50%;
  box-sizing: border-box;
  box-shadow: -0.05em 0.12em 0px 0 black;
  margin-right: 5px;
  height: 20px;
  align-self: center;
`

const SetIcon = style.img`
  height: 9%;
  width: 6%;
  overflow: hidden;
  margin-right: 10px;
  align-self: center;
`

const Description = style.p`
  margin: 5px 1px;
`

const FlavourText = style.p`
  font-style: italic;
  padding: 10px 0;
`

const FrameBottomInfo = style.div`
  color: white;
  display: flex;
  justify-content: space-between;
  margin: 5px 15px 0 15px; 
`

const FBIleft = style.div`
  flex: 1;
  font-size: 10px;
  position: relative;
  top: 6px;
`

const FBIcenter = style.div`
  border-radius: 60%;
  flex-basis: 41px;
  height: 21px;
  position: relative;
  bottom: 11px;
  z-index: 2;
  background: lightgray;
  background-image: url(${holofoilTexture});
  box-shadow: 
    0 0 0 4px #171314;
`

const FBIright = style.div`
  flex: 1;
  text-align: right;
  font-size: 10px;
  position: relative;
  top: 6px;
`

const CardColors = {
  'W': 'white',
  'U': 'blue',
  'B': 'black',
  'R': 'red',
  'G': 'green'
}

export const FullCard = ({idx, card, tabIndex, scale}) => (
  <Draggable draggableId={card._uid} index={idx} key={card._uid}>
    {provided => (
      <CardContainer 
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        ref={provided.innerRef}
        scale={scale} 
        tabIndex={tabIndex}
        aria-roledescription="Card"
        aria-describedby={`${card.card_name} ${card.mana_cost} ${card.type_line} ${card.oracle_text} ${card.power !== null ? card.power + "/" + card.toughness : ""}${card.loyalty !== null ? card.loyalty + " loyalty" : ""}`}>
        <CardBackground color={card.color_identity ? (card.color_identity.length > 1 ? 'gold' : CardColors[card.color_identity[0]]) : 'grey'}>
          <CardFrame>
            <FrameHeader>
              <Name>{card.name}</Name>
              <ManaIcon>{card.mana_cost}</ManaIcon>
            </FrameHeader>
            <FrameArt src={card.image_uris["art_crop"]}/>
            <FrameTypeLine>
              <Type>{card.type_line}</Type>
              <SetIcon src={card.setIconUrl} alt={card.setAlt} aria-describedby={ card.setAlt }/>
            </FrameTypeLine>
            <FrameTextBox>
              <Description aria-describedby={card.oracle_text}>{card.oracle_text}</Description>
              <FlavourText aria-describedby={card.flavor_text}>{card.flavor_text}</FlavourText>
            </FrameTextBox>
            <FrameBottomInfo className="inner-margin">
              <FBIleft>
                <p>{card.artist}</p>
              </FBIleft>
              <FBIcenter/>
              <FBIright>
                if (card.power !== null) {
                  <p>{card.power}/{card.toughness}</p>
                } else if (card.loyalty !== null) {
                  <p>{card.loyalty}</p>
                }
              </FBIright>
            </FrameBottomInfo>
          </CardFrame>
        </CardBackground>
      </CardContainer>
    )}
  </Draggable>
)

FullCard.propTypes = {
  idx: PropTypes.number.isRequired,
  data: PropTypes.object.isRequired,
  tabIndex: PropTypes.number.isRequired,
  scale: PropTypes.number.isRequired,
}


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


const CardImg = style.img`
`

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
export const ImgCard = ({idx, card, size, tabIndex, scale}) => {
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
            <div>{card.aria_description}</div>
          </HiddenText>
          <HiddenText>
            <div>{card.type_line + ", "}</div>
            <div>{card.card_read_oracle_text}</div>
          </HiddenText>
          <CardImg src={card.image_uris ? card.image_uris[size] : emptyCard} alt={card.name} />
          
        </SlimContainer>
      )}
    </Draggable>
  );
}

ImgCard.propTypes = {
  card : PropTypes.object.isRequired,
  size : PropTypes.string.isRequired,
  idx: PropTypes.number.isRequired,
  scale: PropTypes.number.isRequired,
  tabIndex: PropTypes.number.isRequired,
}


export const StaticImgCard = ({card, size, tabIndex, scale}) => {
  return (
    <SlimContainer 
      tabIndex={tabIndex}
      >
      <HiddenText>
        <div>{card.aria_description}</div>
      </HiddenText>
      <HiddenText>
        <div>{card.card_type_line + ", "}</div>
        <div>{card.card_read_oracle_text}</div>
      </HiddenText>
      <CardImg src={card.card_image_uris ? card.card_image_uris[size] : emptyCard} alt={card.card_name_with_mana_cost} />
    </SlimContainer>
  )
}

StaticImgCard.propTypes = {
  card : PropTypes.object.isRequired,
  size : PropTypes.string.isRequired,
  tabIndex: PropTypes.number.isRequired,
  scale: PropTypes.number.isRequired,
}