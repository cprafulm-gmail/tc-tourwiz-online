import React from "react";

const DashboardBox = (props) => {
  const { name, icon } = props;
  return (
    <div>
      <h3 onClick={props.handleClick("/Bookings")}>{name}</h3>
      <figure>
        <img src={icon} alt="" />
      </figure>
    </div>
  );
};

export default DashboardBox;
