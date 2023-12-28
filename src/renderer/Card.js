import PropTypes from 'prop-types'
import style from 'styled-components'


const Container = style.div`
  border: 1px solid lightgrey;
  padding: 8px;
  border-radius: 4px;
  margin-left: 8px;
`

export const Card = ({data, tabIndex}) => (
  <Container>
    <div className="col" 
    aria-label={data.name} 
    aria-describedby={ "card::" + data.name }
    tabIndex={tabIndex}>
      <p>{data.name} {data.cost}</p>
      <p id={"card::" + data.name}>{data.text}</p>
    </div>
  </Container>
)

Card.propTypes = {
  data: PropTypes.object.isRequired,
  tabIndex: PropTypes.number.isRequired,
}