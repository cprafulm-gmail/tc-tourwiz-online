import React from "react";

const Stops = props => {
  const count = Math.ceil(Array.isArray(props[0]) ? props[0].length : Number(props[0]));
  const stops = [...Array(count).keys()];

  return (
    <React.Fragment>
      <div className="stops-cont">
        {stops.map(stop => (
          <span key={stop}></span>
        ))}
      </div>
    </React.Fragment>
  );
};

export default Stops;
