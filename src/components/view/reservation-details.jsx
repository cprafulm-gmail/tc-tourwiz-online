import React from "react";
import { Trans } from "../../helpers/translate";

const ReservationDetails = props => {
  return (
    <div className="border bg-white shadow-sm p-4 mb-3">
      <h4 className="mb-2">{Trans("_viewReservationDetails") + " : "}</h4>

      <ul className="list-unstyled p-0 m-0">
        <li>
          <label>{Trans("_viewBookingDate") + " : "}</label>
          <b>{response.bookingDate}</b>
        </li>
        <li>
          <label>{Trans("_viewStatus") + " : "}</label>
          <b>{response.bookingStatus}</b>
        </li>
        <li>
          <label>{Trans("_viewBookingReferenceNumber") + " : "}</label>
          <b>{response.bookingRefNo}</b>
        </li>
        <li>
          <label>{Trans("_viewItineraryName") + " : "}</label>
          <b>{response.itineraryName}</b>
        </li>
        <li>
          <label>{Trans("_viewItineraryNumber") + " : "}</label>
          <b>{response.itineraryRefNo}</b>
        </li>
        <li>
          <label>{Trans("_viewCheckIn") + " : "}</label>
          <b>
            <Moment format={this.state.dateFormat} date={dateInfo.startDate} />
          </b>
        </li>
        <li>
          <label>{Trans("_viewCheckOut") + " : "}</label>
          <b>
            <Moment format={this.state.dateFormat} date={dateInfo.endDate} />
          </b>
        </li>
        <li>
          <label>{Trans("_viewNights") + " : "}</label>
          <b>
            <Moment date={dateInfo.endDate} diff={dateInfo.startDate} />
          </b>
        </li>
      </ul>
    </div>
  );
};

export default ReservationDetails;
