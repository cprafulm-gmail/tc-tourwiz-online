import React, { Component } from "react";
import Date from "../../helpers/date";
import Amount from "../../helpers/amount";
import { Trans } from "../../helpers/translate";

class FailedBookingPopupHotel extends Component {
  render() {
    const { mode, viewBookingDetails } = this.props;
    const { name, dateInfo, items, locationInfo } = viewBookingDetails
      ? viewBookingDetails.businessObject
      : "";
    const travellerDetails = viewBookingDetails
      ? viewBookingDetails.travellerDetails.find(x => x.isMainPax === true)
        .details
      : "";
    return (
      <div>
        <div className="row">
          <div className="col-lg-12">
            <h5 className="text-primary">{name}</h5>
            <h6 className="text-secondary d-inline-block">
              <i
                className="fa fa-map-marker mr-2"
                aria-hidden="true"
              ></i>
              {locationInfo.fromLocation.city}
            </h6>
            <h6 className="text-secondary d-inline-block ml-4">
              <i
                className="fa fa-calendar mr-2"
                aria-hidden="true"
              ></i>
              <Date date={dateInfo.startDate} /> To{" "}
              <Date date={dateInfo.endDate} />
            </h6>
            <h6 className="text-secondary d-inline-block ml-4">
              <i
                className="fa fa-money mr-2"
                aria-hidden="true"
              ></i>
              {Trans("_supplierBaseRate")} :
              <Amount
                currencyCode={viewBookingDetails.businessObject.displayRateInfo.find(x => x.purpose === "14").currencyCode}
                amount={viewBookingDetails.businessObject.displayRateInfo.find(x => x.purpose === "14").amount}
              />{" "}
              ({viewBookingDetails.businessObject.displayRateInfo.find(x => x.purpose === "14").currencyCode})
            </h6>

          </div>
        </div>

        {mode === "view" && (
          <div className="row">
            <div className="col-lg-6">
              <label className="text-secondary mr-2">{Trans("_name")} :</label>
              <span>{travellerDetails.userDisplayName}</span>
            </div>

            <div className="col-lg-6">
              <label className="text-secondary mr-2">{Trans("_email")} :</label>
              <span>
                {travellerDetails.contactInformation.email}
              </span>
            </div>
          </div>
        )}

        <div className="row">
          <div className="col-lg-12">
            <div className="border shadow-sm mt-2 mb-4">
              <div className="table-responsive">
                <table className="table offline-booking-table m-0">
                  <thead>
                    <tr>
                      <th className="align-middle bg-light">
                        {Trans("_roomType")}
                      </th>
                      <th className="align-middle bg-light">{Trans("_pax")}</th>
                      <th className="align-middle bg-light">
                        {Trans("_lblPrice")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((items, key) => {
                      return (
                        <React.Fragment key={key}>
                          {items.item.map((item, key) => {
                            let adults =
                              item.paxInfo.find(
                                x => x.typeString === "ADT"
                              ) &&
                              item.paxInfo.find(
                                x => x.typeString === "ADT"
                              ).quantity;

                            let children =
                              item.paxInfo.find(
                                x => x.typeString === "CHD"
                              ) &&
                              item.paxInfo.find(
                                x => x.typeString === "CHD"
                              ).quantity;

                            let amount =
                              item.displayRateInfo[0].amount;

                            let roomName = item.description;

                            let boardTypes =
                              item.boardTypes &&
                              item.boardTypes[0].type;

                            return (
                              <tr key={key}>
                                <td>
                                  {roomName}
                                  {mode === "view" && (
                                    <div className="text-secondary text-small">
                                      {Trans("_boardTypes")} : {boardTypes}
                                    </div>
                                  )}
                                </td>
                                <td>
                                  <span className="text-nowrap">
                                    {adults && adults + " Adult(s)"}
                                  </span>
                                  <span className="text-nowrap">
                                    {children &&
                                      children + " Child(ren)"}
                                  </span>
                                </td>
                                <td>
                                  <Amount amount={amount} />
                                </td>
                              </tr>
                            );
                          })}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default FailedBookingPopupHotel;
