import PropTypes from 'prop-types'

export const Card = ({data, tabIndex}) => (
    <div className="col" 
    aria-label={data.name} 
    aria-description={data.text}
    tabIndex={tabIndex}>
      <p>{data.name} {data.cost}</p>
      <p>{data.text}</p>
    </div>
)

Card.propTypes = {
  data: PropTypes.object.isRequired,
  tabIndex: PropTypes.number.isRequired,
}