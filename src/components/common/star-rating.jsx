import React from "react";
import SVGIcon from "../../helpers/svg-icon";

const StarRating = props => {
  const count = Math.ceil(props[0]);
  const stars = count === -1 ? [] : [...Array(count).keys()];

  return (
    <React.Fragment>
      {stars.map((star, key) => (
        <SVGIcon
          name="star"
          key={key}
          type="fill"
          width="14"
          height="14"
          className="text-primary"
        ></SVGIcon>
      ))}
    </React.Fragment>
  );
};

export default StarRating;
