import React, { Component } from "react";
import Date from "../../helpers/date";
import { Trans } from "../../helpers/translate";
import Amount from "../../helpers/amount";

class FailedBookingPopupHotel extends Component {
  render() {
    const { mode, viewBookingDetails } = this.props;

    const tripType = viewBookingDetails.businessObject.tripType;
    const departureDate = viewBookingDetails.businessObject.items[0].item[0].dateInfo.startDate;
    const returnDate = tripType.toLowerCase() === "roundtrip" ? viewBookingDetails.businessObject.items[1].item[0].dateInfo.startDate : null;
    const name = viewBookingDetails.travellerDetails.firstName + " " + viewBookingDetails.travellerDetails.lastName;
    const email = viewBookingDetails.travellerDetails[0].details.contactInformation.email;
    return (
      <div>
        <div className="row">
          <div className="col-lg-12">
            <h5 className="text-primary">{viewBookingDetails.businessDetails}</h5>
          </div>
          <div className="col-lg-6">
            <h6 className="text-secondary d-inline-block">
              <span>{Trans("_departureDate")} : </span>
              <i className="fa fa-calendar mr-2"
                aria-hidden="true"
              ></i>
              <Date date={departureDate} />
            </h6>
          </div>
          <div className="col-lg-6">
            <h6 className="text-secondary d-inline-block">
              {tripType.toLowerCase() === "roundtrip" &&
                <React.Fragment>
                  <span className="ml-2">{Trans("_returnDate")} : </span>
                  <i className="fa fa-calendar mr-2"
                    aria-hidden="true"
                  ></i>
                  <Date date={returnDate} />
                </React.Fragment>
              }
            </h6>
          </div>
          <div className="col-lg-6">
            <h6 className="text-secondary d-inline-block">
              {tripType.toLowerCase() === "roundtrip" &&
                <React.Fragment>
                  <span>{Trans("_supplierBaseRate")} : </span>
                  <i className="fa fa-money mr-2"
                    aria-hidden="true"
                  ></i>
                  <Amount
                    currencyCode={viewBookingDetails.businessObject.displayRateInfo.find(x => x.purpose === "14").currencyCode}
                    amount={viewBookingDetails.businessObject.displayRateInfo.find(x => x.purpose === "14").amount}
                  />{" "}
              ({viewBookingDetails.businessObject.displayRateInfo.find(x => x.purpose === "14").currencyCode})
                </React.Fragment>
              }
            </h6>
          </div>
        </div>

        {mode === "view" && (
          <div className="row">
            <div className="col-lg-6">
              <label className="text-secondary mr-2">{Trans("_name")} :</label>
              <span>{name}</span>
            </div>

            <div className="col-lg-6">
              <label className="text-secondary mr-2">{Trans("_email")} :</label>
              <span>
                {email}
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
                      <th className="align-middle bg-light">{Trans("_trip")}</th>
                      <th className="align-middle bg-light">{Trans("_date")}</th>
                      <th className="align-middle bg-light">{Trans("_airline")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {viewBookingDetails.businessObject.items.map((item, key) => {
                      return (
                        <tr key={key}>
                          <td>{item.locationInfo.fromLocation.name} ({item.locationInfo.toLocation.id}) - {item.locationInfo.toLocation.name} ({item.locationInfo.toLocation.id})</td>
                          <td>{<Date date={item.item[0].dateInfo.startDate} />}  {<Date date={item.item[0].dateInfo.startDate} format={"LT"} />}</td>
                          <td>{item.item[0].vendors.find(x => x.type === "operatingAirline").item.name}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <table className="table offline-booking-table m-0">
                  <thead>
                    <tr>
                      <th className="align-middle bg-light">{Trans("_passenger")}</th>
                      <th className="align-middle bg-light">{Trans("_birthdate")}</th>
                      <th className="align-middle bg-light">{Trans("_documentType")}</th>
                      <th className="align-middle bg-light">{Trans("_documentNumber")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {viewBookingDetails.travellerDetails.map((item, key) => {
                      return (
                        <tr key={key}>
                          <td>{item.details.firstName} {item.details.lastName}</td>
                          <td>{<Date date={item.details.birthDate} />}</td>
                          <td>{item.details.documentType}</td>
                          <td>{item.details.documentNumber}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div >
      </div>
    );
  }
}

export default FailedBookingPopupHotel;
