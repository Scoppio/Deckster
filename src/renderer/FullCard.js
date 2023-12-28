import PropTypes from 'prop-types'
import style from 'styled-components'
import holofoilTexture from '../images/holofoil-texture.webp';
import greenBackground from '../images/green-background.webp';
import { Draggable } from 'react-beautiful-dnd';


const CardContainer = style.div`
  border: 1px solid black;
  width: 500px;
  height: 700px;
  margin: 0 auto;
  border-radius: 25px;
  box-sizing: border-box;
  box-shadow: -8px 9px 16px -3px gray;
  background: #171314;
  transform: translate(${props => (props.scale * 500 - 500)/2}px, ${props => (props.scale * 700 - 700)/2}px) scale(${props => props.scale});
`

const CardBackground = style.div`
  height: 600px;
  margin: 20px 20px 0 20px;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
  border-bottom-left-radius: 8%;
  border-bottom-right-radius: 8%;
  background-color: #bbb;
  z-index: 0;
  background-image: url(${greenBackground});
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

const ExtraDescription = style.p`
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

export const FullCard = ({idx, data, tabIndex, scale}) => (
  <Draggable draggableId={data._uid} index={idx} key={data._uid}>
    {provided => (
      <CardContainer 
        scale={scale} 
        tabIndex={tabIndex} 
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        ref={provided.innerRef}
        >
        <CardBackground>
          <CardFrame>
            <FrameHeader>
              <Name>{data.name}</Name>
              <ManaIcon>{data.cost}</ManaIcon>
            </FrameHeader>
            <FrameArt src={data.artUrl} alt={data.artAlt} aria-describedby={ data.artAlt }/>
            <FrameTypeLine>
              <Type>{data.type}</Type>
              <SetIcon src={data.setIconUrl} alt={data.setAlt} aria-describedby={ data.setAlt }/>
            </FrameTypeLine>
            <FrameTextBox>
              <Description aria-describedby={data.description}>{data.description}</Description>
              <ExtraDescription aria-describedby={data.extraDescription}>{data.extraDescription}</ExtraDescription>
              <FlavourText aria-describedby={data.flavourText}>{data.flavourText}</FlavourText>
            </FrameTextBox>
            <FrameBottomInfo className="inner-margin">
              <FBIleft>
                <p>{data.cardInfo}</p>
                <p>{data.author}</p>
              </FBIleft>
              <FBIcenter/>
              <FBIright>
                {data.copyRight}
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

export const MiniCard = ({idx, data, tabIndex, scale}) => (
  <Draggable draggableId={data._uid} index={idx} key={data._uid}>
    {provided => (
      <Container 
        scale={scale} 
        tabIndex={tabIndex} 
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        ref={provided.innerRef}
        >
          <div 
            aria-label={data.name}
            aria-describedby={ "card::" + data.name }
            tabIndex={tabIndex}>
            <p>{data.name} {data.cost}</p>
            <p id={"card::" + data.name}>{data.text}</p>
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