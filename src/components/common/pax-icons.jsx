import React from "react";
import SVGIcon from "../../helpers/svg-icon";

const PaxIcons = props => {
  const count = Math.ceil(props[0]);
  const pax = [...Array(count).keys()];

  return (
    <React.Fragment>
      {pax.map((pax, key) => (
        <SVGIcon
          key={key}
          name="user-alt"
          width={props.type === "child" ? "10" : "14"}
          type="fill"
        ></SVGIcon>
      ))}
    </React.Fragment>
  );
};

export default PaxIcons;
