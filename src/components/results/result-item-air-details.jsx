import React from "react";
import Date from "../../helpers/date";
import { Trans } from "../../helpers/translate";
import SVGIcon from "../../helpers/svg-icon";
import { Link } from "react-router-dom";

const ResultItemAirDetails = ({ items }) => {
  return (
    <React.Fragment>
      {items.map((item, key) => {
        const loc = item.locationInfo;
        const stopCount = item.item.length - 1;
        const stops =
          stopCount === 0
            ? Trans("_airNonStop")
            : stopCount === 1
              ? stopCount + " " + Trans("_airStop")
              : stopCount + " " + Trans("_airStops");
        const duration =
          item.tpExtension.find(x => x.key === "durationHours").value +
          "h " +
          item.tpExtension.find(x => x.key === "durationMinutes").value +
          "m";

        return (
          <div className="mt-4" key={key}>
            <h6 className="text-primary mb-3">
              {loc.fromLocation.city} ({loc.fromLocation.id})<span> - </span>
              {loc.toLocation.city} ({loc.toLocation.id})<span>, </span>
              {Trans("_duration") + " : "}
              {duration}
              <span>, </span>
              {stops}
            </h6>

            {item.item.map((route, routeKey) => {
              const loc = route.locationInfo;
              const date = route.dateInfo;
              const airline = route.vendors[0].item;
              const airlineCode = route.code;
              const operatedBy = route.vendors[1].item;
              const cabinClass = route.tpExtension.find(
                x => x.key === "cabinClass"
              ).value;
              const cabinClassCode = route.tpExtension.find(
                x => x.key === "cabinClassCode"
              ).value;

              const durationH = parseInt(route.journeyDuration / 60);
              const durationM = route.journeyDuration - durationH * 60;

              const layOverDuration = route.layOverDuration;

              const layOverDurationH = parseInt(layOverDuration / 60);
              const layOverDurationM = layOverDuration - layOverDurationH * 60;

              const airlineType =
                route.tpExtension.find(x => x.key === "equipment") &&
                route.tpExtension.find(x => x.key === "equipment").value;

              return (
                <div className="mb-3" key={routeKey}>
                  <div className="mb-3">
                    <span className="d-inline-block">
                      <Date date={date.startDate} format="shortTime" />
                    </span>
                    <span className="d-inline-block ml-3 mr-3">
                      <SVGIcon name="long-arrow-right"></SVGIcon>
                    </span>
                    <span className="d-inline-block">
                      <Date date={date.endDate} format="shortTime" />
                    </span>
                    <span className="d-inline-block ml-5">
                      {Trans("_duration") + " : "}
                      {durationH + "h " + durationM + "m"}
                    </span>
                  </div>
                  <ul className="flight-dtl-info-pad list-unstyled small text-secondary mb-2">
                    <li className="mb-1">
                      {loc.fromLocation.city} ({loc.fromLocation.id}){" "}
                      {Trans("_toSmall") + " "}
                      {loc.toLocation.city} ({loc.toLocation.id})
                    </li>
                    <li className="mb-1">
                      {airline.name + " " + airlineCode}
                      {airlineType && " (" + airlineType + ")"},{" "}
                      {Trans("_operatedBySmall") + " "}
                      {operatedBy.name}
                    </li>
                    <li className="mb-1">
                      {cabinClass && cabinClass}
                      {cabinClassCode && " / Coach (" + cabinClassCode + ")"}
                    </li>
                  </ul>
                  {layOverDuration > 0 && (
                    <div className="mb-2 flight-dtl-info-pad text-primary">
                      <span className="d-inline small">
                        <SVGIcon
                          name="clock"
                          className="mr-2 text-primary"
                          width="12"
                          height="12"
                        ></SVGIcon>
                        {layOverDurationH + "h " + layOverDurationM + "m"}{" "}
                        {Trans("_airStop")}
                      </span>
                      <span className="d-inline small ml-2">
                        {loc.toLocation.city} ({loc.toLocation.id})
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
      <Link className="text-primary" to="/Baggageinfo" target="_blank">
        {Trans("_baggageFee")}
      </Link>
    </React.Fragment>
  );
};

export default ResultItemAirDetails;
