import React from "react";
import Date from "../../helpers/date";
import Stops from "../common/stops";
import { Trans } from "../../helpers/translate";
import SVGIcon from "../../helpers/svg-icon";
import ImageNotFound from "../../assets/images/image-not-found-flight.png";

const ResultItemAirItemDomestic = (props) => {
  const { items, routeType, isSelectedItem } = props;
  return (
    <div className="row no-gutters bg-white">
      <div className="col-lg-9 d-flex justify-content-center align-items-center flex-column">
        <ul className="list-unstyled m-0">
          {items.map((item, itemKey) => {
            const loc = item.locationInfo;
            loc.fromLocation = loc.fromLocation || loc.FromLocation;
            loc.toLocation = loc.toLocation || loc.ToLocation;
            const date = item.dateInfo;
            const stopCount = item.item.length - 1;
            const stops =
              stopCount === 0
                ? "non stop"
                : stopCount === 1
                ? stopCount + " stop"
                : stopCount + " stops";
            const duration =
              item.tpExtension.find((x) => x.key === "durationHours").value +
              "h " +
              item.tpExtension.find((x) => x.key === "durationMinutes").value +
              "m";
            const url = item.item[0].images.find((x) => x.type === "default").url;

            const airline = item.item[0].vendors[0].item.name;
            const airlineCode = item.item[0].code;

            const getOnErrorImageURL = () => {
              return ImageNotFound.toString();
            };

            return (
              <li className="border-bottom p-3" key={itemKey}>
                <div className="row">
                  <div className="col-lg-3 d-flex justify-content-center align-items-center flex-column">
                    <img
                      className="img-fluid"
                      src={url || ImageNotFound}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = getOnErrorImageURL();
                      }}
                      alt=""
                    />
                    <span
                      className="small text-secondary mt-2"
                      title={airline}
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: "72px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {airline}
                    </span>
                    <span className="small text-secondary">{airlineCode}</span>
                  </div>
                  <div className="col-lg-3 d-flex justify-content-center align-items-end flex-column">
                    <span className="small text-secondary">{loc.fromLocation.id}</span>

                    <b>
                      <Date date={date.startDate} format="shortTime" />
                    </b>

                    <span className="small text-secondary">
                      <Date date={date.startDate} format="shortDate" />
                    </span>
                  </div>
                  <div className="col-lg-3 d-flex justify-content-center align-items-center flex-column">
                    <span className="small text-nowrap mb-1">
                      <i className="align-text-bottom">
                        <SVGIcon
                          name="clock"
                          className="mr-1 text-secondary"
                          width="12"
                          height="12"
                        ></SVGIcon>
                      </i>
                      {duration}
                    </span>
                    <Stops {...[stopCount]} />
                    <span className="small mt-1">
                      {Trans("_" + stops.replace(" ", "").replace(" ", "").toLowerCase())}
                    </span>
                  </div>
                  <div className="col-lg-3 d-flex justify-content-center align-items-start flex-column">
                    <span className="small text-secondary">{loc.toLocation.id}</span>

                    <b>
                      <Date date={date.endDate} format="shortTime" />
                    </b>

                    <span className="small text-secondary">
                      <Date date={date.endDate} format="shortDate" />
                    </span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="col-lg-3 border-left bg-light d-flex justify-content-center align-items-center flex-column">
        {!props.isfromTourwiz &&
          <h2>{props.displayAmount}</h2>
        }
        
        {!isSelectedItem && (
          <div className="custom-control custom-radio">
            <input
              type="radio"
              className="custom-control-input"
              name={"r-" + routeType}
              id={"r-" + routeType + props.token}
              onChange={() => props.handleFlightSelect(props, routeType)}
            />
            <label
              className="custom-control-label"
              htmlFor={"r-" + routeType + props.token}
              style={{ cursor: "pointer" }}
            ></label>
          </div>
        )}

        {isSelectedItem && (
          <button
            className="btn btn-sm btn-link text-primary p-0 m-0"
            onClick={() => props.handelDetails(props.token)}
          >
            {props.isShow ? Trans("_hideDetails") : Trans("_viewDetails")}
          </button>
        )}
      </div>
    </div>
  );
};

export default ResultItemAirItemDomestic;
