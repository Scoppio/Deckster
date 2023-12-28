import PropTypes from 'prop-types'
import style from 'styled-components'
import { Draggable } from 'react-beautiful-dnd'

const Container = style.div`
  border: 1px solid lightgrey;
  padding: 8px;
  border-radius: 4px;
  margin-left: 8px;
`

export const Card = ({data, index, tabIndex}) => (
  <Draggable draggableId={index} index={index}>
    {(provided) => (
      <Container {...provided.draggableProps} {...provided.dragHandleProps}
        innerRef={provided.innerRef}>
        <div className="col"
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

Card.propTypes = {
  data: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  tabIndex: PropTypes.number.isRequired,
}