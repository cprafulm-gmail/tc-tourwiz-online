import React from "react";
import { Trans } from "../../helpers/translate";

const FilterMap = () => {
  return (
    <div className="filter-section filter-map">
      <h2>{Trans("_showInMap")}</h2>
      <ul>
        <li>
          <img src="https://www.tripshop.com/Booking/Images/map.jpg" alt="" />
        </li>
      </ul>
    </div>
  );
};

export default FilterMap;
