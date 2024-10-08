import React from "react";
import { Trans } from "../../helpers/translate";

const ResultItemAirTabs = props => {
  const activeTab = props.activeTab;
  const defaultClass = props.mode === "umrah-package" ? "btn btn-outline-primary mt-2" : "nav-link rounded-0";
  const activeClass = props.mode === "umrah-package" ? "btn btn-outline-primary active  mt-2" : "nav-link rounded-0 active";
  return (
    <div>
      <ul className="nav nav-tabs">
        <li className="nav-item">
          <button
            className={activeTab === "itinerary" ? activeClass : defaultClass}
            onClick={() => props.changeTabs(props.token, "itinerary")}
          >
            {Trans("_lblItinerary")}
          </button>
        </li>
        <li className="nav-item">
          <button
            className={(activeTab !== "itinerary" ? activeClass : defaultClass) + (props.mode === "umrah-package" ? " ml-2" : "")}
            onClick={() => props.changeTabs(props.token, "price")}
          >
            {Trans("_lblPrice")}
          </button>
        </li>
      </ul>
    </div>
  );
};

export default ResultItemAirTabs;
