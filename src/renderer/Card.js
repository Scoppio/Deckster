import PropTypes from 'prop-types'
import style from 'styled-components'

const Container = style.div`
  border: 1px solid lightgrey;
  padding: 8px;
  border-radius: 4px;
  margin-left: 8px;
`

export const Card = ({card, index, tabIndex}) => (
  <Container>
    <div className="col"
    aria-label={card.name}
    aria-describedby={ "card::" + card.id }
    tabIndex={tabIndex}>
      <h2>{card.name} {card.mana_cost}</h2>
      <p id={"card::" + card.id}>{card.text}</p>
      <p id={"card::" + card.id + "::type"}>{card.type_line}</p>
      <p id={"card::" + card.id}>{card.oracle_text}</p>
      <p id={"card::" + card.id + "::power-toughness"}>{card.power}/{card.toughness}</p>
    </div>
  </Container>
)

Card.propTypes = {
  data: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  tabIndex: PropTypes.number.isRequired,
}