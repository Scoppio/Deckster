import React from "react";
import { createPortal } from "react-dom";
import { Dropdown } from "react-bootstrap";

const DropdownMenuPortal = React.forwardRef(function Menu(props, ref) {
  return createPortal(
    <Dropdown.Menu {...props} ref={ref}>
      {props.children}
    </Dropdown.Menu>,
    document.body
  );
});

export default DropdownMenuPortal;
