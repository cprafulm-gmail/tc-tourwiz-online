import React from "react";
import Date from "../../helpers/date";
import { Trans } from "../../helpers/translate";

const ViewAirDetails = props => {
  return (
    <React.Fragment>
      {props.items.map(fo => {
        return fo.item.map((item, key) => {
          return (
            <div className="card shadow-sm mb-3" key={key}>
              <div className="card-header">
                <h5 className="m-0 p-0">
                  {(item.locationInfo.fromLocation.city === item.locationInfo.fromLocation.name &&
                    item.locationInfo.toLocation.city === item.locationInfo.toLocation.name) ? (
                    (props.isOfflineBooking ? item.locationInfo.fromLocation.id : item.locationInfo.fromLocation.city).replaceAll("&amp;", "&") +
                    " To " +
                    (props.isOfflineBooking ? item.locationInfo.toLocation.id : item.locationInfo.toLocation.city).replaceAll("&amp;", "&")
                  ) : (
                    item.locationInfo.fromLocation.city.replaceAll("&amp;", "&") +
                    " - " +
                    item.locationInfo.fromLocation.name.replaceAll("&amp;", "&") +
                    " - (" +
                    item.locationInfo.fromLocation.id.replaceAll("&amp;", "&") +
                    ") To " +
                    item.locationInfo.toLocation.city.replaceAll("&amp;", "&") +
                    " - " +
                    item.locationInfo.toLocation.name.replaceAll("&amp;", "&") +
                    " - (" +
                    item.locationInfo.toLocation.id.replaceAll("&amp;", "&") +
                    ")"
                  )
                  }
                </h5>
              </div>

              <div className="card-body">
                <ul className="list-unstyled p-0 m-0">
                  <li className="row">
                    <label className="col-lg-3">
                      {Trans("_viewOperatedBy") + " : "}
                    </label>
                    <b className="col-lg-9">
                      {
                        item.vendors.find(x => (x.type = "operatingAirline"))
                          .item.name.replaceAll("&amp;", "&")
                      }
                    </b>
                  </li>
                  <li className="row">
                    <label className="col-lg-3">
                      {Trans("_viewFlight") + " : "}
                    </label>
                    <b className="col-lg-9">{item.code.replaceAll("&amp;", "&")}</b>
                  </li>
                  {item.tpExtension.find(x => x.key === "cabinClass") && item.tpExtension.find(x => x.key === "cabinClass").value !== "" &&
                    < li className="row">
                      <label className="col-lg-3">
                        {Trans("_viewCabinClass") + " : "}
                      </label>
                      <b className="col-lg-9">
                        {item.tpExtension.find(x => x.key === "cabinClass").value.replaceAll("&amp;", "&")}
                      </b>
                    </li>
                  }
                  <li className="row">
                    <label className="col-lg-3">
                      {Trans("_viewAirDepart") + " : "}
                    </label>
                    <b className="col-lg-9">
                      <Date date={item.dateInfo.startDate} />{" "}
                      <Date date={item.dateInfo.startDate} format="shortTime" />
                    </b>
                  </li>
                  <li className="row">
                    <label className="col-lg-3">
                      {Trans("_viewAirArrive") + " : "}
                    </label>
                    <b className="col-lg-9">
                      <Date date={item.dateInfo.endDate} />{" "}
                      <Date date={item.dateInfo.endDate} format="shortTime" />
                    </b>
                  </li>
                  <li className="row">
                    <label className="col-lg-3">
                      {Trans("_viewTravelTime") + " : "}
                    </label>
                    <b className="col-lg-9">
                      {parseInt(item.journeyDuration / 60) + "h "}
                      {parseInt(item.journeyDuration) -
                        parseInt(item.journeyDuration / 60) * 60 +
                        "m"}
                    </b>
                  </li>
                </ul>
              </div>
            </div>
          );
        });
      })}
    </React.Fragment>
  );
};

export default ViewAirDetails;
