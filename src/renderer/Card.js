import PropTypes from 'prop-types'
import style from 'styled-components'

const Container = style.div`
  border: 1px solid lightgrey;
  padding: 8px;
  border-radius: 4px;
  margin-left: 8px;
`

const CardImg = style.img`
  height: 100%;
  width: 100%;
`

const CardContainer = style.div`
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


export const Card = ({card, index, tabIndex}) => (
  <Container>
    <div className="col"
    aria-label={card.card_name}
    aria-describedby={ "card::" + card.id }
    tabIndex={tabIndex}>
      <h2>{card.card_name} {card.card_mana_cost}</h2>
      <p id={"card::" + card.id + "::type"}>{card.card_type_line}</p>
      <p id={"card::" + card.id}>{card.card_oracle_text}</p>
      <p id={"card::" + card.id + "::power-toughness"}>{card.power_toughness}</p>
      <p id={"card::" + card.id + "::loyalty"}>{card.card_loyalty}</p>
    </div>
  </Container>
)

Card.propTypes = {
  data: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  tabIndex: PropTypes.number.isRequired,
}
