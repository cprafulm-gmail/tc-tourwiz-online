import React from "react";
import Date from "../../helpers/date";
import { Trans } from "../../helpers/translate";
import SVGIcon from "../../helpers/svg-icon";
import moment from "moment";

const ResultItemAirDetailsMeta = ({ Airitem }) => {
  let item = Airitem[0];
  const loc = item.locationInfo;
  const stopCount = item.stops;
  const stops =
    stopCount === 0
      ? Trans("_airNonStop")
      : stopCount === 1
        ? stopCount + " " + Trans("_airStop")
        : stopCount + " " + Trans("_airStops");
  let startTime = moment(item.departureDate);
  let endTime = moment(item.arrivalDate);
  let durationdiff = moment.duration(endTime.diff(startTime));
  let hoursduration = parseInt(durationdiff.asHours());
  let minuteduration = parseInt(durationdiff.asMinutes())%60;
  const duration = hoursduration +
    "h " +
    minuteduration +
    "m";
  return (
    <React.Fragment>
        <div className="mt-4" key={item.flightRouteDetailId}>
          <h6 className="text-primary mb-3">
            {item.departureAirport} ({item.departureCode})<span> - </span>
            {item.arrivalAirport} ({item.arrivalCode})<span>, </span>
            {Trans("_duration") + " : "}
            {duration}
            <span>, </span>
            {stops}
          </h6>
          <div className="mb-3">
            <div className="mb-3">
              <span className="d-inline-block">
                <Date date={item.departureDate} format="shortTime" />
              </span>
              <span className="d-inline-block ml-3 mr-3">
                <SVGIcon name="long-arrow-right"></SVGIcon>
              </span>
              <span className="d-inline-block">
                <Date date={item.arrivalDate} format="shortTime" />
              </span>
              <span className="d-inline-block ml-5">
                {Trans("_duration") + " : "}
                {duration}
              </span>
            </div>
            <ul className="flight-dtl-info-pad list-unstyled small text-secondary mb-2">
              <li className="mb-1">
                {item.departureAirport} ({item.departureCode}){" "}
                {Trans("_toSmall") + " "}
                {item.arrivalAirport} ({item.arrivalCode})
              </li>
              <li className="mb-1">
                {item.airlineName + " " + item.flightNumber}
              </li>
              {item.viaRoute &&
                <li className="mb-1">
                  via {item.viaRoute}
                </li>
              }
            </ul>
          </div>
           
        </div>
    </React.Fragment>
  );
};

export default ResultItemAirDetailsMeta;
