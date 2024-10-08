import React from "react";
import { Trans } from "../../helpers/translate";
import Date from "../../helpers/date";
import moment from "moment";

const ViewOtherDetailsvehicle = (props) => {
  const { businessObject } = props;
  let cartype = businessObject.category;
  if (businessObject.tpExtension.find((x) => x.key === "size") !== undefined)
    cartype = cartype + "," + businessObject.tpExtension.find((x) => x.key === "size").value;
  if (businessObject.tpExtension.find((x) => x.key === "transmissionType") !== undefined)
    cartype = cartype + "," + businessObject.tpExtension.find((x) => x.key === "transmissionType").value;
  if (businessObject.tpExtension.find((x) => x.key === "airConditionDesc") !== undefined)
    cartype = cartype + "," + businessObject.tpExtension.find((x) => x.key === "airConditionDesc").value;
  return (
    <React.Fragment>
      <div className="card shadow-sm mb-3">
        <div className="card-header">
          <h5 className="m-0 p-0">
            {Trans("_widgetvehicleFromLocationTitle")}
          </h5>
        </div>
        <div className="card-body position-relative">

          <ul className="list-unstyled p-0 m-0">
            <li className="row">
              <label className="col-3">
                {Trans("_date") + " : "}
              </label>
              <b className="col-7">{<Date date={businessObject.dateInfo.startDate} />}</b>
            </li>

            <li className="row">
              <label className="col-3">
                {Trans("Time") + " : "}
              </label>
              <b className="col-7">{<Date date={businessObject.dateInfo.startDate} format={"shortTimeampm"} />}</b>
            </li>

            <li className="row">
              <label className="col-3">
                {Trans("_filterlocation") + " : "}
              </label>
              <b className="col-7">{businessObject.locationInfo.fromLocation.name}</b>
            </li>

            <li className="row">
              <label className="col-3">
                {Trans("_address") + " : "}
              </label>
              <b className="col-7">{businessObject.locationInfo.fromLocation.address}</b>
            </li>

            {businessObject.locationInfo.fromLocation.phoneNumber !== null && businessObject.locationInfo.fromLocation.phoneNumber !== "" &&
              <li className="row">
                <label className="col-3">
                  {Trans("_lblPhoneNumber") + " : "}
                </label>
                <b className="col-7">{businessObject.locationInfo.fromLocation.phoneNumber}</b>
              </li>
            }

          </ul>
        </div>
      </div>
      <div className="card shadow-sm mb-3">
        <div className="card-header">
          <h5 className="m-0 p-0">
            {Trans("_widgetvehicleToLocationTitle")}
          </h5>
        </div>
        <div className="card-body position-relative">

          <ul className="list-unstyled p-0 m-0">
            <li className="row">
              <label className="col-3">
                {Trans("_date") + " : "}
              </label>
              <b className="col-7">{<Date date={businessObject.dateInfo.endDate} />}</b>
            </li>

            <li className="row">
              <label className="col-3">
                {Trans("Time") + " : "}
              </label>
              <b className="col-7">{<Date date={businessObject.dateInfo.endDate} format={"shortTimeampm"} />}</b>
            </li>

            <li className="row">
              <label className="col-3">
                {Trans("_filterlocation") + " : "}
              </label>
              <b className="col-7">{businessObject.locationInfo.toLocation.name}</b>
            </li>

            <li className="row">
              <label className="col-3">
                {Trans("_address") + " : "}
              </label>
              <b className="col-7">{businessObject.locationInfo.toLocation.address}</b>
            </li>


            {businessObject.locationInfo.toLocation.phoneNumber !== null && businessObject.locationInfo.toLocation.phoneNumber !== "" &&
              <li className="row">
                <label className="col-3">
                  {Trans("_lblPhoneNumber") + " : "}
                </label>
                <b className="col-7">{businessObject.locationInfo.toLocation.phoneNumber}</b>
              </li>
            }

          </ul>
        </div>
      </div>
      <div className="card shadow-sm mb-3">
        <div className="card-header">
          <h5 className="m-0 p-0">
            {Trans("CarDetails")}
          </h5>
        </div>
        <div className="card-body position-relative">

          <ul className="list-unstyled p-0 m-0">
            <li className="row">
              <label className="col-3">
                {Trans("CarName") + " : "}
              </label>
              <b className="col-7">{businessObject.name}</b>
            </li>

            <li className="row">
              <label className="col-3">
                {Trans("CarProvider") + " : "}
              </label>
              <b className="col-7">{businessObject.vendors[0].item.provider}</b>
            </li>

            <li className="row">
              <label className="col-3">
                {Trans("CarCategory") + " : "}
              </label>
              <b className="col-7">{businessObject.category}</b>
            </li>

            <li className="row">
              <label className="col-3">
                {Trans("_filtercarType") + " : "}
              </label>
              <b className="col-7">
                {cartype}
              </b>
            </li>

          </ul>
        </div>
      </div>
    </React.Fragment>
  );
};

export default ViewOtherDetailsvehicle;
