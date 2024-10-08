import React from "react";
import { Trans } from "../../helpers/translate";
import SVGIcon from "../../helpers/svg-icon";

const ResultViews = props => {
  const { currentView, currentMapView } = props;
  const itemCount =
    props.pageInfoIndex !== undefined
      ? props.pageInfoIndex[0].item.filteredResults
      : null;

  return (
    itemCount > 0 &&
    props.businessName !== "air" && props.businessName !== "transportation" && props.businessName !== "groundservice" && (
      <div className="result-views d-inline-block ml-3">
        <ul className="list-unstyled d-inline-block m-0 p-0">
          <li className="d-inline-block ml-1">
            <button
              title={Trans("_listView")}
              className={
                currentView === "listview"
                  ? "btn btn-primary"
                  : "btn btn-light border"
              }
              onClick={() => props.handleViews("listview")}
            >
              <SVGIcon name="bars" width="16" height="16"></SVGIcon>
            </button>
          </li>
          <li className="d-inline-block ml-1">
            <button
              title={Trans("_gridView")}
              className={
                currentView === "gridview"
                  ? "btn btn-primary"
                  : "btn btn-light border"
              }
              onClick={() => props.handleViews("gridview")}
            >
              <SVGIcon name="list-alt" width="16" height="16"></SVGIcon>
            </button>
          </li>
          {props.businessName === "hotel" && (
            <li className="d-inline-block ml-1">
              <button
                title={Trans("_mapView")}
                className={
                  currentMapView ? "btn btn-primary" : "btn btn-light border"
                }
                onClick={() => props.handleViews("mapview")}
              >
                <SVGIcon name="map-marker" width="16" height="16"></SVGIcon>
              </button>
            </li>
          )}
        </ul>
      </div>
    )
  );
};

export default ResultViews;
