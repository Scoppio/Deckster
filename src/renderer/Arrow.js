import Arrow, { DIRECTION } from 'react-arrows';
 

class ArrowHelper {

  constructor() {
    this.startingElement = null;
    this.endingElement = null;
    this.timer = null;
  }

  setStartingElement(element) {
    this.startingElement = element;
  }

  setEndingElement(element) {
    this.endingElement = element;
  }

  get direction () {
    return DIRECTION.TOP;
  }

  get translation () {
    return [-0.5, -1];
  }

}


const CreateArrow = ({arrowHelper}) => {
  return (
    <Arrow
      className='arrow'
      from={{
        direction: DIRECTION.TOP,
        node: () => document.getElementById('from'),
        translation: [-0.5, -1],
      }}
      to={{
        direction: DIRECTION.RIGHT,
        node: () => document.getElementById('to'),
        translation: [0.9, 1],
      }}
      // onChange={...}
    />
  );
};
