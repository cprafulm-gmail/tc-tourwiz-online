import React from "react";
import Date from "../../helpers/date";
import moment from "moment";
import { Trans } from "../../helpers/translate";

const ViewReservationDetails = props => {
  let isexcursionDiffDate = false;
  if ((props.businessObject.business === "activity" ||
    props.businessObject.business === "package" ||
    //props.businessObject.business === "transfers" ||
    props.businessObject.business === "transportation" ||
    props.businessObject.business === "groundservice")
    && props.businessObject.dateInfo.startDate !== props.businessObject.dateInfo.endDate && props.businessObject.dateInfo.endDate.split('T')[0] !== "0001-01-01") {
    isexcursionDiffDate = true;
  }
  let TotalAdults = 0;
  let TotalChilds = 0;
  let TotalInfants = 0;
  let IsPackagePax = false;
  if (props.businessObject.business === "hotel") {
    const roomDetails = props.businessObject.items;
    roomDetails.map((items, key) => {
      items.item.map((item, key) => {
        TotalAdults += parseInt(item.tpExtension.find(o => o.key === "adults").value);
        TotalChilds += parseInt(item.tpExtension.find(o => o.key === "children").value);
      });
    });
  }
  if (props.businessObject.business === "package" && props.businessObject.config && props.businessObject.config.find((x) => x.key === "Adult")?.value && props.businessObject.config.find((x) => x.key === "Childs")?.value && props.businessObject.config.find((x) => x.key === "Infants")?.value) {
    IsPackagePax = true;
    TotalAdults = Number(props.businessObject.config.find((x) => x.key === "Adult")?.value);
    TotalChilds = Number(props.businessObject.config.find((x) => x.key === "Childs")?.value);
    TotalInfants = Number(props.businessObject.config.find((x) => x.key === "Infants")?.value);
  }
  return (
    <div className="card shadow-sm mb-3">
      <div className="card-header">
        <h5 className="m-0 p-0">{Trans("_viewReservationDetails")}</h5>
      </div>

      <div className="card-body">
        <ul className="list-unstyled p-0 m-0">
          <li className="row">
            <label className="col-lg-3">
              {Trans("_viewBookingDate") + " : "}
            </label>
            <b className="col-lg-9">
              <Date date={props.bookingDate} />{" "}
              <Date date={props.bookingDate} format={"LT"} />
              {props.timeZone && " (" + props.timeZone + ")"}
            </b>
          </li>
          <li className="row">
            <label className="col-lg-3">{Trans("_viewStatus") + " : "}</label>
            <b className="col-lg-9">
              {Trans("_bookingStatus" + props.bookingStatus.replace(/ /g, ""))}
            </b>
          </li>
          <li className="row">
            <label className="col-lg-3">
              {Trans("_viewBookingReferenceNumber") + " : "}
            </label>
            <b className="col-lg-9">{props.bookingRefNo}</b>
          </li>
          {props.supplierBRN &&
            <li className="row">
              <label className="col-lg-3">
                {Trans("Supplier BRN") + " : "}
              </label>
              <b className="col-lg-9">{props.supplierBRN}</b>
            </li>
          }
          <li className="row">
            <label className="col-lg-3">
              {Trans("_viewItineraryName") + " : "}
            </label>
            <b className="col-lg-9">{props.itineraryName}</b>
          </li>
          <li className="row">
            <label className="col-lg-3">
              {Trans("_viewItineraryNumber") + " : "}
            </label>
            <b className="col-lg-9">{props.itineraryRefNo}</b>
          </li>
          <li className="row">
            <label className="col-lg-3">
              {Trans("_transactionToken") + " : "}
            </label>
            <b className="col-lg-9">{props.transactionToken}</b>
          </li>

          {(props.businessObject.business !== "air" && props.businessObject.business !== "vehicle") && (
            <li className="row">
              <label className="col-lg-3">
                {props.businessObject.business === "hotel" &&
                  Trans("_viewCheckIn")}
                {(props.businessObject.business === "activity" ||
                  props.businessObject.business === "package" ||
                  props.businessObject.business === "transfers" ||
                  props.businessObject.business === "transportation" ||
                  props.businessObject.business === "groundservice") && !isexcursionDiffDate &&
                  Trans("_view" + props.businessObject.business + "Date")}

                {(props.businessObject.business === "activity" ||
                  props.businessObject.business === "package" ||
                  props.businessObject.business === "transfers" ||
                  props.businessObject.business === "transportation" ||
                  props.businessObject.business === "groundservice") && isexcursionDiffDate &&
                  Trans("_startDate")}
                {" "}
                :
              </label>
              <b className="col-lg-9">
                <Date date={props.businessObject.dateInfo.startDate} />
              </b>
            </li>
          )}

          {(props.businessObject.business === "activity" ||
            props.businessObject.business === "package" ||
            props.businessObject.business === "transfers" ||
            props.businessObject.business === "transportation" ||
            props.businessObject.business === "groundservice") && isexcursionDiffDate &&
            (
              <li className="row">
                <label className="col-lg-3">{Trans("_endDate")}{" "}:</label>
                <b className="col-lg-9">
                  <Date date={props.businessObject.dateInfo.endDate} />
                </b>
              </li>
            )
          }
          {props.businessObject.business === "hotel" && (
            <React.Fragment>
              <li className="row">
                <label className="col-lg-3">
                  {Trans("_viewCheckOut") + " : "}
                </label>
                <b className="col-lg-9">
                  <Date date={props.businessObject.dateInfo.endDate} />
                </b>
              </li>
              <li className="row">
                <label className="col-lg-3">
                  {Trans("_viewNights") + " : "}
                </label>
                <b className="col-lg-9">
                  {moment(props.dateInfo.endDate).diff(
                    props.dateInfo.startDate,
                    "days"
                  )}{" "}
                  {Trans("_viewNightsSmall")}
                </b>
              </li>
              <li className="row">
                <label className="col-lg-3">
                  {"Room(s)" + " : "}
                </label>
                <b className="col-lg-9">
                  {props.businessObject.items[0].item.length}{" "}
                </b>
              </li>
              <li className="row">
                <label className="col-lg-3">
                  {"Adults" + " : "}
                </label>
                <b className="col-lg-9">
                  {TotalAdults}{" "}
                </b>
              </li>
              <li className="row">
                <label className="col-lg-3">
                  {"Children" + " : "}
                </label>
                <b className="col-lg-9">
                  {TotalChilds}{" "}
                </b>
              </li>
            </React.Fragment>
          )}

          {(props.businessObject.business === "activity" || props.businessObject.business === "transfers" ||
            (props.businessObject.business === "package" && !IsPackagePax) || props.businessObject.business === "groundservice") && props.businessShortDescription.toLowerCase() !== "custom" &&
            props.businessObject.paxInfo && (
              <li className="row">
                <label className="col-lg-3">
                  {Trans("_viewBookingFor") + " : "}
                </label>
                <b className="col-lg-9">
                  {props.businessObject.paxInfo.reduce(
                    (x, y) => x + y.quantity,
                    0
                  )}
                  {" " + (props.businessObject.business === "transfers" ? Trans("_viewTravellers") : (props.businessObject.business === "groundservice") ? Trans("_lblAdult") : Trans("_viewGuests"))}
                </b>
              </li>
            )}
          {props.businessObject.business === "package" && IsPackagePax && (
            <li className="row">
              <label className="col-lg-3">
                {Trans("_viewBookingFor") + " : "}
              </label>
              <b className="col-lg-9">
                <span>{Trans("_viewAdults") + " "} </span>{" "}<b>{TotalAdults}</b>{", " + Trans("_viewChildren") + " "}<b>{TotalChilds}</b>{", " + Trans("_viewInfant") + " "}<b>{TotalInfants}</b>
              </b>
            </li>
          )}
          {props.businessObject.business === "air" && (
            <React.Fragment>
              <li className="row">
                <label className="col-lg-3">
                  {Trans("_viewTripDirection") + " : "}
                </label>
                <b className="col-lg-9">
                  {props.businessObject.tripType.toLowerCase() === "multicity"
                    ? Trans("_airTripDirection_multidestination")
                    : props.businessObject.tripType.toLowerCase() === "roundtrip"
                      ? Trans("_airTripDirection_Roundtrip")
                      : Trans("_airTripDirection_Oneway")}
                </b>
              </li>

              <li className="row">
                <label className="col-lg-3">{Trans("_notes")} :</label>
                <label className="col-lg-9">
                  {props.businessObject.tripType.toLowerCase() === "multicity"
                    ? props.businessObject.paxInfo[0].quantity
                    : props.businessObject.paxInfo.reduce(
                      (sum, item) => sum + item.quantity,
                      0
                    )}{" "}
                  {Trans("_ticket")}{" "}
                  {props.businessObject.tripType.toLowerCase() === "multicity"
                    ? Trans("_airTripDirection_multidestination")
                    : props.businessObject.tripType.toLowerCase() === "roundtrip"
                      ? Trans("_airTripDirection_Roundtrip")
                      : Trans("_airTripDirection_Oneway")}
                </label>
              </li>

              <li className="row">
                <label className="col-lg-3">&nbsp;</label>
                <label className="col-lg-9">
                  {Trans("_allFlightTimesAreLocalToEachCity")}
                </label>
              </li>

              <li className="row">
                <label className="col-lg-3">&nbsp;</label>
                <label className="col-lg-9">
                  {Trans("_seatAssignmentAtAirportCheckInDeskOnly")}
                </label>
              </li>

              <li className="row">
                <label className="col-lg-3">&nbsp;</label>
                <label className="col-lg-9">
                  <span className="mr-3">
                    <button
                      className="btn btn-link p-0 mr-3 text-primary"
                      onClick={() => props.handleShowTerms("FareRule", props.businessObject.items)}
                    >
                      <span>{Trans("_bookingTerms")}</span>
                    </button>
                  </span>
                  <span>
                    <button
                      className="btn btn-link p-0 mr-3 text-primary"
                      onClick={() =>
                        props.handleShowTerms("TermsAndConditions")
                      }
                    >
                      <span>{Trans("_termsAndConditions")}</span>
                    </button>
                  </span>
                </label>
              </li>
            </React.Fragment>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ViewReservationDetails;
