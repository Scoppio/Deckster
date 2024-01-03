import PropTypes from 'prop-types';
import style from 'styled-components'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export const GameStateBoard = ({gameState, playerRef }) => {

  return (
    <Row style={{width: "15vw", height: "100vh", background: "grey"}}>
      <h1>Game State Board</h1>
      <p>Here should go things like the card you are hovering the mouse over or selected cards (show the last selected)</p>

    </Row>
  )
}