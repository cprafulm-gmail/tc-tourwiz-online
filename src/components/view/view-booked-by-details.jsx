import React from "react";
import Amount from "../../helpers/amount";
import { Trans } from "../../helpers/translate";

const ViewFareDetails = props => {
  const { bookedByDetails } = props;
  return (
    <div className="card shadow-sm mb-3">
      <div className="card-header">
        <h5 className="m-0 p-0">{Trans("_viewAgentDetails")}</h5>
      </div>
      <div className="card-body">
        <ul className="list-unstyled p-0 m-0">

          <ul className="list-unstyled p-0 m-0">
            <li className="row">
              <label className="col-3">{Trans("_portal")} : </label>
              <b className="col-9">{bookedByDetails.url}</b>
            </li>
            <li className="row">
              <label className="col-3">{Trans("_agentName")} : </label>
              <b className="col-9">{bookedByDetails.name} {(bookedByDetails.userName && bookedByDetails.userName !== "" ? "(" + bookedByDetails.userName + ")" : "")}</b>
            </li>
            <li className="row">
              <label className="col-3">{Trans("_telephoneNumber")} : </label>
              <b className="col-9">{bookedByDetails.phone}</b>
            </li>
            <li className="row">
              <label className="col-3">{Trans("_email")} : </label>
              <b className="col-9">{bookedByDetails.email}</b>
            </li>
            <li className="row">
              <label className="col-3">{Trans("_viewBookingFor")} : </label>
              <b className="col-9">{props.bookingModeTypeDesc}</b>
            </li>
            {bookedByDetails.branchName && bookedByDetails.branchName !== "" &&
              <li className="row" style={{display:"none"}}>
                <label className="col-3">{Trans("_branchName")} : </label>
                <b className="col-9">{bookedByDetails.branchName}</b>
              </li>
            }
          </ul>
        </ul>
      </div>
    </div>
  );
};

export default ViewFareDetails;
