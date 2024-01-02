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

export const ImgCard = ({card, size, index, tabIndex}) => (
  <CardImg src={card.image_uris[size]} 
      tabIndex={tabIndex} 
      aria-describedby={`${card.name}, ${card.type_line}, ${card.oracle_text}`} />
  )