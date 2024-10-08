import React from "react";
import SVGIcon from "../../helpers/svg-icon";
import Date from "../../helpers/date";
import moment from "moment";

const UmrahPackageinfo = (props) => {
  return (
    <div className="quotation-info border bg-light d-flex p-2">
      <div className="mr-auto d-flex align-items-center">
        <SVGIcon
          name={"user-circle"}
          className="mr-2 d-flex align-items-center"
          width="22"
          type="fill"
        ></SVGIcon>
        <h6 className="font-weight-bold m-0 p-0">
          {props.type === "umrah-package" ? "Umrah Package" : props.type === "Quotation" ? "Quotation" : "Itinerary"} for {props.type === "umrah-package" ? "" : props.customerName} -{" "}
          {props.title} -{" "}
          {moment(props.startDate).format("dddd, DD MMMM YYYY")}{" To "}
          {moment(props.endDate).format("dddd, DD MMMM YYYY")}
          {props.type === "Itinerary" && (
            <React.Fragment>
              {" - "}
              <Date date={props.startDate} />
              {" to "}
              <Date date={props.endDate} />
            </React.Fragment>
          )}
        </h6>
      </div>

      <button className="btn p-0 m-0" onClick={props.handleEdit}>
        <SVGIcon name={"pencil-alt"} className="mr-2" width="16" type="fill"></SVGIcon>
      </button>
    </div>
  );
};

export default UmrahPackageinfo;
